import fs from 'fs'
import {exec} from 'child_process'

import axios from 'axios'
require('promise.prototype.finally').shim();

import log from './logger'
import {grinPath, seedPath, grinNode, chainType, apiSecretPath, walletTOMLPath} from './config'
import { messageBus } from '../renderer/messagebus'

let ownerAPI
let listenProcess
const wallet_host = 'http://localhost:3420'

const client = axios.create({
    baseURL: wallet_host,
    auth: {
        username: 'grin',
        password: fs.readFileSync(apiSecretPath).toString()
    },
})

function enableForeignApi(){
    const re = /owner_api_include_foreign(\s)*=(\s)*false/
    let c = fs.readFileSync(walletTOMLPath).toString()
    if(c.search(re) != -1){
        log.debug('Enable ForeignApi to true')
        c = c.replace(re, 'owner_api_include_foreign = true')
        fs.writeFileSync(walletTOMLPath, c)
    }
}

class WalletSerice {
    static getNodeHeight(){
        return client.get('/v1/wallet/owner/node_height')
    }
    static getSummaryInfo(minimum_confirmations){
        const url = `/v1/wallet/owner/retrieve_summary_info?refresh&minimum_confirmations=${minimum_confirmations}`
        return client.get(url)
    }
    static getTransactions(){
        return client.get('/v1/wallet/owner/retrieve_txs?refresh')
    }
    static getCommits(show_spent=true){
        const url = show_spent?
            '/v1/wallet/owner/retrieve_outputs?refresh&show_spent':
            '/v1/wallet/owner/retrieve_outputs?refresh'
        return client.get(url)
    }
    static cancelTransactions(tx_id){
        const url = `/v1/wallet/owner/cancel_tx?tx_id=${tx_id}`
        return client.post(url)
    }
    static receiveTransaction(tx_data){
        return client.post('/v1/wallet/foreign/receive_tx', tx_data)
    }
    static issueSendTransaction(tx_data){
        return client.post('/v1/wallet/owner/issue_send_tx', tx_data)
    }
    static finalizeTransaction(tx_data){
        return client.post('/v1/wallet/owner/finalize_tx', tx_data)
    }
    static postTransaction(tx_data, isFluff){
        const url = isFluff?
            '/v1/wallet/owner/post_tx?fluff':
            '/v1/wallet/owner/post_tx'
        return client.post(url, tx_data)
    }

    static start(password){
        enableForeignApi()
        const cmd = `${grinPath} wallet -r ${grinNode} owner_api`
        ownerAPI =  exec(cmd)
        ownerAPI.stdout.on('data', (data)=>{
            ownerAPI.stdin.write(password+'\n')
            //localStorage.setItem('OwnerAPIPID', ownerAPI.pid)
        })
        ownerAPI.stderr.on('data', (data) => {
            log.error('start owner_api got stderr: ' + data)
        })
    }

    static stop(){
        if(ownerAPI){
            ownerAPI.kill('SIGKILL')
            log.debug('kill owner_api')
        }
        //else{
        //  const pid = localStorage.getItem('OwnerAPIPID')
        //  if(pid) process.kill(pid, 'SIGKILL')
        //}
    }
    
    static startListen(password){
        const cmd = `${grinPath} wallet -e listen`
        listenProcess =  exec(cmd)
        listenProcess.stdout.on('data', (data)=>{
            listenProcess.stdin.write(password+'\n')
        })
        listenProcess.stderr.on('data', (data) => {
            log.error('start wallet listen got stderr: ' + data)
        })
    }

    static stopListen(){
        if(listenProcess){
            listenProcess.kill('SIGKILL')
            log.debug('kill wallet listen process')
        }
    }
    static stopAll(){
        WalletSerice.stopListen()
        WalletSerice.stop()
    }
    static isExist(){
        return fs.existsSync(seedPath)?true:false
    }

    static new(password){
        const cmd = `${grinPath} wallet -r ${grinNode} init`
        let createProcess = exec(cmd)
        createProcess.stdout.on('data', (data) => {
            var output = data.toString()
            if (output.includes("Please enter a password for your new wallet")){
                createProcess.stdin.write(password + "\n");
                createProcess.stdin.write(password + "\n");
            }
            if(output.includes("Invalid Arguments: Not creating wallet - Wallet seed file exists")){
                return messageBus.$emit('walletExisted')
            }
            if(output.includes("Please back-up these words in a non-digital format.")){
                var wordSeed = data.toString();
                
                wordSeed = wordSeed.replace("Your recovery phrase is:","");
                wordSeed = wordSeed.replace("Please back-up these words in a non-digital format.","");
                
                wordSeed = wordSeed.replace(/(\r\n|\n|\r)/gm, "");
                wordSeed = wordSeed.replace("wallet.seed","wallet.seed ==   ");
                var wordSeedWithLog = wordSeed;
                var wordSeedWithoutLog = wordSeedWithLog.substring(wordSeedWithLog.indexOf("==")+1);
                wordSeedWithoutLog = wordSeedWithoutLog.trim();
                wordSeedWithoutLog = wordSeedWithoutLog.replace("= ","");
                return messageBus.$emit('walletCreated', wordSeedWithoutLog)
            }
        })
        createProcess.stderr.on('data', (data) => {
            log.error('Process:init new wallet got stderr: ' + data)
        })
    }
}
export default WalletSerice