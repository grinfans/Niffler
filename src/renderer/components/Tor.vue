<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:500px">
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
                        <li :class="[ tab === 'status' ? 'is-active' : '']">
                          <a @click="tab='status'">
                            <span v-if="status==='toStart'">{{ $t("msg.tor.introTitle") }}</span>
                            <span v-if="status==='starting'">{{ $t("msg.tor.statusStarting") }}</span>
                            <span v-if="status==='running'">{{ $t("msg.tor.statusRunning")}}</span>
                            <span v-if="status==='failed'">{{ $t("msg.tor.statusFailed") }}</span>
                          </a>
                        </li> 
                        <li :class="[ tab === 'log' ? 'is-active' : '']"><a @click="tab='log'">{{ $t("msg.tor.tabLog") }}</a></li>
                        <li :class="[ tab === 'config' ? 'is-active' : '']"><a @click="tab='config'">{{ $t("msg.tor.tabConfig") }}</a></li>
                    </ul>
                </div>
                <div class="tab-is-link">
                    <div v-if="tab ==='status'">
                      <div v-if="status==='running'">
                            <p>{{ $t("msg.tor.address") }} :</p>
                            <p class="has-text-weight-semibold is-size-5" style="margin-top:15px;margin-bottom:15px;word-wrap: break-word;"> 
                              {{this.torAddress}}
                            </p>
                            <p class="is-size-7 tag is-warning animated is-pulled-right bounce" v-if="copied" style="animation-iteration-count:3">
                              {{ $t("msg.tor.copied") }}
                            </p>
                            <button v-else class="button is-small is-link is-outlined is-pulled-right" @click="copy" >
                              {{ $t("msg.tor.copy") }}
                            </button>
                            <br/>
                            <p class="is-italic is-size-7">{{ $t("msg.tor.tip") }}</p>
                          <br/>
                        
                        <button class="button is-link is-outlined center"  @click="closeModal" style='width:65px'>OK</button>            
                      </div>

                      <div v-if="status==='toStart'||status==='starting'">
                          
                        <p>{{ $t("msg.tor.intro1") }}</p><br/>
                        <p>{{ $t("msg.tor.intro2") }}</p><br/>
                        <p class="is-size-7">{{ $t("msg.tor.intro3") }}</p><br/>
                        <p class="is-italic is-size-7" v-show="status==='starting'">
                          {{ $t("msg.tor.tip2") }}
                          <span class="animated flash" style="animation-iteration-count:infinite;animation-duration: 3s">......</span>
                        </p><br/>
                        <div class="field is-grouped " >
                          <div class="control">
                            <button class="button is-link" v-bind:class="{'is-loading':status==='starting'}" @click="start">
                              {{ $t("msg.tor.start") }}
                            </button>
                          </div>
                        <div class="control">
                          <button class="button is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
                        </div>
                        </div>
                      </div>

                      <div v-if="status==='failed'">
                        <br/>
                        <p class="tag is-warning is-size-6">{{$t("msg.error")}}: {{ error }}</p>
                        <br/><br/><br/>
                        <button class="button is-link is-outlined" @click="acknowledge">OK&nbsp;</button>
                      </div>

                    </div>

                    <div v-if="tab ==='log'">
                        <p class="is-size-7" v-for="log in torLog" :key="log.id">{{ log }}</p>
                    </div>
                    <div v-if="tab ==='config'">
                      <label class="checkbox" style="color:#22509a;font-size:0.95rem;margin:5px 25px 25px 20px">
                        <input type="checkbox" v-model="startTorWhenLauch">
                        {{ $t("msg.tor.startWhenLaunch") }}
                      </label>
                      
                      <p v-if="errorConfig" class="tag is-warning is-size-7" style="margin-left:25px;margin-bottom:20px">{{$t("msg.error")}}: {{ errorConfig }}</p>
                      <div class="field is-horizontal">

                        <div class="field-label is-normal">
                            {{ $t("msg.tor.proxy") }}:
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control">
                                    <input class="input" type="text" v-model="proxy" v-bind:class="{'is-warning':errorConfig}">
                                </div>
                                <p class="help">
                                  {{ $t("msg.tor.proxyHelp") }}
                                </p>
                                <p class="help">
                                  {{ $t("msg.tor.proxyHelp2") }}
                                </p>
                            </div>
                        </div>
                      </div>

                      <div class="field is-horizontal">
                        <div class="field-label is-normal">
                           <span class="is-size-7">{{$t("msg.tor.proxyUser")}}: </span>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control">
                                    <input class="input is-small" type="text" v-model="proxyUser" 
                                      v-bind:placeholder="$t('msg.tor.optional')">
                                </div>
                            </div>
                        </div>    
                      </div>

                      <div class="field is-horizontal">
                        <div class="field-label is-normal">
                           <span class="is-size-7">{{$t("msg.tor.proxyPassword")}}: </span>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control">
                                    <input class="input is-small" type="password" v-model="proxyPassword" 
                                      v-bind:placeholder="$t('msg.tor.optional')">
                                </div>   
                            </div>
                        </div>
                      </div>

                      <br/>
                      <a class="button is-link is-small is-pulled-right	" @click="save">{{ $t("msg.save") }}</a>
                      <br/>
                    </div>                   
                </div>
              </div>
            </div>
        </div>
    </section>
  </div>

  <message :showMsg="openMsg" v-on:close="closeConfig" 
    v-bind:msg=msg v-bind:showTime="5" msgType="link">
  </message>
