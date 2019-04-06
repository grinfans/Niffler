<template>
  <div id="app">
    <div class="section" v-if="ownerApiRunning">
      <div class="columns">
          <div class="column is-4">
            <summary-info></summary-info>
          </div>
          
          <div class="dropdown column is-offset-1 is-1" style="margin-top: auto;" 
            v-bind:class="{'is-active':isDroppingDown}" >
            <div class="dropdown-trigger" >
              <button class="button is-link is-outlined" aria-haspopup="true" aria-controls="dropdown-menu"
                @click="isDroppingDown=!isDroppingDown;isDroppingDown2=false">
                {{ $t("msg.send") }}
              </button>
            </div>
            <div  class="dropdown-menu" id="dropdown-menu" role="menu" style="left:12px;top:80%">
              <div class="dropdown-content">
                <a href="#" class="dropdown-item" @click="openFileSend = true">
                  {{ $t("msg.app.create") }}
                </a>
                <a href="#" class="dropdown-item" @click="openFinalize = true">
                  {{ $t("msg.app.finalize") }}
                </a>
                <hr class="dropdown-divider">
                <a class="dropdown-item" @click="openHttpSend = true">
                  {{ $t("msg.app.httpSend") }}
                </a>
              </div>
            </div>
          </div>

          &nbsp; &nbsp; 
          <div class="dropdown column column is-1" style="margin-top: auto;" 
            v-bind:class="{'is-active':isDroppingDown2}" >
            <div class="dropdown-trigger" >
              <button class="button is-link is-outlined" aria-haspopup="true" aria-controls="dropdown-menu"
                @click="isDroppingDown2=!isDroppingDown2;isDroppingDown=false">
                {{ $t("msg.receive") }}
              </button>
            </div>
            <div  class="dropdown-menu" id="dropdown-menu" role="menu" style="left:12px;top:80%">
              <div class="dropdown-content">
                <a href="#" class="dropdown-item" @click="openReceive = true">
                  {{ $t("msg.app.createRespFile") }}
                </a>
                <a class="dropdown-item" @click="openHttpReceive = true">
                  {{ $t("msg.app.httpReceive") }}
                </a>
              </div>
            </div>
          </div>
          
          <div class="column is-offset-2 is-2">
            <div class="level">
              <p class="is-size-7 tag is-warning animated" v-bind:class="{headShake: isAnimate}" style="animation-iteration-count:3">
                {{ $t("msg.app.height") }}:{{height}}</p>
              &nbsp;
              <a class="button is-small is-link is-outlined" @click.prevent="logout">{{ $t("msg.logout") }}</a>

            </div>
          </div>
      </div>

      <transaction v-bind:count_per_page="3"></transaction>
      <br/>
      <commit v-bind:count_per_page="3" v-bind:nodeHeight="height"></commit>

      <receive :showModal="openReceive"></receive>
      <http-receive :showModal="openHttpReceive"></http-receive>
      <http-send :showModal="openHttpSend"></http-send>
      <file-send :showModal="openFileSend"></file-send>
      <finalize :showModal="openFinalize"></finalize>
    </div>
    <landing v-bind:walletExist="walletExist" v-else></landing>
  </div>
</template>

<script>
  import { messageBus } from '@/messagebus'
  import mixin from '@/mixin'

  import SummaryInfo from '@/components/SummaryInfo'
  import Transaction from '@/components/Transaction'
  import Commit from '@/components/Commit'
  import Receive from '@/components/Receive'
  import HttpSend from '@/components/HttpSend'
  import HttpReceive from '@/components/HttpReceive'
  import FileSend from '@/components/FileSend'
  import Finalize from '@/components/Finalize'
  import Landing from '@/components/Landing'
  import checkUpdate from '../shared/updateChecker'
  import {downloadUrl} from '../shared/config'

  const {ipcRenderer} = require('electron')

  export default {
    name: 'niffler',
    mixins: [mixin],
    components: {
      SummaryInfo,
      Transaction,
      Commit,
      Receive,
      HttpSend,
      HttpReceive,
      FileSend,
      Finalize,
      Landing
    },
    data(){
      return {
        openReceive: false,
        openHttpReceive:false,
        openHttpSend: false,
        openFileSend: false,
        openFinalize: false,
        isDroppingDown: false,
        isDroppingDown2: false,
        ownerApiRunning: false,
        height:null,
        isAnimate:false,
        walletExist:false,
    }},
    mounted() {
      this.checkNewVersion()
      //this.checkOwnerApi()
      //this.getHeight()
      if(this.$walletService.isExist()){
        this.walletExist = true
      }
      this.$log.debug(`Render main window mounted:height ${this.height}; owner_api running?${this.ownerApiRunning};wallet exists? ${this.walletExist}`)
    },
    created () {
      messageBus.$on('close', (window)=>{
        if(window =='windowReceive'){
          this.openReceive = false
        }
        if(window =='windowHttpSend'){
          this.openHttpSend = false
        }
        if(window =='windowFileSend'){
          this.openFileSend = false
        }
        if(window =='windowFinalize'){
          this.openFinalize = false
        }
        if(window =='windowHttpReceive'){
          this.openHttpReceive = false
        }
      })
      messageBus.$on('logined', ()=>{
        this.$log.info('app.vue got user logined event')
        this.$walletService.initClient()
        this.ownerApiRunning = true
        this.getHeight()
      })
      messageBus.$on('update', ()=>this.getHeight())
      messageBus.$on('walletCreateFinished', ()=>{
        this.$log.info('app.vue got walletCreateFinished event')
        this.walletExist = true
      })

      messageBus.$on('walletExisted', ()=>{
        this.$log.warn('Found walletExisted during init new one')
        this.walletExist = true
      })
    },
    
    watch: {
      isDroppingDown:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown = false}, 
            4*1000)
        }
      },
      isDroppingDown2:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown2 = false}, 
            4*1000)
        }
      },
      ownerApiRunning:function(newVal, old){
        if(newVal){
          ipcRenderer.send('resize', 800, 800)
          this.autoRefresh(60*2.5*1000)
        }else{
          ipcRenderer.send('resize', 600, 480)
        }
      }, 
      height:function(newVal, old){
        this.isAnimate = true
        setTimeout(()=>{this.isAnimate = false}, 1000)
      }
    },
    methods: {
      checkOwnerApi(){
        this.$walletService.getNodeHeight().then(
          (res) =>{
            this.ownerApiRunning = true
          }).catch((error)=>{
            this.ownerApiRunning = false
          })
      },
      getHeight(){
        this.$walletService.getNodeHeight().then(
          (res) =>{
            this.height = res.data[0]
          }).catch((error)=>{})
      },
      logout(){
        this.$log.debug('logout')
        ipcRenderer.send('quit')
      },

      autoRefresh(interval){
        setInterval(()=>{
          if(this.ownerApiRunning){
            messageBus.$emit('update')
          }
        }, interval)
      },
      async checkNewVersion(){
        let toUpdate = await checkUpdate()
        if(toUpdate){
          this.$electron.remote.dialog.showMessageBox({
            type: 'info',
            title: this.$t('msg.app.updateTitle'),
            buttons: [this.$t('msg.app.yes'), this.$t('msg.app.no')],
            message: this.$t('msg.app.updateMsg'),
          }, (res, checkboxChecked) => {
          if (res === 0) { 
            this.$electron.shell.openExternal(downloadUrl)
            this.$log.debug('User chosed to update. now quit app.')
            ipcRenderer.send('quit.')
          }else{
            this.$log.info('User chosed to don not update.')
          }})
        }
      }
    },
  }
</script>

<style>
</style>
