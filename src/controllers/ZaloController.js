
import request from "request";
require("dotenv").config();

let access_token = '_MWh89fTM47xRoqidrnRIVPj82oKH1GRWX8_2B0bIs-7Irbre0ToQvvFTrIP1LLJc6mdOfzP37_zB3TeuHbDNeDJNcU57cTvZKuHRxy7EmAmDJmcjmKQ7A9W01g7C0yNv585A_4TAKZsKrDSm6n7NDLSI7kyDLmTtbX03Vi-InRJOpy1ymKLOknD4Kta0WXm_cuDLEOwANFUH0vWkoa1GPCP04MhAJTQpaOvIVGB9L_KJILkpnC23x9XR32N7sq_es9y0B8HQ0oNKne9ldagFOK_9Go-2HuGgpfi88qB5mBgVM1kwKXCTlqQOsN3UXD2znCPGV5W2qkOFGjwabuGVP4OEqkHUqv8iXvlIePkQ57l179zZNPbVUavRdAAHbjDg29tUi5VUs3-FKnpp6vkKgyU7NDbIr07GrMPGLf5'

const fs = require('node:fs');
fs.readFile(__dirname + '/zalo.txt', (err, data) => {
    if (err) {
        // console.log('error')
    } else {
        access_token = data.toString()
    }
});


// app.get('/loginzalo', loginzalo)
// app.post('/zalowebhook', zalowebhook)

const loginzalo = async (req, res) => {
    console.log('login zalo', req.query)
    const { code } = req.query
    try {
        const oaAccessToken = await getOaAccessToken(code)
        console.log('accessToken', oaAccessToken)
        access_token = oaAccessToken.access_token
        fs.writeFile(__dirname + '/zalo.txt', access_token, err => {
            if (err) {
                console.error(err);
            }
        });

        res.sendStatus(200)
    } catch (error) {
        res.status(400).send(error)
    }
}

const zalowebhook = (req, res) => {
    const { body } = req
    console.log('zalowebhook', body)
    if (body && body.message) {
        sendMessage(req.body)
    }
    res.sendStatus(200)
}

const getOaAccessToken = async (code) => {
    const promise = new Promise((resolve, reject) => {
        const url = `https://oauth.zaloapp.com/v4/oa/access_token?code=${code}&grant_type=authorization_code&app_id=2072041568445096802`
        request({
            uri: url,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'secret_key': 'q87Wvwqj6z4hUtpLP1YR'
            }
        }, (err, res, body) => {
            if (!err && !body.includes('error')) {
                console.log('getOaAccessToken success', body)
                resolve(JSON.parse(body))
            } else {
                console.error("getOaAccessToken error:" + err + body);
                if (err) { reject(err) }
                else { reject(body) }
            }
        })
    })
    return promise
}

const refreshToken = async () => {

}

const sendMessage = (data) => {
    const url = `https://openapi.zalo.me/v3.0/oa/message/cs`
    request({
        uri: url,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'access_token': access_token
        },
        body: JSON.stringify({
            "recipient": {
                "user_id": data.user_id_by_app
            },
            "message": {
                "text": 'hihihi xin chao',
                'quote_message_id': data.message.msg_id
            }
        })
    }, (err, res, body) => {
        if (!err && !body.error) {
            console.log('sendMessage success', body)
        } else {
            console.error("sendMessage error:" + err + body);
        }
    })
}


module.exports = { loginzalo, zalowebhook }