</div>

</template>
<script>
import axios from 'axios'
import path from 'path'

const fs = require('fs')
const Tail = require('tail').Tail

import {execPromise} from '../../shared/utils'
import {startTor, restartTor} from '../../shared/tor'
import {torHSDataPath, torLogPath, grinNode, grinLocalNode, torOptions, updateConfig} from '../../shared/config'
import { messageBus } from '@/messagebus'
import Message from '@/components/Message'

const clipboard = require('electron').clipboard

export default {
  name: "tor",
  components: {
      Message
  },
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
      copied: false,
      checkTimes: 0,
      startTorWhenLauch:  torOptions.startWhenLaunch,
      proxy: this.getProxy(),
      proxyType: torOptions.proxyType,
      proxyHost: torOptions.proxyHost,
      proxyUser: torOptions.proxyUser,
      proxyPassword: torOptions.proxyPassword,
      connectedOnce: torOptions.connectedOnce,
      error: '',
      errorConfig: '',
      msg: this.$t('msg.tor.saved'),
      openMsg: false
    }
  },
  watch: {
    status:function(newVal, oldVal){
      if(newVal==='running'){
        this.$dbService.setTorRunning(true)
        if(!torOptions['connectedOnce']){
          torOptions['connectedOnce'] = true
          this.connectedOnce = true
          updateConfig({'tor': torOptions})
        }
      }
    },
    errorConfig:function(newVal, oldVal){
      if(newVal){
        setTimeout(()=>{this.errorConfig=''}, 2.5*1000)
      }
    }
  },
  
  mounted() {
    this.startTailLog(this.torLog)
    this.$dbService.setTorRunning(false)
    if(this.connectedOnce && this.startTorWhenLauch){
      this.start()
    }
  },
  methods: {
    getAddress(){
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
            const address = this.getAddress()
            const cmd= `curl -I --socks5-hostname localhost:19050 ${address}`
            execPromise(cmd)
              .then((res)=>{
                //console.log('checkRunning return: ' + res)
                if(res.indexOf('404')!==-1){
                  this.status = 'running'
                }
              }).catch(error=>{
                console.log(error)
                if(error.indexOf('command not found')!==-1){
                  this.status = 'failed'
                  this.error = this.$t('msg.tor.errorNoCurl')
                }
              })
            }
        })
      },
    
    startTailLog(log){
      if(!fs.existsSync(torLogPath))return
      let tail = new Tail(torLogPath, {'useWatchFile':true})
      tail.on("line", function(data) {
        if(data.indexOf('71')!==-1)return
        if(log.length >= 30){log.shift()}
        log.push(data)
      });

      tail.on("error", function(error) {
        log.push('Error: ' + error)
      });
    },

    autoCheck(interval){
        setInterval(()=>{
          if(this.checkTimes <= 5){
            if(this.status==='starting'){
              this.checkRunning()
              this.checkTimes += 1
            }
          }else{
            if(this.status==='starting'){
              this.status = 'failed'
              this.error = this.$t('msg.tor.error')
            }
          }
        }, interval)
    },
    copy(){
      clipboard.writeText(this.torAddress)
      this.copied = true

      setTimeout(()=>{this.copied = false}, 4000)
    },

    start(){
      if(this.status==='starting')return
      let gnode = grinNode
      if(this.$dbService.getGnodeLocation() == 'local'){
        gnode=grinLocalNode
      }
      this.$walletService.startListen(gnode)


      restartTor(this.proxyHost, this.proxyType, this.proxyUser, this.proxyPassword)

      this.checkTimes = 0
      this.status = 'starting'
      this.autoCheck(10*1000)
    },

    restart(){
      this.status = 'toStart'
      this.torLog = []
    },
    closeModal() {
      messageBus.$emit('close', 'windowTor');
    },
    acknowledge(){
      this.status = 'toStart'
      this.error = ''
    },

    prepareSave(toSave){
      var re = new RegExp("^(https|socks5):\/\/(.+?:\\d+)")
      const result = re.exec(toSave)
      if(result && result.length > 2){
        return {'type':result[1], 'host':result[2]}
      }
    },

    save(){
      if(this.proxy){
        this.proxy = this.proxy.trim()
        const result = this.prepareSave(this.proxy)
        console.log('proxy:' + JSON.stringify(result))
        if(!result){
          this.errorConfig = this.$t('msg.tor.errorInvalidProxy')
          return
        }else{
          this.proxyHost = result.host
          this.proxyType = result.type
        }
      }
      const torOptions_ = {
        'startWhenLaunch': this.startTorWhenLauch,
        'proxyHost': this.proxyHost,
        'proxyType': this.proxyType,
        'proxyUser': this.proxyUser,
        'proxyPassword': this.proxyPassword,
        'connectedOnce': this.connectedOnce
      }
      updateConfig({'tor': torOptions_})
      this.openMsg = true
    },

    getProxy(){
      const host = torOptions.proxyHost
      const type_ = torOptions.proxyType
      if(host && type_){
        return `${type_}://${host}`
      }
      return '' 
    },
    closeConfig(){
      this.openMsg = false
    }
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
