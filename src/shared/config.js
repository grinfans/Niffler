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

const grinBinaries = platform==='win'?'grin-wallet.exe':'grin-wallet'
export const grinPath = path.join(binariesPath, grinBinaries)
export const chainType = 'main'
export const grinNode = "http://node.niffler.org:3413"
export const seedPath = path.join(APP.getPath('home'), '.grin', chainType, 'wallet_data/wallet.seed')
export const walletTOMLPath = path.join(APP.getPath('home'), '.grin', chainType, 'grin-wallet.toml')
export const apiSecretPath = path.join(APP.getPath('home'), '.grin', chainType, '.api_secret')
export const nifflerPath = path.join(APP.getPath('home'), '.niffler')
export const logDir = path.join(nifflerPath, 'log')
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

export const logLevel = getConfig()['debug']?'debug':'info'

export const hedwigServer = 'https://v1.hedwig.im'
export const hedwigClient =  
  IS_PROD || APP.isPackaged
    ? path.resolve(path.join(process.resourcesPath, 'bin', 'hedwig', 'client.js'))
    : path.resolve(path.join(root, 'hedwig', 'client.js'))

export const hedwigApp = 'Niffler'