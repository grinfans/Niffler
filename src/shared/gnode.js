import fs from 'fs'
import {exec, execFile} from 'child_process'

import axios from 'axios'
require('promise.prototype.finally').shim();

import log from './logger'
import {gnodeOption, grinPath, nodeApiSecretPath, nodeTOMLPath, platform, grinNode} from './config'
import { messageBus } from '../renderer/messagebus'

let client
let clietForRemote
let gnodeProcess
const gnodeHost = 'http://localhost:3413'

const gnodeRemoteHost = grinNode

function disableTUI(){
    const re = /run_tui(\s)*=(\s)*true/
    if(fs.existsSync(nodeTOMLPath)){
        let c = fs.readFileSync(nodeTOMLPath).toString()
        if(c.search(re) != -1){
            log.debug('Disable tui.')
            c = c.replace(re, 'run_tui = false')
            fs.writeFileSync(nodeTOMLPath, c)
        }
    }
}

function enableArchiveMode(){
    const re = /archive_mode(\s)*=(\s)*false/
    if(fs.existsSync(nodeTOMLPath)){
        let c = fs.readFileSync(nodeTOMLPath).toString()
        if(c.search(re) != -1){
            log.debug('enable archive_mode.')
            c = c.replace(re, 'archive_mode = true')
            fs.writeFileSync(nodeTOMLPath, c)
        }
    }
}

class GnodeService {
    static initClient() {
        if(fs.existsSync(nodeApiSecretPath)){
            client = axios.create({
                baseURL: gnodeHost,
                auth: {
                    username: 'grin',
                    password: fs.readFileSync(nodeApiSecretPath).toString()
                },
            })
        }else{
            client = axios.create({baseURL: gnodeHost})
        }
    }
    static getStatus(){
        return client.get('/v1/status')
    }
    static getPeersConnected(){
        return client.get('/v1/peers/connected')
    }

    static startGnode(){
        disableTUI()
        //enableArchiveMode()
        if(platform === 'linux'){
            gnodeProcess = execFile(grinPath) 
        }else{
            gnodeProcess = exec(grinPath) 
        }
        log.debug('gnodeProcess PID: ' + gnodeProcess.pid)
        if(platform==='win'){
            localStorage.setItem('gnodeProcessPID', gnodeProcess.pid)
        }
        gnodeProcess.stderr.on('data', (data) => {
            log.error('start grin node got stderr: ' + data)
        })
        messageBus.$emit('gnodeStarting')
    }

    static stopGnode(){
        let pidName = 'gnodeProcessPID'
        const pid = localStorage.getItem(pidName)
        log.debug(`try to kill gnode process with pid (get from ${pidName}) : ${pid}`)
        localStorage.removeItem(pidName)

        if(platform==='win'&&pid){
            return exec(`taskkill /pid ${pid} /f /t`)
        }
        
        if(gnodeProcess){
            gnodeProcess.kill('SIGKILL')
            log.debug("killing gnodeProcess by gnodeProcess.kill('SIGKILL'). ")
        }
        if(pid) {
            try{
                process.kill(pid, 'SIGKILL')
            }catch(e){
                log.error(`error when kill ${processName} ${pid}: ${e}` )
            }
        }
    }

    static stopGnode2(){
        if(process.platform!=='win32'){
            exec('pkill grin$')
        }else{
            exec('taskkill -f /im grin.exe')
        }
    }

    static restartGnode(){
        GnodeService.stopGnode2()
        setTimeout(()=>GnodeService.startGnode(), 3000)
    }
}
GnodeService.initClient()
export default GnodeService

export class RemoteGnodeService{
    static initClient(nodeURL, apiSecret) {
        if(apiSecret){
            clietForRemote = axios.create({
                    baseURL: nodeURL,
                    auth: {
                        username: 'grin',
                        password: apiSecret
                    },
                })
        }else{
            clietForRemote = axios.create({baseURL: nodeURL})
        }
    }
    static getStatus(){
        return clietForRemote.get('/v1/status')
    }
}
RemoteGnodeService.initClient(gnodeRemoteHost, null)
