<template>
  <div id="app">
    <div class="pageloader is-link" v-bind:class="{'is-active': isloading }"><span class="title">{{ $t("msg.loading") }}</span></div>

    <div class="section" v-if="ownerApiRunning">
      <div class="columns">
          <div class="column is-4">
            <summary-info></summary-info>
          </div>
          
          <div class="dropdown column is-1" style="margin-left:25px;margin-top: auto;" 
            v-bind:class="{'is-active':isDroppingDown}" >
            <div class="dropdown-trigger" >
              <button class="button is-link is-outlined" v-bind:class="{'is-small2':isRu}"
                aria-haspopup="true" aria-controls="dropdown-menu"
                @click="isDroppingDown=!isDroppingDown;isDroppingDown2=false;isDroppingDown3=false">
                {{ $t("msg.send") }}
              </button>
            </div>

            <div class="dropdown-menu" id="dropdown-menu" role="menu" style="left:12px;top:80%">
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
          <div class="dropdown column column is-1" style="margin-left:-5px;margin-top:auto;" 
            v-bind:class="{'is-active':isDroppingDown2}" >
            <div class="dropdown-trigger" >
              <button class="button is-link is-outlined" v-bind:class="{'is-small2':isRu}"
                aria-haspopup="true" aria-controls="dropdown-menu"
                @click="isDroppingDown2=!isDroppingDown2;isDroppingDown=false;isDroppingDown3=false">
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
                
                <hr class="dropdown-divider">
                <a class="dropdown-item" @click="openAddress = true">
                  {{ $t("msg.app.address") }}
                </a>

                <hr class="dropdown-divider">
                <a class="dropdown-item" @click="openHedwigV1 = true">
                  <span class="icon-running icon-status animated infinite pulse delay-2s" v-if="hedwigRunning"></span>
                  <span class="icon-failed icon-status animated infinite pulse delay-2s" v-if="hedwigFailed"></span>
                  {{ $t("msg.app.hedwig") }}
                </a>
              </div>
            </div>            
          </div>

          <div class="column column is-1" style="margin-top: auto; margin-left:25px;">
            <button class="button is-link is-outlined" v-bind:class="{'is-small2':isRu}" @click="openTor = true">
                {{ $t("msg.app.tor") }}
            </button>
          </div>

          <div class="column is-2" style="margin-left:40px;">
            <div class="level">
              <p class="is-size-7 tag is-warning animated" v-bind:class="{headShake: isAnimate}" style="animation-iteration-count:3">
                {{ $t("msg.app.height") }} ({{getGnodeLocationDisplay()}}):{{height}}</p>
              &nbsp;
              <!--<a class="button is-small is-link is-outlined" @click.prevent="logout">{{ $t("msg.logout") }}</a>-->
              <div class="dropdown is-right" v-bind:class="{'is-active':isDroppingDown3}">
                <div class="dropdown-trigger">
                  <button class="button is-small is-link is-outlined" aria-haspopup="true" aria-controls="dropdown-menu"
                  @click="isDroppingDown3=!isDroppingDown3;isDroppingDown=false;isDroppingDown2=false" style="width:50px">
                    <span>{{ $t("msg.more") }}</span>
                  </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu" style="min-width:0">
                  <div class="dropdown-content">
                    <a href="#" class="dropdown-item" style="line-height: 1.2;font-size: 0.8rem;" 
                      @click="openCheck = true">
                      {{ $t("msg.check.title") }}
                    </a>

                    <a href="#" class="dropdown-item" style="line-height: 1.2;font-size: 0.8rem;" 
                      @click="openGnode = true">
                      {{ $t("msg.localNode") }}
                    </a>
                    
                    <a href="#" class="dropdown-item" style="line-height: 1.2;font-size: 0.8rem;" 
                      @click="openLang=true">
                      {{ $t("msg.lang.title") }}
                    </a>

                    <hr class="dropdown-divider">
                    <a href="#" class="dropdown-item" style="line-height: 1.2;font-size: 0.8rem;" 
                       @click.prevent="logout">
                      {{ $t("msg.logout") }}
                    </a>
                  </div>
                </div>
              </div>

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
      <hedwig-v1 :showModal="openHedwigV1"></hedwig-v1>
      <check :showModal="openCheck"></check>
      <lang :showModal="openLang"></lang>
      <gnode :showModal="openGnode"></gnode>
      <tor :showModal="openTor"></tor>
      <gaddress :showModal="openAddress"></gaddress>
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
  import HedwigV1 from '@/components/HedwigV1'
  import Check from '@/components/Check'
  import Lang from '@/components/Lang'
  import Gnode from '@/components/Gnode'
  import Landing from '@/components/Landing'
  import Tor from '@/components/Tor'
  import Gaddress from '@/components/Address'

  import checkUpdate from '../shared/updateChecker'
  import {downloadUrl, locale, gnodeOption} from '../shared/config'

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
      HedwigV1,
      Check,
      Landing,
      Lang,
      Gnode,
      Tor,
      Gaddress
    },
    data(){
      return {
        openReceive: false,
        openHttpReceive:false,
        openHttpSend: false,
        openFileSend: false,
        openFinalize: false,
        openHedwigV1: false,
        openCheck: false,
        openLang:false,
        openGnode:false,
        openTor:false,
        openAddress:false,

        isDroppingDown: false,
        isDroppingDown2: false,
        isDroppingDown3: false,
        ownerApiRunning: false,
        height:null,
        isAnimate:false,
        walletExist:false,
        hedwigRunning:false,
        hedwigFailed:false,

        isGnodeLocal: false,
        isRu: false,
        isloading: false,
        isScaning: false,
    }},
    mounted() {
      this.checkNewVersion()
      if(this.$walletService.isExist()){
        this.walletExist = true
      }
      this.getHeight()
      this.updateIsLocalGnode()
      this.$log.debug(`Render main window mounted:height ${this.height}; owner_api running?${this.ownerApiRunning};wallet exists? ${this.walletExist}`)
    },
    created () {
      this.checkOwnerApi()

      if(locale==='ru'){
        this.isRu = true
      }
      messageBus.$on('selectLocale', (locale)=>{
        if(locale==='ru')this.isRu = true
        else{
          this.isRu = false
        }
      })
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
        if(window =='windowHedwigV1'){
          this.openHedwigV1 = false
        }
        if(window =='windowCheck'){
          this.openCheck = false
        }
        if(window =='windowLang'){
          this.openLang = false
        }
        if(window =='windowGnode'){
          this.openGnode = false
        }
        if(window =='windowTor'){
          this.openTor = false
        }
        if(window =='windowAddress'){
          this.openAddress = false
        }
      })
      messageBus.$on('restoredThenLogin', ()=>{
        this.$log.info('wallet restored and now to login')
        this.walletExist = true
      })
      messageBus.$on('logined', ()=>{
        this.$log.info('app.vue got user logined event')
        this.$walletService.initClient()
        this.ownerApiRunning = true
        this.getHeight()
        messageBus.$emit('update', true)
      })
      messageBus.$on('update', (showloading=true)=>{
        if(showloading){
          this.isloading=true
        }
        this.getHeight()
        this.updateIsLocalGnode()
        }
      )
      messageBus.$on('walletCreateFinished', ()=>{
        this.$log.info('app.vue got walletCreateFinished event')
        this.walletExist = true
      })

      messageBus.$on('walletExisted', ()=>{
        this.$log.warn('Found walletExisted during init new one')
        this.walletExist = true
      })
      messageBus.$on('hedwigRunning', ()=>{
        this.hedwigRunning = true
        this.hedwigFailed = false
      })
      messageBus.$on('hedwigFailed', ()=>{
        this.hedwigRunning= false
        this.hedwigFailed = true
      }),

      messageBus.$on('loaded', ()=>{
        this.isloading = false
      })

      messageBus.$on('scaning', ()=>{
        this.isScaning = true
      })

      messageBus.$on('scaned', ()=>{
        this.isScaning = false
      })
      
    },
    
    watch: {
      isDroppingDown:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown = false}, 
            5*1000)
        }
      },
      isDroppingDown2:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown2 = false}, 
            5*1000)
        }
      },
      isDroppingDown3:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>{
              this.isDroppingDown3 = false}, 
            5*1000)
        }
      },
      ownerApiRunning:function(newVal, old){
        if(newVal){
          ipcRenderer.send('resize', 800, 880)
          this.autoRefresh(60*1000)
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
      lang(){
        this.$i18n.locale = 'en'
      },
      checkOwnerApi(){
        let ret = this.$walletServiceV3.getAccounts()
        if(!ret){return false}
        ret.then(
          (res) =>{
            console.log('getAccounts return:' + JSON.stringify(res))
            if(res.result.OK){
              this.ownerApiRunning = true
            }
          }).catch((error)=>{
            this.ownerApiRunning = false
            this.$log.error('getAccounts failed:' + error)
          })
      },
      getHeight(){
        if(this.$walletServiceV3.isWalletOpened()){
          this.$walletServiceV3.getNodeHeight().then(
            (res) =>{
              console.log('getNodeHeight return' +JSON.stringify(res))
              this.height = parseInt(res.result.Ok.height)
            }).catch((error)=>{
              this.$log.error('getHeight failed:' + error)
            })
        }
      },

      updateIsLocalGnode(){
        //console.log(this.$dbService.getGnodeLocation())
        if(this.$dbService.getGnodeLocation() == 'local'){
          this.isGnodeLocal = true
        }else{
            this.isGnodeLocal = false
        }
      },

      logout(){
        this.$log.debug('logout')
        ipcRenderer.send('quit')
      },
      
      autoRefresh(interval){
        setInterval(()=>{
          if((this.ownerApiRunning) && (!this.isloading) &&(!this.isScaning)){
            //this.$walletServiceV3.getUpdaterMessages(10).then(res=>{
            //  console.log('getUpdaterMessages return:' + JSON.stringify(res))
            //}).catch(err=>{
            //  console.log('getUpdaterMessages error:' + err)
            //})
            ///getUpdaterMessages return:{"id":1,"jsonrpc":"2.0","result":{"Ok":[{"ScanningComplete":"Scanning Complete"},{"Scanning":["Identified 0 wallet_outputs as belonging to this wallet",99]},{"Scanning":["Checking 313 outputs, up to index 7737260. (Highest index: 7737260)",99]},{"Scanning":["Starting UTXO scan",0]},{"UpdatingTransactions":"Updating transactions"},{"UpdatingOutputs":"Updating outputs from node"},{"ScanningComplete":"Scanning Complete"},{"Scanning":["Identified 0 wallet_outputs as belonging to this wallet",99]},{"Scanning":["Checking 319 outputs, up to index 7737260. (Highest index: 7737260)",99]},{"Scanning":["Starting UTXO scan",0]}]}}
            messageBus.$emit('update', false)
          }
        }, interval)
      },
      getGnodeLocationDisplay(){
        if(this.isGnodeLocal){
          return this.$t('msg.local')
        }
        return this.$t('msg.remote')
        
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
            this.$log.debug('User choose to update. now quit app.')
            ipcRenderer.send('quit')
          }else{
            this.$log.info('User chosed to don not update.')
          }})
        }
      }
    },
  }
</script>

<style>
.icon-running{
  background: #00aa72;
  border-color: #e5f8f1;
}
.icon-failed{
  background: #D8000C;
  border-color: #FFBABA;
}
.icon-status{
  display: inline-block;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;
  height: 15px;
  width: 15px;
  border-width: 4px;
  border-style: solid;
  margin-right: 4px;
  vertical-align: top;
}
.button.is-small2 {
    border-radius: 2px;
    font-size: 0.675rem;
}
</style>