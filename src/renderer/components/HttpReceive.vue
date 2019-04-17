<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:480px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link">{{ $t("msg.receive") }}(HTTP/HTTPS)</p>
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
              <!--<p>{{ $t("msg.httpReceive.frp") }}</p>-->
            </div>
          </div>
          
          <div class="field">
            <label class="label">{{ $t("msg.httpReceive.password") }}</label>
            <div class="control">
              <input class="input" type="password" placeholder="********" required
                :class="{'is-warning': errors.length>0}" v-model="password">
            </div>
          </div>
          <br/>

          <div class="field is-grouped">
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
      password:'',
      starting:false,
      started:false,
      running:false,
      ip: this.$t('msg.httpReceive.ip')
    }
  },
  mounted() {
    this.checkRunning()
    this.getIP()
  },

  methods: {
    start(){
      if(this.password!=''&&!this.starting&&!this.running){
        this.starting = true
        this.$walletService.startListen(this.password)
        setTimeout(()=>{
          this.checkRunning()
          this.$log.debug('start listen running?'+this.running)
          }, 500)
        }
    },
    stop(){
      this.$walletService.stopListen()
      this.running = false
      this.closeModal()
    },
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowHttpReceive');
    },
    
    clearup(){
      this.errors = []
      this.password = ''
      this.starting = false
      this.started = false
    },

    checkRunning(){
      const url = 'http://localhost:3415'
      
      this.$http.get(url).catch((error)=>{
        if(error.response){
          if(!isValidIP(this.ip)){
            this.$log.debug(`${this.ip} is not valid ip.`)
            this.getIP()
          }
          const url2 = `http://${this.ip}:3415`
          this.$log.debug(`try to test ${url2}.`)
          this.$http.get(url2).catch((error)=>{
            if(error.response){
              this.running = true
              if(this.starting){
                this.started = true
                this.starting = false
              }
            }else{
              if(this.starting){
                this.starting = false
                this.errors.push(this.$t('msg.httpReceive.failed2'))
              }
              this.running = false
            }
          })
        }else{
          if(this.starting){
            this.starting = false
            this.errors.push(this.$t('msg.httpReceive.failed'))
          }
          this.running = false
        }
      })
    },

    getIP(){
      this.getMyIP2()
      setTimeout(()=>{
        if(this.ip===''){
          this.getMyIP()
        }
      }, 1000)
    },

    getMyIP(){
      (async () => {
        try{
          this.ip = await publicIp.v4();
          this.$log.debug('this host ip:' + this.ip)
        }catch(e){
          this.$log.error('error when getIP:' + e)
          this.ip = await publicIp.v4({'https':true});
          this.$log.debug('this host ip (getip use https):' + this.ip)
        }
      })();
    },

    getMyIP2(){
      let getIP = extIP({
          replace: true,
          services: ['https://ipinfo.io/ip', 'http://ifconfig.io/ip'],
          timeout: 600,
          getIP: 'parallel',
          userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
      });
      getIP((err, ip) => {
        if (err) {
           this.$log.error('error when getmyip2: ' + err)
           return
        }
        this.ip = ip
        this.$log.debug('this host ip when getmyip2: ' + this.ip)
      });
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
