<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:480px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.receive") }}(HTTP/HTTPS)</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
      <div v-if="running">
        <div class="message is-link">
          <div class="message-header" v-if="started"><p>{{ $t("msg.httpReceive.launchSucess") }}</p></div>
          <div class="message-header" v-else><p>{{ $t("msg.httpReceive.listening") }}</p></div>
          <div class="message-body">
            <p>{{ $t("msg.httpReceive.address") }} :</p>
            <p class="has-text-weight-semibold is-size-4" style="margin-top:15px;margin-bottom:15px"> 
              &nbsp; &nbsp; http://{{ip}}:3415 </p>
            <p>{{ $t("msg.httpReceive.reachableMsg2") }}</p>
          </div>
        </div>
        <button class="button is-link is-outlined"  @click="closeModal" >ok</button>
        &nbsp;&nbsp;
        <button class="button is-link is-outlined"  @click="stop" v-show="!started">
          {{ $t("msg.httpReceive.close") }}
        </button>

      </div>
      <div v-else>
        <div class="notification is-warning" v-if="errors.length">
          <p v-for="error in errors">{{ error }}</p>
        </div>
        <div class="center" v-show="errors.length>0">
          <a class="button is-link is-outlined" v-if="errors.length" @click="closeModal">OK</a>
        </div>

        <div v-show="errors.length==0">
          <div class="message is-warning">
            <div class="message-header"><p>{{ $t("msg.httpReceive.attention") }}</p></div>
            <div class="message-body">
              <p>{{ $t("msg.httpReceive.reachableMsg") }}</p>
            </div>
          </div>
          <!--
          <div class="field">
            <label class="label">{{ $t("msg.httpReceive.password") }}</label>
            <div class="control">
              <input class="input" type="password" placeholder="********" required
                :class="{'is-warning': errors.length>0}" v-model="password">
            </div>
          </div>-->
          
          <div class="center">
            <div class="field is-grouped ">
              <div class="control">
                <button class="button is-link" v-bind:class="{'is-loading':starting}" @click="start">
                  {{ $t("msg.httpReceive.start") }}
                </button>
              </div>
              <div class="control">
                <button class="button is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
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
import { messageBus } from '@/messagebus'
import { setTimeout } from 'timers';
const fs = require('fs');
const publicIp = require('public-ip');
const extIP = require('external-ip');
const externalip = require('externalip')

function isValidIP(str) {
  const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
  const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
  return regex.test(str);
}

export default {
  name: "http-receive",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errors: [],
      starting:false,
      started:false,
      localReachable: false,
      running:false,
      ip: this.$t('msg.httpReceive.ip')
    }
  },
  mounted() {
    this.checkRunning()
  },
  methods: {
    start(){
      if((!this.starting)&&(!this.running)){
        this.starting = true
        this.checklocalReachable().catch((error)=>{
          if(!error.response){
            this.$walletService.startListen()
          }
          this.$log.debug('Http listen is locally reachable.')
          this.$log.debug('checkRunning right now.')
          setTimeout(()=>this.checkRunning(), 1.5*1000)
        })
      }
    },
    stop(){
      this.$walletService.stopProcess('listen')
      this.running = false
      this.closeModal()
    },
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowHttpReceive');
    },
    
    clearup(){
      this.errors = []
      this.starting = false
      this.started = false
    },

    getIP(log){
      return new Promise(function(resolve, reject) {
        publicIp.v4().then((ip)=>{
          return resolve(ip)
        }).catch((err)=>{
          log.error('Failed to get ip use publicIp: ' + err)
          externalip(function (err, ip) {
          if(ip){
            return resolve(ip)
          }else{
            log.error('Failed to get ip use externalip: ' + err)
            return reject(err)
          }  
        })})
      })   
    },

    checklocalReachable(){
      const url = 'http://127.0.0.1:3415'
      this.$log.debug('Try to test if http listen locally reachable?')
      return this.$http.get(url, {timeout: 5000})
    },
    
    checkRunning(){
      this.checklocalReachable().catch((err)=>{
        if(err.response){
          this.localReachable = true
        }
      })
      this.getIP(this.$log).then((ip)=>{
        this.ip = ip
        this.$log.debug('Get ip: ' + ip)
        const url = `http://${ip}:3415`
        this.$log.debug(`Try to test ${url} ?`)
        this.$http.get(url, {timeout: 4000}).catch((error)=>{
          if(error.response){
            this.running = true
            if(this.starting){
              this.started = true
              this.starting = false
            }
            this.$log.debug('wallet HTTP listen works.')
          }else{
            if(this.starting){
              this.starting = false
              if(this.localReachable){
                this.errors.push(this.$t('msg.httpReceive.failed4'))
              }else{
                this.errors.push(this.$t('msg.httpReceive.failed2'))
              }
            }
            this.running = false
            this.$log.debug('Failed to connect ', url)
          }
        })
      }).catch(
        (err)=>{
          this.$log.error('Error when try to get ip: ' + err)
          this.errors.push(this.$t('msg.httpReceive.failed3'))
          this.starting = false
          this.running = false
        }
      )
    }
  }
}
</script>
<style>
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
