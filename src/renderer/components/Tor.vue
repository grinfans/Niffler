<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:600px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.tor.title") }}</p>
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
                      <p><span class="has-text-centered has-text-weight-semibold">{{getStatusDisplay()}}</span></p>
                      <div v-if="status==='running'">
                        <p>{{ $t("msg.tor.address") }}:</p>
                        <p  class="has-text-weight-semibold is-size-5" style="margin-top:15px;margin-bottom:15px"> 
                          {{torAddress}}
                        </p>
                      </div>
                      <br/><br/>
                      <button v-if="status==='toStart'" class="button is-link" @click="start" :class="{'is-loading': status==='starting'}">
                        {{ $t("msg.tor.start") }}
                      </button>
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
const Tail = require('tail').Tail

import {execPromise} from '../../shared/utils'
import {startTor, restartTor} from '../../shared/tor'
import {torHSDataPath, torLogPath, grinNode, grinLocalNode} from '../../shared/config'
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
      status: 'toStart',//'toStart','starting','running','failed'
      torAddress: '',
      torLog: [],
      checkTimes: 0
    }
  },
  watch: {
    status:function(newVal, oldVal){
    }
  },
  
  mounted() {
    //this.checkStatus()
  },
  methods: {
    getAdrress(){
      const hostnameFile = path.join(torHSDataPath, 'hostname')
      const address = fs.readFileSync(hostnameFile).toString().trim()
      this.torAddress = address.split('.')[0]
      return address
    },
    checkRunning(){
      console.log('checkRunning')
      axios.get('http://localhost:19050')
        .then(res=>{})
        .catch(error=>{
          if(error.message==='Network Error'){
            this.$log.debug('checkRunning: port 19050 refuse connect, toStart')
            return
          }else{
            const address = this.getAdrress()
            const cmd= `/usr/bin/curl -I --socks5-hostname localhost:19050 ${address}`
            execPromise(cmd)
              .then((res)=>{
                console.log('checkRunning return: ' + res)
                if(res.indexOf('404')!==-1){
                  this.status = 'running'
                }
              }).catch(error=>console.log(error))
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
        'toStart': this.$t('msg.tor.statusToStart'),
        'failed': this.$t('msg.tor.statusFailed')
      }
      return s[this.status]
    },

    autoCheck(interval){
        setInterval(()=>{
          if(this.checkTimes <= 10){
            if(this.status==='starting'){
              this.checkRunning()
              this.checkTimes += 1
            }
          }else{
            this.status = 'failed'
          }
        }, interval)
    },

    start(){
      if(this.status==='starting')return
      let gnode = grinNode
      if(this.$dbService.getGnodeLocation() == 'local'){
        gnode=grinLocalNode
      }
      this.$walletService.startListen(gnode)

      startTor()

      this.checkTimes = 0
      this.status = 'starting'
      this.autoCheck(6*1000)
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
