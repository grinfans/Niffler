import fs from 'fs'
const fse = require('fs-extra')
const path = require('path')
import {exec, execFile, spawn, fork} from 'child_process'

import axios from 'axios'
require('promise.prototype.finally').shim();

import log from './logger'
import {platform, grinWalletPath, seedPath, grinNode, grinNode2, chainType, 
    nodeApiSecretPath, ownerApiSecretPath, walletTOMLPath, walletPath, walletConfigPath,
    tempTxDir, gnodeOption} from './config'
import { messageBus } from '../renderer/messagebus'
import GnodeService from './gnode'
import dbService from '../renderer/db'

let ownerAPI
let listenProcess
let checkProcess
//let initRProcess
let restoreProcess
let processes = {}
let client
let password_
const walletHost = 'http://localhost:3420'
const jsonRPCUrl = 'http://localhost:3420/v2/owner'
const jsonRPCForeignUrl = 'http://localhost:3420/v2/foreign'

function enableForeignApi(){
    const re = /owner_api_include_foreign(\s)*=(\s)*false/
    if(fs.existsSync(walletTOMLPath)){
        let c = fs.readFileSync(walletTOMLPath).toString()
        if(c.search(re) != -1){
            log.debug('Enable ForeignApi to true')
            c = c.replace(re, 'owner_api_include_foreign = true')
            fs.writeFileSync(walletTOMLPath, c)
        }
    }
}

