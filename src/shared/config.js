var fs = require('fs');
import path from 'path';
import { app, remote } from 'electron';
import os from 'os'

let appRootDir = require('app-root-dir').get().replace('app.asar', '').replace(/(\s+)/g, '\\$1');
export const rootDir = require('app-root-dir').get()
function getPlatform(){
    switch (os.platform()) {
        case 'aix':
        case 'freebsd':
        case 'linux':
        case 'openbsd':
        case 'android':
          return 'linux';
        case 'darwin':
        case 'sunos':
          return 'mac';
        case 'win32':
          return 'win';
      }
}

export const platform = getPlatform()

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();
const APP = process.type === 'renderer' ? remote.app : app

const binariesPath =
  IS_PROD || APP.isPackaged
    ? path.join(process.resourcesPath, 'bin', platform)
    : path.join(root, 'resources', 'bin', platform);

const grinWalletBinaries = platform==='win'?'grin-wallet.exe':'grin-wallet'
const grinBinaries = platform==='win'?'grin.exe':'grin'

export let grinWalletPath = path.join(binariesPath, grinWalletBinaries)
export let grinPath = path.join(binariesPath, grinBinaries)

if(platform=='win'){
  grinWalletPath = '"' + path.resolve(grinWalletPath) + '"' 
  grinPath = '"' + path.resolve(grinPath) + '"' 
}

export const chainType = 'main'
export const grinDIR = path.join(APP.getPath('home'), '.grin')
export const seedPath = path.join(APP.getPath('home'), '.grin', chainType, 'wallet_data/wallet.seed')
export const walletTOMLPath = path.join(APP.getPath('home'), '.grin', chainType, 'grin-wallet.toml')
export const nodeTOMLPath = path.join(APP.getPath('home'), '.grin', chainType, 'grin-server.toml')
export const walletPath = path.join(APP.getPath('home'), '.grin', chainType)
export const walletDataPath = path.join(APP.getPath('home'), '.grin', chainType, 'wallet_data')
export const walletLogPath = path.join(APP.getPath('home'), '.grin', chainType, 'grin-wallet.log')
export const apiSecretPath = path.join(APP.getPath('home'), '.grin', chainType, '.api_secret')
export const grinNodeLog = path.join(APP.getPath('home'), '.grin', chainType, 'grin-server.log')
export const chainDataPath = path.join(APP.getPath('home'), '.grin', chainType, 'chain_data')

export const nifflerPath = path.join(APP.getPath('home'), '.niffler')
export const logDir = path.join(nifflerPath, 'log')
export const tempTxDir = path.join(nifflerPath, 'temp_tx')

export const configPath = path.join(nifflerPath, 'config.json')

export const releaseUrl = 'https://api.github.com/repos/grinfans/niffler/releases/latest'
export const downloadUrl = 'https://github.com/grinfans/niffler/releases/latest'

export function getConfig(){
  try{
    return JSON.parse(fs.readFileSync(configPath))
  }catch (e) {
    return {}
  }
}

export function setConfig(options){
  return fs.writeFileSync(configPath, JSON.stringify(options))
}

export function updateConfig(options){
  let options_ = getConfig()
  for(var key in options){
    options_[key] = options[key]
  }
  setConfig(options_)
}

//export const logLevel = getConfig()['debug']?'debug':'info'
export const logLevel = 'debug'

export const hedwigServer = 'https://v1.hedwig.im'
export const hedwigClient =  
  IS_PROD || APP.isPackaged
    ? path.resolve(path.join(process.resourcesPath, 'bin', 'hedwig', 'client.js'))
    : path.resolve(path.join(root, 'hedwig', 'client.js'))

export const hedwigApp = 'Niffler'

export const grinRsWallet =  
  IS_PROD || APP.isPackaged
    ? path.resolve(path.join(process.resourcesPath, 'bin', 'grinRs', 'wallet.js'))
    : path.resolve(path.join(root, 'grinRs', 'wallet.js'))

export const nodeExecutable =  
    IS_PROD || APP.isPackaged
      ? path.resolve(path.join(process.resourcesPath, 'bin', 'grinRs', 'node.exe'))
      : path.resolve(path.join(root, 'grinRs', 'node.exe'))


function getLocale(){
  let locale = getConfig()['locale']
  if(locale)return locale
  locale = APP.getLocale().toLowerCase()
  if(locale.startsWith('zh'))return 'zh'
  if(locale.startsWith('ru'))return 'ru'
  return 'en'
}
export function setLocale(locale){
  updateConfig({'locale':locale})
}
export const locale = getLocale()
export const langs = {'zh':'简体中文', 'en':'English', 'ru': 'русский', 'ko': '한국어'}

import pkg from '../../package.json'
export const version = pkg.version

export const defaultGnodeOptions= {
  'useLocalGnode': true,
  //connnectMethod: localFirst, remoteFirst, localAllTime, remoteAllTime
  'connectMethod':'remoteFirst',
  'remoteAddr': 'http://grin2-node.niffler.org:3413',
  'localAddr': 'http://127.0.0.1:3413',
  'background': true
}
export const gnodeOption = getConfig()['gnode']?getConfig()['gnode']: defaultGnodeOptions
//export const grinNode = "http://grin2-node.niffler.org:3413"
//export const grinNode2 = "http://grin2-node2.niffler.org:3413"
//export const grinLocalNode= "http://127.0.0.1:3413"

export const grinNode = gnodeOption.remoteAddr
export const grinNode2 = gnodeOption.remoteAddr
export const grinLocalNode = gnodeOption.localAddr

export const darkMode = getConfig()['darkMode']?getConfig()['darkMode']: false
