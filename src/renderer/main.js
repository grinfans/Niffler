import Vue from 'vue'
import axios from 'axios'
import VueI18n from 'vue-i18n'

import App from './App'
import 'bulma/css/bulma.css'
import 'animate.css/animate.css'
import { remote, ipcRenderer} from 'electron'

import walletService from '../shared/wallet'
import log from '../shared/logger'
import dbService from '@/db'

Vue.walletService = Vue.prototype.$walletService = walletService
Vue.dbService = Vue.prototype.$dbService = dbService
Vue.log = Vue.prototype.$log = log

import en from '../lang/en'
import zh from '../lang/zh'

Vue.use(VueI18n)
const messages = {
  en,
  zh
}

const i18n = new VueI18n({
  locale: remote.app.getLocale().toLowerCase().startsWith('zh')?'zh':'en',
  //locale: 'en',
  messages
})

//remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
//  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
//})

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

ipcRenderer.on('before-quit', ()=>{
  log.debug('Render got msg is about to quit.')
  walletService.stopAll()
})