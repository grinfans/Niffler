const fs = require('fs')
const fse = require('fs-extra')
import {exec, execFile, spawn, fork} from 'child_process'

import {platform, torPath, torDir, torConfigPath, torDataPath, torHSDataPath, torLogPath} from './config'
import log from './logger'

let torProcess

const torrc = `
DataDirectory ${torDataPath}
HiddenServiceDir ${torHSDataPath}     
HiddenServicePort 80 0.0.0.0:3415

#ControlPort 19051
#CookieAuthentication 1

HTTPSProxy 127.0.0.1:9009
Log notice file ${torLogPath}
`

function ensureTorDir(){
    if(fse.pathExistsSync(torDir))return

    fse.ensureDirSync(torDir)
    fse.ensureDirSync(torDataPath)
    fse.ensureFileSync(torLogPath)

    if(platform !=='win'){
        fse.ensureDirSync(torHSDataPath, {mode:0o700})
    }else{
        fse.ensureDirSync(torHSDataPath)
    }
    fs.writeFileSync(torConfigPath, torrc)
}

export function startTor(){
    log.debug('try to start tor')
    ensureTorDir()
    if(platform === 'linux'){
        torProcess = execFile(torPath, ['-f', torConfigPath]) 
    }else{
        torProcess =  exec(`${torPath} -f ${torConfigPath}`)
    }
    torProcess.stdout.on('data', (data)=>{
        log.debug('tor process: ' + data)
    })
    torProcess.stderr.on('data', (data) => {
        log.error('tor process (error): ' + data)
    })
}