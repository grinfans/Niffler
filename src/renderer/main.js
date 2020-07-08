import Vue from 'vue'
import axios from 'axios'
import VueI18n from 'vue-i18n'

import App from './App'
import 'bulma/css/bulma.css'
import 'animate.css/animate.css'
import 'bulma-pageloader/dist/css/bulma-pageloader.min.css'

import { remote, ipcRenderer} from 'electron'

import walletService from '../shared/wallet'
import WalletServiceV3 from '../shared/walletv3'
import gnodeService from '../shared/gnode'
import {RemoteGnodeService} from '../shared/gnode'
import log from '../shared/logger'
import dbService from '@/db'
import {startTor, stopTor }from '../shared/tor'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

//https://github.com/electron-userland/electron-builder/issues/880#issuecomment-258602436
process.env.PATH = process.env.PATH + ':/usr/local/bin';

Vue.component('icon', Icon)

Vue.gnodeService = Vue.prototype.$gnodeService = gnodeService
Vue.remoteGnodeService = Vue.prototype.$remoteGnodeService = RemoteGnodeService

Vue.walletService = Vue.prototype.$walletService = walletService
Vue.walletServiceV3 = Vue.prototype.$walletServiceV3 = WalletServiceV3

Vue.dbService = Vue.prototype.$dbService = dbService
Vue.log = Vue.prototype.$log = log

import en from '../lang/en'
import zh from '../lang/zh'
import ru from '../lang/ru'
import ko from '../lang/ko'

Vue.use(VueI18n)
const messages = {
  en,
  ru,
  zh,
  ko
}

import {locale, gnodeOption} from '../shared/config'
const i18n = new VueI18n({
  locale: locale,
  //locale: 'ru',
  messages
})

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(require('vue-moment'))
var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  i18n
}).$mount('#app')

import { messageBus } from '@/messagebus'

ipcRenderer.on('before-quit', ()=>{
  log.debug('Render got msg is about to quit.')
  messageBus.$emit('quit')
  walletService.stopAll()
})

if(gnodeOption.useLocalGnode){
  gnodeService.getStatus().then().catch((err)=>{
    log.debug('Get local node status failed: ' + err)
    log.debug('Try to start local grin node.')
    gnodeService.startGnode()})
}

//startTor()