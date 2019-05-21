var path = require('path')
var argv = require("optimist").argv
var fse = require('fs-extra')

var grin = require('./index.node')

process.env['check_node_api_http_addr']= argv.node_api_http_addr.toString()
process.env['node_api_secret_path']= argv.node_api_secret_path?argv.node_api_secret_path.toString():""
var seeds = argv.seeds.toString()
var password = argv.password.toString()

var dir_ = argv.wallet_dir.toString()
fse.ensureDirSync(path.join(dir_, 'wallet_data'))

let ret = grin.wallet_recovery(dir_, seeds, password, argv.node_api_http_addr)
//console.log('ret: ' + ret)

let msg
if(ret==='success'){
    msg = {'ret': 'ok'}
}else if(ret==='"BIP39 Mnemonic (word list) Error"'){
    msg = {'ret': 'invalidSeeds'}
}else{
    msg = {'ret': ret}
}
process.send(msg)