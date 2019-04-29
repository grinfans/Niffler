<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link">{{ $t("msg.hedwig.title") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
      <div v-if="internetReachable">
        <div class="message is-link">
          <div class="message-header" v-if="started"><p>{{ $t("msg.hedwig.launchSucess") }}</p></div>
          <div class="message-header" v-else><p>{{ $t("msg.hedwig.reachable") }}</p></div>
          <div class="message-body">
            <p>{{ $t("msg.hedwig.address") }} :</p>
            <p class="has-text-weight-semibold is-size-5" style="margin-top:15px;margin-bottom:15px"> 
              {{this.address}}</p>
            <p class="is-size-7 tag is-warning animated is-pulled-right bounce" v-if="copied" style="animation-iteration-count:3">
              {{ $t("msg.hedwig.copied") }}
            </p>
            <button v-else class="button is-small is-link is-outlined is-pulled-right" @click="copy" >
              {{ $t("msg.hedwig.copy") }}
            </button>
            <br/>
            <p>{{ $t("msg.hedwig.tip") }}</p>
          </div>
        </div>
        <button class="button is-link is-outlined center"  @click="closeModal" >ok</button>
        &nbsp;&nbsp;
        <button class="button is-link is-outlined"  @click="stop" v-show="internetReachable">
          {{ $t("msg.hedwig.close") }}
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
            <div class="message-header"><p>{{ $t("msg.hedwig.introTitle") }}</p></div>
            <div class="message-body">
              <p>{{ $t("msg.hedwig.intro1") }}</p><br/>
              <p>{{ $t("msg.hedwig.intro2") }}</p><br/>
              <p>{{ $t("msg.hedwig.tip") }}</p>
            </div>
          </div>
          <div class="center">
            <div class="field is-grouped " >
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
import {fork} from 'child_process'

import { messageBus } from '@/messagebus'
import {hedwigServer, hedwigClient, hedwigApp} from '../../shared/config'
import { setTimeout } from 'timers';
const clipboard = require('electron').clipboard

let hedwig 

export default {
  name: "hedwig-v1",
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

      internetReachable:false,
      localReachable:false,
      address: '',
      socket: null,
      copied: false
    }
  },
  created() {
      messageBus.$on('quit', ()=>{
        hedwig.send({'title':'close'})
      })
  },
  methods: {
    start(){
      if(!this.starting&&!this.internetReachable){
        this.starting = true
        this.$log.debug('Is local reachable before start? '+ this.localReachable)
        
        if(!this.localReachable){
          this.$walletService.startListen()
        }
        
        if(!this.internetReachable){
          let args = ['--server', hedwigServer, '--app', hedwigApp, '--port', '3415', 
            '--subdomain', String(Math.random()).slice(2)]
          this.$log.debug('hedwig client at ' + hedwigClient )
          try{
            hedwig = fork(hedwigClient, args)
          }catch(e){
            this.$log.error('Error during fork: ' + e )
          }
          
          hedwig.on('error', (err) => {
            this.$log.error(`error when try to start hedwig: ${err}`)
          })

          hedwig.on('message', (msg_)=>{
            if(msg_.title=='tunnelCreated'){
              this.address = msg_.address
              this.$log.debug(`connect hedwig on url ${this.address}`)
              this.checkReachable()
            }
            if(msg_.title=='disconnect'){
              this.$log.debug('receive disconnect msg')
              this.internetReachable = false
            }
            if(msg_.title=='reconnect'){
              this.$log.debug('receive reconnect msg')
              this.checkReachable()
            }
            if(msg_.title=='received'){
              this.$log.debug('receive data from hedwig')
              setTimeout(()=>{messageBus.$emit('update')}, 5000)
            }
            if(msg_.title=='failed'){
              this.internetReachable = false
              this.starting = false
              this.errors.push(this.$t('msg.hedwig.failed'))
              let e = JSON.stringify(msg_.error)
              this.$log.error(`error when try to connect hedwig: ${e}`)
            }
          })
        }
      }
    },
    
    stop(){
      this.$walletService.stopListen()
      hedwig.send({'title':'close'})

      this.internetReachable = false
      this.localReachable = false
      this.address = ''
      this.socket = null

      this.closeModal()
    },

    copy(){
      clipboard.writeText(this.address)
      this.copied = true

      setTimeout(()=>{this.copied = false}, 4000)
    },

    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowHedwigV1');
    },
    
    clearup(){
      this.errors = []
      this.starting = false
      this.started = false
      this.copied = false
      //this.localReachable = false
    },

    checkReachable(){
      if(this.address == ''){
        this.$log.error('checkReachable: false (no hedwig address or no socket)')
        this.internetReachable = false
        if(this.starting){
          this.starting = false
        }
        return
      }

      const url = 'http://127.0.0.1:3415'
      this.$log.debug('Try to test if http listen locally reachable?')
      this.$http.get(url, {timeout: 5000}).catch((error)=>{
        if(error.response){
          this.localReachable = true
          this.$log.debug('Http listen is locally reachable.')
          
          const url2 = this.address
          this.$log.debug(`Try to test internet reachalbe: ${url2} ?`)
          this.$http.get(url2, {timeout: 10000}).catch((error)=>{
            this.$log.debug(`connect ${url2} return: ${error}`)
            if(error.response){
              this.internetReachable = true
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
              this.$log.debug('hedwig succesful with url: '+ this.address)
              if(this.starting){
                this.started = true
                this.starting = false
              }
            }else{
              this.internetReachable = false
              if(this.starting){
                this.starting = false
                this.errors.push(this.$t('msg.hedwig.failed2'))
              }
            }
          })
        }else{
          this.internetReachable = false
          this.localReachable = true
          if(this.starting){
            this.starting = false
            this.errors.push(this.$t('msg.hedwig.failed3'))
          }
        }
      })
    },
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
