import fs from 'fs'
import {exec, execFile} from 'child_process'

import axios from 'axios'
require('promise.prototype.finally').shim();

import log from './logger'
import {gnodeOption, grinPath, apiSecretPath, nodeTOMLPath, platform} from './config'

let client
let gnodeProcess
const gnodeHost = 'http://localhost:3413'

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

class gnodeService {
    static initClient() {
        if(fs.existsSync(apiSecretPath)){
            client = axios.create({
                baseURL: gnodeHost,
                auth: {
                    username: 'grin',
                    password: fs.readFileSync(apiSecretPath).toString()
                },
            })
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
    }
}
gnodeService.initClient()
export default gnodeService