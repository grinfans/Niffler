<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">Tor</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>

    <section class="modal-card-body" style="height:400px;background-color: whitesmoke;">
      
       <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="tabs">
                    <ul>
                        <li :class="[ tab === 'status' ? 'is-active' : '']"><a @click="tab='status'">{{ $t("msg.tor.tabStatus") }}</a></li> 
                        <li :class="[ tab === 'log' ? 'is-active' : '']"><a @click="tab='log'">{{ $t("msg.tor.tabLog") }}</a></li>
                        <li :class="[ tab === 'config' ? 'is-active' : '']"><a @click="tab='config'">{{ $t("msg.tor.tabConfig") }}</a></li>
                    </ul>
                </div>
                <div class="tab-is-link">
                    <div v-if="tab ==='status'">
                      <p>{{ $t("msg.tor.status") }}&nbsp;: 
                        <span class="has-text-centered has-text-weight-semibold">{{getStatusDisplay()}}</span>
                      </p>
                      <p v-if="status==='running'">{{torAddress}}</p>
                      
                      <a class="button is-link" @click="restart">{{ $t("msg.tor.restart") }} </a>
                    </div>
                    <div v-if="tab ==='log'">
                        <p class="is-size-7" v-for="log in torLog" :key="log.id">{{ log }}</p>
                    </div>
                    <div v-if="tab ==='config'">
                    </div>
                    
                </div>
              </div>
            </div>
        </div>
    </section>
  </div>
</div>

</template>
<script>
import axios from 'axios'
import path from 'path'
const fs = require('fs')
//const curl = new (require( '../../shared/curl-request' ))();
const curl = new (require( 'curl-request' ))();

const Tail = require('tail').Tail

import {torHSDataPath, torLogPath} from '../../shared/config'
import { messageBus } from '@/messagebus'

export default {
  name: "tor",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 'status', //status, log, config
      status: 'toStart',//'toStart','starting','running'
      torAddress: '',
      torLog: [],
    }
  },
  watch: {
    status:function(newVal, oldVal){
    }
  },
  
  mounted() {
    this.checkStatus()
    //this.autoCheck(10*1000)
  },
  methods: {
    checkStarted(){
    },

    getAdrress(){
      const hostnameFile = path.join(torHSDataPath, 'hostname')
      const address = fs.readFileSync(hostnameFile).toString().trim()
      this.torAddress = address.split('.')[0]
      return address
    },

    checkStatus(){
      axios.get('http://localhost:19050')
        .then(res=>{})
        .catch(error=>{
          if(error.message==='Network Error'){
            this.$log.debug('checkStatus: port 19050 refuse connect, toStart')
            this.status = 'toStart'
            return
          }else{
            if(this.status==='toStart')this.status = 'starting'
            curl.default.useProxy = true;
            curl.default.proxy =  'localhost:19050'
            curl.default.proxyType = curl.libcurl.proxy.SOCKS5_HOSTNAME
            const address = this.getAdrress()
            curl.get('http://'+address).then(({statusCode, body, headers})=>{
              this.$log.debug('checkStatus(from tor) return:', statusCode, body, headers)
              if(statusCode===404){
                this.status = 'running'
              }
            }).catch((e) => {
              console.log(e);
            })
          }
        })
      },
    
    startTailLog(log){
      let tail = new Tail(torLogPath, {'useWatchFile':true})
      tail.on("line", function(data) {
        if(log.length >= 30){log.shift()}
        log.push(data)
      });

      tail.on("error", function(error) {
        log.push('Error: ' + error)
      });
    },

    getStatusDisplay(){
      let s = {
        'running': this.$t('msg.tor.statusRunning'),
        'starting': this.$t('msg.tor.statusStarting'),
        'toStart': this.$t('msg.tor.statusToStart')
      }
      return s[this.status]
    },

    autoCheck(interval){
        setInterval(()=>{
         this.checkStatus()
        }, interval)
    },
    restart(){
      this.status = 'toStart'
      this.torLog = []
    },
    closeModal() {
      messageBus.$emit('close', 'windowTor');
    },
  }
}
</script>
<style scoped>
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
li.is-active{
  background-color: #3273dc;
  color: #fff;
  border-radius: 4px 4px 0 0;
}

.tabs li.is-active a{
  color: #fff;
}

.tab-is-link{
  background-color: #f6f9fe;
  border-radius: 4px;
  color: #22509a;
  padding: 1.5em 1.8em;
  margin-top: -1.5rem
}

.is-size-7{
  font-size: 0.95rem
}
</style>
