<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div class="column is-6" >
            <img src="../assets/logo.png" style="width:64px" class="is-pulled-left">
            <h2 class="title" style="margin-top:24px; margin-left:70px;font-size:1.6rem" >{{ $t("msg.title") }}
              <span class="is-pulled-right" style="font-size:0.75rem">v{{version}}</span>
            </h2>
          </div>
        </div>

        <div class="columns is-mobile is-centered">
          <div class="column"  v-bind:class="{'is-8': firstTime, 'is-6': !firstTime }">
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
                  <p class="help is-warning" v-if="disabled">{{ $t("msg.waitForLocalGnode") }}
                     <span class="animated flash" style="animation-iteration-count:infinite;animation-duration: 3s">.....</span>
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

      disabled: true
    }
  },
  created(){
    messageBus.$on('closeWindowRemove',()=>{this.openRemove = false})
    messageBus.$on('closeWindowGnodeConfig',()=>{this.openGnodeConfig = false})

    setTimeout(()=>{
      if(!this.disabled)return
      this.$gnodeService.getStatus().then((res)=>{
          this.$log.debug('Local gnode running after 12s.')
          this.disabled = false
        }).catch((err)=>console.log(err))
    }, 12000)

    setTimeout(()=>{
      if(!this.disabled)return
      this.$gnodeService.getStatus().then((res)=>{
          this.$log.debug('Local gnode running after 9s.')
          this.disabled = false
        }).catch((err)=>console.log(err))
    }, 9000)

    setTimeout(()=>{
      if(!this.disabled)return
      this.$gnodeService.getStatus().then((res)=>{
          this.$log.debug('Local gnode running after 6s.')
          this.disabled = false
        }).catch((err)=>console.log(err))
    }, 6000)

   
     setTimeout(()=>{
      if(!this.disabled)return
      this.$gnodeService.getStatus().then((res)=>{
          this.$log.debug('Local gnode running after 3s.')
          this.disabled = false
        }).catch((err)=>console.log(err))
    }, 3000)

    setTimeout(()=>{
      if(this.disabled){
        this.$gnodeService.getStatus().then((res)=>{
          this.$log.debug('Local gnode running after 15s.')
        }).catch((err)=>this.$log.debug('No wait for local gnode'))
        .finally(this.disabled = false) 
      }
    }, 15000)
  },
  mounted(){
    this.$log.info('isfirst(login.vue)? '+isFirstTime())
    this.firstTime = isFirstTime()
  },
  methods: {
    tryLogin(){
      if(this.logining)return
      this.logining = true
      //this.$walletService.killGrinWallet()

      let password = this.password

      this.resetErrors()
      this.$walletService.initClient()
      
      let selectGnodeAndLogin = async function(){
        
        setTimeout(()=>this.checkLogin(), 6000)

        let localHeight
        let remoteHeight
        this.$log.debug('Time to select gnode.')
        this.$log.debug('Use local gnode? ' + gnodeOption.useLocalGnode)  
        this.$log.debug('Connect method is ' + gnodeOption.connectMethod)  
        if(!gnodeOption.useLocalGnode){
          this.$dbService.setGnodeLocation('remote')
          this.$log.debug('use remote grin node.')
          return this.$walletService.startOwnerApi(this.password, grinNode)
        }
        if(gnodeOption.connectMethod ==='localAllTime'){
          this.$dbService.setGnodeLocation('local')
          this.$log.debug('use local grin node.')
          return this.$walletService.startOwnerApi(this.password, grinLocalNode)
        }else{
          this.$remoteGnodeService.getStatus().then(
            (res)=>{
              remoteHeight = parseInt(res.data.tip.height)
              this.$log.debug('Remote node height is ' + remoteHeight)
              if(gnodeOption.connectMethod ==='remoteAllTime' || gnodeOption.connectMethod ==='remoteFirst'){
                this.$dbService.setGnodeLocation('remote')
                this.$log.debug('use remote grin node.')
                return this.$walletService.startOwnerApi(this.password, grinNode)
              }
              this.$gnodeService.getStatus().then(
                (res)=>{
                  localHeight = parseInt(res.data.tip.height)
                  let peersCount = parseInt(res.data.connections)
                  this.$log.debug('local node height is ' + localHeight)
                  this.$log.debug('local node peers count is ' + peersCount)
                  if(localHeight + 60 >= remoteHeight && peersCount >= 3){
                    this.$log.debug('use local grin node.')
                    this.$dbService.setGnodeLocation('local')
                    return this.$walletService.startOwnerApi(this.password, grinLocalNode)
                  }else{
                    this.$log.debug('local node height is too low or peers too small. use remote grin node.')
                    this.$dbService.setGnodeLocation('remote')
                    return this.$walletService.startOwnerApi(this.password, grinNode)
                  }
              }).catch((err)=>{
                this.$log.error('local gnode failed. Use remote grin node: ' + err)
                this.$dbService.setGnodeLocation('remote')
                return this.$walletService.startOwnerApi(this.password, grinNode)
              })
            }
          ).catch((err)=>{
            this.$dbService.setGnodeLocation('local')
            this.$log.error('getStatus from remote got error:', err)
            this.$log.debug('use local grin node.')
            return this.$walletService.startOwnerApi(this.password, grinLocalNode)
          })
        }
      }
      setTimeout(()=>selectGnodeAndLogin.call(this), 1000)
      this.resetErrors()
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
