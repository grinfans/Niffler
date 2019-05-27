var cp = require('child_process')
var hedwigServer = 'https://v1.hedwig.im'
var hedwigApp = 'Niffler'
var hedwigPort = '8080'
let args = ['--server', hedwigServer, '--app', hedwigApp, '--port', hedwigPort, 
            '--subdomain', String(Math.random()).slice(2)]
hedwig = cp.fork('./client.js', args)
hedwig.on('error', (err) => {
    console.log(`error when try to start hedwig: ${err}`)
})
hedwig.on('message', (msg)=>{
    console.log('Msg received: %0', msg)
})
            