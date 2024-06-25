import { postWebhook, getWebhook, convert } from '../controllers/HomeController'

let initWebRoutes = (app) => {
    // router.get('/', getHomePage)
    // router.post('/webhook', postWebhook)
    // router.get('/webhook', getWebhook)
    // return app.use('/', router)

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
    app.post('/convert', convert)
}

module.exports = initWebRoutes