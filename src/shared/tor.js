const fs = require('fs')
const fse = require('fs-extra')
import {exec, execFile, spawn, fork} from 'child_process'

import {platform, torPath, torDir, torConfigPath, torDataPath, torHSDataPath, torLogPath} from './config'
import log from './logger'

let torProcess

const torrc = `
SOCKSPort 19050
DataDirectory ${torDataPath}
HiddenServiceDir ${torHSDataPath}     
HiddenServicePort 80 0.0.0.0:3415

#ControlPort 19051
#CookieAuthentication 1

#HTTPSProxy 127.0.0.1:9009
Log notice file ${torLogPath}
`

function ensureTorDir(){
    if(fse.pathExistsSync(torDir))return

    fse.ensureDirSync(torDir)
    fse.ensureFileSync(torLogPath)

    if(platform !=='win'){
        fse.ensureDirSync(torHSDataPath, {mode:0o700})
        fse.ensureDirSync(torDataPath, {mode:0o700})
    }else{
        fse.ensureDirSync(torHSDataPath)
        fse.ensureDirSync(torDataPath)
    }
    fs.writeFileSync(torConfigPath, torrc)
}

export function startTor(cb=null){
    log.debug('try to start tor')

    ensureTorDir()
    if(platform === 'linux'){
        torProcess = execFile(torPath, ['-f', torConfigPath]) 
    }else{
        torProcess =  exec(`${torPath} -f ${torConfigPath}`)
    }
    localStorage.setItem('torProcessPID', torProcess.pid)

    torProcess.stdout.on('data', (data)=>{
        log.debug('tor process: ' + data)
        if(cb)cb(data)
    })
    torProcess.stderr.on('data', (data) => {
        log.error('tor process (error): ' + data)
        if(cb)cb(data)
    })
}

export function stopTor(){

    const pid = localStorage.getItem('torProcessPID')
    localStorage.removeItem('torProcessPID')
    if(platform==='win'&&pid){
        return exec(`taskkill /pid ${pid} /f /t`)
    }
    if(pid){
        try{
            process.kill(pid, 'SIGKILL')
        }catch(e){
            log.error(`error when kill ${processName} ${pid}: ${e}` )
        }
    }

    torProcess.kill('SIGKILL')
}

export function restartTor(){
    stopTor
    setTimeout(()=>startTor(), 2.5*1000)
}
