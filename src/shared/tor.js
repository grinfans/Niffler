const fs = require('fs')
const fse = require('fs-extra')
import {exec, execFile, spawn, fork} from 'child_process'

import {platform, torPath, torDir, torConfigPath, torDataPath, torHSDataPath, torLogPath} from './config'
import log from './logger'

let torProcess

let torrc = `SOCKSPort 19050
DataDirectory ${torDataPath}
HiddenServiceDir ${torHSDataPath}     
HiddenServicePort 80 0.0.0.0:3415
Log notice file ${torLogPath}
`
function configureTor(proxyHost, proxyType, proxyUser, proxyPassword){
    let torrc_ = torrc
    if(proxyType==='https'){
        torrc_ = torrc + '\nHTTPSProxy ' + proxyHost
        if(proxyUser && proxyPassowrd){
            torrc_ = torrc_ + '\nHTTPSProxyAuthenticator ' + proxyUser + ':' + proxyPassword
        }
    }
    if(proxyType==='socks5'){
        torrc_ = torrc + '\nSocks5Proxy ' + proxyHost
        if(proxyUser && proxyPassowrd){
            torrc_ = torrc_ + '\nSocks5ProxyUsername ' + proxyUser
            torrc_ = torrc_ + '\nSocks5ProxyPassword ' + proxyPassword
        }
    }
    fs.writeFileSync(torConfigPath, torrc_)
}

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
}

export function startTor(proxyHost='', proxyType='', proxyUser='', proxyPassword=''){
    log.debug('try to start tor:' + proxyHost + proxyType + proxyUser + proxyPassword) 

    ensureTorDir()
    configureTor(proxyHost, proxyType, proxyUser, proxyPassword)
    
    if(platform === 'linux'){
        torProcess = execFile(torPath, ['-f', torConfigPath]) 
    }else{
        torProcess =  exec(`${torPath} -f ${torConfigPath}`)
    }
    localStorage.setItem('torProcessPID', torProcess.pid)

    torProcess.stdout.on('data', (data)=>{
        log.debug('tor process: ' + data)
    })
    torProcess.stderr.on('data', (data) => {
        log.error('tor process (error): ' + data) 
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
