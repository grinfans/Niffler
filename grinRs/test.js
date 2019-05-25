var cp = require('child_process')
var path = require('path')

var apiSecretPath = 'C:/Users/xiaoj/.grin/main/.api_secret'
var walletPath = 'C:/Users/xiaoj/.grin/main'
var seeds = 'nurse chuckle view goddess wrist uncover spy youth mechanic result mad obey once frog swim ecology athlete link lottery size lab uncover force glory'

var grinRsWallet = path.resolve('C:/Users/xiaoj/Documents/GitHub/niffler/grinRs/wallet.js')
var nodeExecutable = path.resolve('C:/Users/xiaoj/Documents/GitHub/niffler/grinRs/node.exe')
let args = [grinRsWallet, '--node_api_http_addr', 'http://grin-fans.org:3413', '--node_api_secret_path', path.resolve(apiSecretPath),
'--wallet_dir', path.resolve(walletPath), '--seeds', seeds,
'--password', '123']

var rcProcess = cp.spawn(nodeExecutable, args)
rcProcess.stdout.on('data', function(data){
    let output = data.toString()
    console.log('rcProcess stdout:', output)
})
rcProcess.stderr.on('data', function(data){
    let output = data.toString()
    console.log('rcProcess stderr:', output)
})
rcProcess.on('close', function(code){
    console.log('grin wallet check exists with code: ' + code);
});

