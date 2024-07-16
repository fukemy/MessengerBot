import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import localtunnel from "localtunnel";
import { postWebhook, getWebhook, convert, redirect, whatappget, whatapppost } from './controllers/HomeController'
import { loginzalo, zalowebhook } from './controllers/ZaloController'
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = 8081;
let localtunnelPort = 8888;

//config view engine
// viewEngine(app)

//config web routes
// webRoutes(app);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/src/views/homepage.html')
})
app.get('/style.css', (req, res) => {
  res.sendFile(process.cwd() + '/src/views/style.css')
})
app.get('/script.js', (req, res) => {
  res.sendFile(process.cwd() + '/src/views/script.js');
})
app.get('/result.mp3', (req, res) => {
  res.sendFile(process.cwd() + '/src/controllers/result.mp3');
})
app.post('/webhook', postWebhook)
app.get('/webhook', getWebhook)
// app.post('/convert', convert)
// app.get('/redirect', redirect)
// app.get('/loginzalo', loginzalo)
// app.post('/zalowebhook', zalowebhook)
// app.get('/whatappget', whatappget)
// app.post('/whatapppost', whatapppost)

app.listen(port, () => {
  console.log("express ready");
});

// (async () => {
//   const tunnel = await localtunnel({
//     subdomain: 'whatsapptest',
//     port: port
//   });

//   // the assigned public url for your tunnel
//   // i.e. https://abcdefgjhij.localtunnel.me
//   console.log('tunnel', tunnel.url)

//   tunnel.on('close', () => {
//     // tunnels are closed
//     console.log('tunnel closed')
//   });
// })();

// Verify that the callback came from Facebook.
const verifyRequestSignature = (req, res, buf) => {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature" in headers.`);
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
};
