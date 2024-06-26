// import { configDotenv } from "dotenv";
require("dotenv").config();
import request from "request";
import {
  postback1m6Response,
  message1m6_1,
  allProductResponse,
  gptResponse,
  welcomeResponse,
  requireCustomerInfoResponse,
  WHAT_IS,
  DIFFERENCE_BETWEEN
} from "../public/messageAssets";
import { text } from "body-parser";
const { Text2Speech } = require('better-node-gtts')
const path = require("path")
const gtts = new Text2Speech('vi')
const fs = require("fs");

const convert = (req, res) => {
  const { text } = req.body
  let pathToSave = path.join(__dirname, "result.mp3")
  try {
    gtts.save(pathToSave, text).then(() => {
      res.send('ok')
    }).catch(error => {
      console.log('error', error)
      res.status(400).send(error)
    })
  } catch (error) {
    console.log('fatal error', error)
    res.status(400).send(error)
  }
}

const getHomePage = (req, res) => {
  // return res.render('homepage.ejs', { gtts: gtts, path: path })
  const homepage = process.cwd() + '/src/views/homepage.html'
  return res.sendFile(homepage)
}

const getWebhook = (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  console.log("WEBHOOK_VERIFIED", req.query);
  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      // console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

const postWebhook = (req, res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`)

  // Check if this is an event from a page subscription
  if (body && body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async function (entry) {

      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let messaging = entry.messaging
      if (messaging == null) { return }
      if (messaging.length == 0) { return }
      let webhook_event = entry.messaging[0];
      console.log('webhook_event', webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender?.id;
      if (sender_psid) {
        console.log('Sender PSID: ' + sender_psid);
        await markSeen(sender_psid)
        await callSetTypingOn(sender_psid)

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message?.text) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        } else if (webhook_event.messaging_customer_information) {
          console.dir('found user shipping address', JSON.stringify(webhook_event.messaging_customer_information))
          callSendAPI(sender_psid, { "text": "Cám ơn bạn, nhà mình sẽ liên hệ với bạn trong thời gian sớm nhất có thể 🥰" });
        } else {
          console.error('webhook event not found')
          handleMessage(sender_psid, { "text": "Xin chào 🤓" });
        }
      } else if (webhook_event.field === 'group_feed') {
        //group_feed => private reply 
        //https://developers.facebook.com/docs/messenger-platform/discovery/private-replies
        const comment_id = webhook_event.from.id
        handleGroupFeed(comment_id, webhook_event)
      }

    });
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}


// Handles messages events
async function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = await gptResponse(received_message.text)
    callSendAPI(sender_psid, response);
  }
  // Sends the response message
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === '1m6' || payload === '1m8' || payload === '2m2') {
    // response = postback1m6Response
    for (let i = 0; i < message1m6_1.length - 1; i++) {
      await callSendAPI(sender_psid, message1m6_1[i])
    }
    await sleep(1000)
    callSendAPI(sender_psid, message1m6_1[message1m6_1.length - 1])
    return
  } else if (payload === 'GET_STARTED') {
    await callSendAPI(sender_psid, welcomeResponse)
    await sleep(1000)
    response = allProductResponse
  } else if (payload === 'BUY_1m6') {
    // response = { 'text': 'Bình tĩnh nha' }
    response = requireCustomerInfoResponse
  } else if (payload === 'GO_SHOPPE_1m6') {
    response = { 'text': 'Chưa có link shoppe' }
  } else if (payload == 'WHAT_IS') {
    await sleep(1000)
    // response = { 'text': WHAT_IS }
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "I would love to hear your feedback on your last order. Could you fill out this quiz? 🤔",
          "buttons": [
            {
              "type": "web_url",
              "url": "https://zerochat.us/embedded/chat?c=eyJ0aGVtZSI6ImxpZ2h0IiwiYWdlbnRJZCI6IjVIRDJKZDA0NjBPTS1rLW83WTlOcFEiLCJhZ2VudE5vZGVBZGRyZXNzIjoiaHR0cHM6Ly9hZ25vZGUxLnplcm9jaGF0LnVzIn0%3D",
              "webview_height_ratio": "full",
              "messenger_extensions": false,
              "title": "Chatbot now"
            },
          ]
        }
      }
    }
  } else if (payload == 'COMPARE_DIFFERENCE') {
    await sleep(1000)
    response = { 'text': DIFFERENCE_BETWEEN }
  } else if (payload == 'SHOULD_BUY') {
    response = await gptResponse('Có nên mua chiếu điều hoà?')
  }
  // Send the message to acknowledge the postback
  if (response) {
    callSendAPI(sender_psid, response);
  }
}

async function handleGroupFeed(comment_id, received_groupfeed) {
  const response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Of course, what is your budget for the gift?",
        "buttons": [
          {
            "type": "postback",
            "title": "LESS THAN $20",
            "payload": "GIFT_BUDGET_20_PAYLOAD"
          },
          {
            "type": "postback",
            "title": "$20 TO $50",
            "payload": "GIFT_BUDGET_20_TO_50_PAYLOAD"
          },
          {
            "type": "postback",
            "title": "MORE THAN $50",
            "payload": "GIFT_BUDGET_50_PAYLOAD"
          }
        ]
      }
    }
  }
  callSendPrivateReply(comment_id, response)
}

// Sends response messages via the Send API
const callSendPrivateReply = async (comment_id, response) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "comment_id": comment_id
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('callSendPrivateReply message sent!', body)
    } else {
      console.error("callSendPrivateReply error:" + err);
    }
  });
}

// Sends response messages via the Send API
const callSendAPI = async (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!', body)
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

const callSetTypingOn = async (sender_psid) => {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "sender_action": "typing_on",
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    // if (!err) {
    //   console.log('callSetTypingOn sent!', body)
    // } else {
    //   console.error("Unable to callSetTypingOn:" + err);
    // }
  });
}

const markSeen = async (sender_psid) => {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "sender_action": "mark_seen",
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    // if (!err) {
    //   console.log('callSetTypingOn sent!', body)
    // } else {
    //   console.error("Unable to callSetTypingOn:" + err);
    // }
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = { getHomePage, postWebhook, getWebhook, convert }