function execPromise(command) {
    return new Promise(function(resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

function addQuotations(s){
    return '"' + s +'"'
}
class WalletService {
    static initClient() {
        if(fs.existsSync(ownerApiSecretPath)){
            client = axios.create({
                baseURL: walletHost,
                auth: {
                    username: 'grin',
                    password: fs.readFileSync(ownerApiSecretPath).toString()
                },
            })
        }else{
            client = axios.create({baseURL: walletHost})
        }
    }
    
    static setPassword(password){
        password_ = password
    }

    static passwordUndefined(){
        if(!password_)return true
        return false
    }

    static jsonRPC(method, params, isForeign){
        const headers = {
            'Content-Type': 'application/json'
        }
        const body = {
            jsonrpc: "2.0",
            id: +new Date(),
            method: method,
            params: params,
        }
        const url = isForeign?jsonRPCForeignUrl:jsonRPCUrl
        return client.post(url, body, headers)
    }
    
    static getNodeHeight(){
        if(client){
            return WalletService.jsonRPC('node_height', [], false)
        }
    }

    static getAccounts(){
        if(client){
            return WalletService.jsonRPC('accounts', [], false)
        }
    }
    
    static getSummaryInfo(minimum_confirmations){
        return WalletService.jsonRPC('retrieve_summary_info', [true, minimum_confirmations], false)
    }

    static getTransactions(toRefresh, tx_id, tx_salte_id){
        return WalletService.jsonRPC('retrieve_txs', [toRefresh, tx_id, tx_salte_id], false)
    }

    static getCommits(include_spent, toRefresh, tx_id){
        return WalletService.jsonRPC('retrieve_outputs', [include_spent, toRefresh, tx_id], false)
    }

    static cancelTransactions(tx_id, tx_salte_id){
        return WalletService.jsonRPC('cancel_tx', [tx_id, tx_salte_id])
    }

    static receiveTransaction(slate, account, message){
        return WalletService.jsonRPC('receive_tx', [slate, account, message], true)
    }

    static issueSendTransaction(tx_data){
        return WalletService.jsonRPC('init_send_tx',  {'args': tx_data})
    }

    static lock_outputs(slate, participant_id){
        return WalletService.jsonRPC('tx_lock_outputs',  [slate, participant_id])
    }

    static finalizeTransaction(slate){
        return WalletService.jsonRPC('finalize_tx',  [slate])
    }

    static postTransaction(tx, isFluff){
        return WalletService.jsonRPC('post_tx',  [tx, isFluff])
    }
 
    static startOwnerApi(password, grinNodeToConnect){
        //WalletService.stopProcess('ownerAPI')
        console.log('grinNodeToConnect:' + grinNodeToConnect)
        enableForeignApi()
        
        if(platform === 'linux'){
            ownerAPI = execFile(grinWalletPath, ['-r', grinNodeToConnect, 'owner_api']) 
        }else{
            const cmd = platform==='win'? `${grinWalletPath} -r ${grinNodeToConnect} --pass ${addQuotations(password)} owner_api`:
                                        `${grinWalletPath} -r ${grinNodeToConnect} owner_api`
            //log.debug(`platform: ${platform}; start owner api cmd: ${cmd}`)
            ownerAPI =  exec(cmd)
        }
        processes['ownerAPI'] = ownerAPI
        log.debug('ownerAPIProcessPID: ' + ownerAPI.pid)
        if(platform==='win'){
            localStorage.setItem('ownerAPIProcessPID', ownerAPI.pid)
        }

        ownerAPI.stdout.on('data', (data)=>{
            if(platform!='win'){ownerAPI.stdin.write(password+'\n')}
            localStorage.setItem('ownerAPIProcessPID', ownerAPI.pid)
        })
        ownerAPI.stderr.on('data', (data) => {
            log.error('start owner_api got stderr: ' + data)
        })
    }

    static restartOwnerApi(password, grinNodeToConnect){
        WalletService.stopProcess(ownerAPI)
        setTimeout(()=>{
            WalletService.startOwnerApi(password, grinNodeToConnect)
        }, 500)
    }
    
    static startListen(gnode, password=password_){
        WalletService.stopProcess('listen')
        if(platform==='linux'){
            listenProcess =  execFile(grinWalletPath, ['-r', gnode, '-e', 'listen']) 
        }else{
            const cmd = platform==='win'? `${grinWalletPath} -r ${gnode} -e --pass ${addQuotations(password)} listen`:
                                        `${grinWalletPath} -r ${gnode} -e listen`
            //log.debug(`platform: ${platform}; start listen cmd: ${cmd}`)
            listenProcess =  exec(cmd)
        }
        processes['listen'] = listenProcess
        if(platform==='win'){
            localStorage.setItem('listenProcessPID', listenProcess.pid)
        }

        listenProcess.stdout.on('data', (data)=>{
            if(platform!='win'){
                listenProcess.stdin.write(password+'\n')
            }
            localStorage.setItem('listenProcessPID', listenProcess.pid)
        })
        listenProcess.stderr.on('data', (data) => {
            log.error('start wallet listen got stderr: ' + data)
        })
    }

    static stopAll(){
        for(var ps in processes){
            log.debug('stopall ps: '+ ps)
            if(processes[ps]){
                log.debug('stopall try to kill '+ ps)
                WalletService.stopProcess(ps)
            }
        }
        
        if(!gnodeOption.useLocalGnode || 
           (!gnodeOption.background && dbService.getLocalGnodeStatus()=='running')){
            log.debug('Try to stop local gnode.')
            GnodeService.stopGnode2()
        }
    }
    
    static isExist(){
        return fs.existsSync(seedPath)?true:false
    }

    static isWalletConfigExist(){
        return fs.existsSync(walletConfigPath)?true:false
    }

    static new(password){
        const cmd = platform==='win'? `${grinWalletPath} --pass ${addQuotations(password)} init`:
                                      `${grinWalletPath} init`
        log.debug(`function new: platform: ${platform}; grin bin: ${grinWalletPath}`); 
        let createProcess = exec(cmd)
        createProcess.stdout.on('data', (data) => {
            let output = data.toString()
            //log.debug('init process return: '+output)
            if (output.includes("Please enter a password for your new wallet")){
                log.debug('function new: time to entry password.')
                createProcess.stdin.write(password + "\n");
                createProcess.stdin.write(password + "\n");
            }
            if(output.includes("Invalid Arguments: Not creating wallet - Wallet seed file exists")){
                log.debug('function new: walletExisted')
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
                wordSeedWithoutLog = wordSeedWithoutLog.replace("= ","").trim();
                //log.debug(`wordSeed: ${wordSeed}; wordSeedWithoutLog: ${wordSeedWithoutLog}`)
                log.debug(`function new: walletCreated with seed of length ${wordSeedWithoutLog.length}.`)
                return messageBus.$emit('walletCreated', wordSeedWithoutLog)
            }
        })
        createProcess.stderr.on('data', (data) => {
            log.error('Process:init new wallet got stderr: ' + data)
            return messageBus.$emit('walletCreateFailed', data)
        })
    }

    static createSlate(amount, version){
        fse.ensureDirSync(tempTxDir)

        return new Promise(function(resolve, reject) {
            let fn = path.join(tempTxDir, String(Math.random()).slice(2) + '.temp.tx')
            WalletService.send(amount, 'file', fn, version).then((data)=>{
                fs.readFile(fn, function(err, buffer) {
                    if (err) return reject(err)
                    //fse.remove(fn)
                    return resolve(JSON.parse(buffer.toString()))
                });
            }).catch((err)=>{
                return reject(err)
            })
        })
    }

    static finalizeSlate(slate){
        let fn = path.join(tempTxDir, String(Math.random()).slice(2) + '.temp.tx.resp')
        fs.writeFileSync(fn, JSON.stringify(slate))
        return WalletService.finalize(fn)
    }

    static check(cb, gnode){
        let grin = grinWalletPath
        if(platform==='win'){
            grin = grinWalletPath.slice(1,-1)
        }
        checkProcess = spawn(grin, ['-r', gnode, '-p', password_, 'scan', '-d']);
        let ck = checkProcess
        processes['check'] = checkProcess
        localStorage.setItem('checkProcessPID', checkProcess.pid)

        ck.stdout.on('data', function(data){
            let output = data.toString()
            cb(output)
        })
        ck.stderr.on('data', function(data){
            let output = data.toString()
            cb(output)
        })
        ck.on('close', function(code){
            log.debug('grin wallet check exists with code: ' + code);
            if(code==0){return messageBus.$emit('walletCheckFinished')}
        });
    }

    static restore(password, cb){
        let grin = grinWalletPath
        if(platform==='win'){
            grin = grinWalletPath.slice(1,-1)
        }
        restoreProcess = spawn(grin, ['-r', grinNode2, '-p', password, 'scan']);
        let rs = restoreProcess
        processes['restore'] = restoreProcess
        localStorage.setItem('restoreProcessPID', restoreProcess.pid)
        
        log.debug('grin wallet restore process running with pid: ' + restoreProcess.pid);

        rs.stdout.on('data', function(data){
            let output = data.toString()
            cb(output)
        })
        rs.stderr.on('data', function(data){
            let output = data.toString()
            cb(output)
        })
        rs.on('close', function(code){
            log.debug('grin wallet restore exists with code: ' + code);
            if(code==0){return messageBus.$emit('walletRestored')}
        });
    }

    //https://github.com/mimblewimble/grin-wallet/issues/110
    //static initR(seeds, newPassword){
    //    log.debug(grinWalletPath)
    //    initRProcess = spawn(grinWalletPath, ['init', '-r']);
    //    localStorage.setItem('initRProcessPID', initRProcess.pid)
    //    initRProcess.stdout.on('data', (data) => {
    //        let output = data.toString()
    //        log.debug('Wallet initR process return: ' + output)
    //        if (output.includes("Please enter your recovery phrase:")){
    //            log.debug('function initR: time to entry seeds.')
    //            initRProcess.stdin.write(seeds + "\n");
    //        }
    //        if (output.includes("Recovery word phrase is invalid")){
    //            log.debug('function initR: invalid seeds.')
    //            stopProcess('initR')
    //            return messageBus.$emit('invalidSeeds')
    //        }
    //        if (output.startsWith("Password:")){
    //            log.debug('function initR: time to entry password.')
    //            initRProcess.stdin.write(newPassword + "\n");
    //            initRProcess.stdin.write(newPassword + "\n");
    //        }
    //        if(output.includes("Command 'init' completed successfully")){
    //            log.debug('function initR: wallet initRed.')
    //            return messageBus.$emit('walletInitRed')
    //        }
    //    })
    //}
    
    static stopProcess(processName){
        let pidName = `${processName}ProcessPID`
        const pid = localStorage.getItem(pidName)
        log.debug(`try to kill ${processName} with pid (get from ${pidName}) : ${pid}`)
        localStorage.removeItem(pidName)

        if(platform==='win'&&pid){
            return exec(`taskkill /pid ${pid} /f /t`)
        }
        
        if(processes[processName]){
            processes[processName].kill('SIGKILL')
            log.debug(`kill ${processName}`)
        }
        if(pid) {
            try{
                process.kill(pid, 'SIGKILL')
            }catch(e){
                log.error(`error when kill ${processName} ${pid}: ${e}` )
            }
        }
    }

    static killGrinWallet(){
        if(platform!=='win'){
            exec('pkill grin-wallet')
        }else{
            exec('taskkill -f /im grin-wallet.exe')
        }
    }
}
WalletService.initClient()
export default WalletService