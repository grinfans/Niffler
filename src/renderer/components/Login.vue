<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div class="column is-7" >
            <img src="../assets/logo.png" style="width:64px" class="is-pulled-left">
            <h2 class="title" style="margin-top:24px; margin-left:70px;font-size:1.6rem" >{{ $t("msg.title") }}
              <span class="is-pulled-right" style="font-size:0.75rem" >v{{version}}</span>
            </h2>
          </div>
        </div>

        <div class="columns is-mobile is-centered">
          <div class="column"  v-bind:class="{'is-8': firstTime, 'is-7': !firstTime }">
            <div class="message is-warning is-small" v-show="firstTime" >
              <div class="message-header">
                <p>{{ $t("msg.welcome") }}</p>
                <button class="delete" aria-label="delete" @click="firstTime=false"></button>
              </div>
              <div class="message-body">
                <p>{{ $t("msg.login.walletExist") }}</p>
              </div>
            </div>
            <form class="box">
              <div class="field">
                <label class="label">{{ $t("msg.password") }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required disabled v-if="disabled">
                    <input class="input" type="password" placeholder="********" required
                        :class="{'is-warning': error}" v-model="password" v-else>
                  </div>

                  <p class="help is-warning" v-if="error">{{ $t("msg.wrongPassword") }}</p>
                  <p class="help is-link" v-if="info">{{ this.info }}
                     <span class="animated flash" style="animation-iteration-count:infinite;animation-duration: 3s" v-if="disabled">.....</span>
                  </p>
                </div>
            
                <div class="field">
                 
                  <button class="button is-link" disabled v-if="disabled">
                    {{ $t("msg.login_") }}
                  </button>
                  
                  <button class="button is-link" @click.prevent="tryLogin" :class="{'is-loading': logining }" v-else>
                    {{ $t("msg.login_") }}
                  </button>

                </div>
            </form>

            <a class="button is-small is-text is-pulled-right" @click="openRemove=true">{{ $t("msg.remove.title") }}</a>
            <a class="button is-small is-text is-pulled-right" @click="openGnodeConfig=true">{{ $t("msg.gnodeConfigModal.title") }}</a>
          </div>
        </div>
      
      <remove :showModal="openRemove"></remove>
      <gnode-config-modal :showModal="openGnodeConfig"></gnode-config-modal>
      </div>
    </div>
  </section>
</template>

<script>
import { messageBus } from '@/messagebus'
import {isFirstTime} from '../../shared/first'
import Remove from '@/components/Remove'
import GnodeConfigModal from '@/components/GnodeConfigModal'

import {version, grinNode, gnodeOption, grinNode2, grinLocalNode, platform} from '../../shared/config'

export default {
  name: "login",

  components: {
    Remove,
    GnodeConfigModal
  },

  data() {
    return {
      firstTime:false,
      password: '', 
      error: false,
      openRemove: false,
      openGnodeConfig:false,
      version: version,
      logining: false,

      localNodeChecked: false,
      disabled:true,
      info: this.$t('msg.login.waitForLocalGnode'),
      gnode: ''
    }
  },
  created(){
    messageBus.$on('closeWindowRemove',()=>{this.openRemove = false})
    messageBus.$on('closeWindowGnodeConfig',()=>{this.openGnodeConfig = false})
    
    if(gnodeOption.connectMethod !== 'remoteAllTime'){
      let t
      setTimeout(()=>{
          if(this.localNodeChecked)return
          this.$gnodeService.getStatus().then((res)=>{
              this.localNodeChecked = true
              this.$log.debug(`Local gnode running after 2s`)
              this.selectGnode()
          })}, 2000)
      //bind: https://www.jianshu.com/p/5b20bc2d1a32
      for (var i = 1; i < 5; i++) {
        t = i * 4000
        setTimeout(this.checklocalNode.bind(this), t, i)
      }
    }else{
      this.selectGnode()
    }
  },
  
  mounted(){
    this.$log.info('isfirst(login.vue)? '+isFirstTime())
    this.firstTime = isFirstTime()
  },

  methods: {
    checklocalNode(i){
      if(this.localNodeChecked)return
      let t2 = i * 4
      this.$gnodeService.getStatus().then((res)=>{
        this.localNodeChecked = true
        this.$log.debug(`Local gnode running after ${t2}s`)
        this.selectGnode()
      }).catch((err)=>{
        console.log(err)
        if(i==4){
          this.localNodeChecked = true
          this.$log.debug(`Local gnode still not running after ${t2}s. select node`)
          this.selectGnode()
        }
      })
    },
    selectGnode(){
      this.info = this.$t('msg.login.selectingGnode')
      let localHeight
      let remoteHeight
      this.$log.debug('Time to select gnode.')
      this.$log.debug('Use local gnode? ' + gnodeOption.useLocalGnode)  
      this.$log.debug('Connect method is ' + gnodeOption.connectMethod)  
      
      if(!gnodeOption.useLocalGnode){
        this.$dbService.setGnodeLocation('remote')
        this.$log.debug('use remote grin node.')
        this.gnode = grinNode
        this.readyToLogin()
        return
      }
      
      if(gnodeOption.connectMethod ==='localAllTime'){
        this.$dbService.setGnodeLocation('local')
        this.$log.debug('use local grin node.')
        this.gnode = grinLocalNode
        this.readyToLogin()
        return
      }

      this.$remoteGnodeService.getStatus().then((res)=>{
        remoteHeight = parseInt(res.data.tip.height)
        this.$log.debug('Remote node height is ' + remoteHeight)
        if(gnodeOption.connectMethod ==='remoteAllTime' || gnodeOption.connectMethod ==='remoteFirst'){
          this.$dbService.setGnodeLocation('remote')
          this.$log.debug('use remote grin node.')
          this.gnode = grinNode
          this.readyToLogin()
          return
        }
          
        this.$gnodeService.getStatus().then((res)=>{
          localHeight = parseInt(res.data.tip.height)
          let peersCount = parseInt(res.data.connections)
          this.$log.debug('local node height is ' + localHeight)
          this.$log.debug('local node peers count is ' + peersCount)
          if(localHeight + 60 >= remoteHeight && peersCount >= 3){
            this.$log.debug('use local grin node.')
            this.$dbService.setGnodeLocation('local')
            this.gnode = grinLocalNode
            this.readyToLogin()
            return
          }else{
            this.$log.debug('local node height is too low or peers too small. use remote grin node.')
            this.$dbService.setGnodeLocation('remote')
            this.gnode = grinNode
            this.readyToLogin()
            return
          }}).catch((err)=>{
            this.$log.error('local gnode failed. Use remote grin node: ' + err)
              this.$dbService.setGnodeLocation('remote')
              this.gnode = grinNode
              this.readyToLogin()
              return
            })
          }).catch((err)=>{
            this.$dbService.setGnodeLocation('local')
            this.$log.error('getStatus from remote got error:', err)
            this.$log.debug('use local grin node.')
            this.gnode = grinLocalNode
            this.readyToLogin()
            return
          })
    },
    
    readyToLogin(){
      this.disabled = false
      this.info = this.$t('msg.login.gnode') + ':' + this.gnode
    },

    tryLogin(){
      if(this.logining)return
      this.logining = true
      //this.$walletService.killGrinWallet()
      setTimeout(()=>this.checkLogin(), 5000)

      let password = this.password

      this.resetErrors()
      this.$walletService.initClient()
      this.$walletService.startOwnerApi(this.password, this.gnode)
    },
    
    resetErrors(){
      this.error = false;
    },

    checkLogin(){
      this.$log.debug('check owner api process after try to login')

      this.$walletServiceV3.initSharedSecret().then(
        (res)=>{
          this.$walletServiceV3.openWallet(null, this.password).then(
            (res)=>{
              this.$walletServiceV3.startUpdater(60000 * 4).then(
              (res) =>{
                //this.$log.debug('startUpdater return:' + JSON.stringify(res))
                if(!this.$walletService.isWalletConfigExist()){
                  this.$log.debug('no wallet config, create one.' )
                  this.$walletServiceV3.createConfig(chain, null, null, null).then().catch()
                }
                this.$log.debug('owner api process started')
                this.$walletService.setPassword(this.password)
                messageBus.$emit('logined')
              }).catch((error) => {
                this.$log.error('check owner api process got error:', error)
                return this.error = true
            }).finally(()=>{
                this.logining = false
            })
          }).catch(
            error=>{
              this.$log.error('v3 api openWallet got error:', error)
              this.logining = false
              return this.error = true
            }
          )
      }
      ).catch(error=>{
        this.$log.error('v3 api initSharedSecret got error:', error)
        this.logining = false
        return this.error = true
      })
    },
  }
}
</script>

<style>
</style>
