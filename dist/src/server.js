import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './configs/viewEngine'
import webRoutes from './routes/web'
import localtunnel from 'localtunnel'

let app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let port = process.env.PORT || 8080
let localtunnelPort = 8081

//config view engine
// viewEngine(app)

//config web routes
webRoutes(app)

app.listen(localtunnelPort, () => {
    console.log('express ready')
})

// localtunnel({
//     subdomain: 'messengerbot',
//     port: localtunnelPort,
// }).then(tunnel => {
//     console.log(`Localtunnel available at: ${tunnel.url}`);

// }).catch(error => {
//     console.log('tunnel error', error)
// })

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
}