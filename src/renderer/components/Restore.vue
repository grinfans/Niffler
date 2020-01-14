<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div class="column is-10" >
            
            <h1 class="title">{{ $t('msg.restore.title') }}</h1>
            <div v-if="page==='addSeeds'">
              <p class="animated bounce has-text-weight-semibold has-text-warning" 
                style="animation-iteration-count:2;margin-bottom:12px">
                {{ $t('msg.restore.addSeedsInfo') }} ({{seeds.length}}/(12 or 24))
              </p>
              <div class="field has-addons">
                <div class="control">
                  <input class="input" type="text" v-model="currentSeed"  v-on:keyup.enter="add">
                </div>

                <div class="control">
                  <a class="button is-warning" @click="add">{{ $t('msg.restore.add') }}</a>
                </div>
              </div>
              <p class="help is-warning" v-show="currentSeedInvalid">{{ $t('msg.restore.invalid') }}</p>
              <button class="button is-link is-inverted is-outlined is-small" @click="delete_">{{ $t('msg.restore.delete') }}</button>
              <button class="button is-link is-inverted is-outlined is-small" @click="back">{{ $t("msg.back") }}</button>

              <br/>
              <br/>
              <div class="tags are-medium">
                <span class="tag" v-for="seed in seeds">{{seed}}</span>
              </div>
              <a class="button is-link is-inverted is-outlined" v-show="enoughSeeds" @click="page='addPassword'">
                {{ $t('msg.restore.added') }}</a>
            </div>

            <div v-else-if="page==='addPassword'">
              <p class="has-text-weight-semibold has-text-warning" 
                style="margin-bottom:12px">
                {{ $t('msg.restore.newPassword') }}
              </p>
              <div class="box" style="width:380px">
              
                <div class="field">
                  <label class="label">{{ $t('msg.password') }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': errorPassword}" v-model="password">
                  </div>
                </div>

                <div class="field">
                  <label class="label">{{ $t('msg.passwordAgain') }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': errorPassword}" v-model="password2">
                  </div>
                  <p class="help is-warning" v-if="errorPassword">{{errorInfoPassword}}</p>
                </div>
            
                <div class="field">
                  <button class="button is-link" @click="initR" >
                    {{ $t('msg.restore.recover') }}</button>
                  <button class="button is-text" @click="page='addSeeds'">
                    {{ $t("msg.back") }}</button>
                </div>
              </div>
            </div>
          
          <div v-else-if="page==='recoverError'"> 
            <div class="notification is-warning">
            <p>{{recoverErrorInfo}}</p>
            </div>

            <button class="button is-link is-inverted is-outlined" @click="page='addSeeds'">
              {{ $t('msg.restore.reAdd') }}
            </button>
          </div>
          <div v-else-if="page==='recovered'"> 
            <div class="animated bounce has-text-weight-semibold has-text-warning" 
                style="animation-iteration-count:2;margin-bottom:10px">
                <p>{{ $t('msg.restore.recovered') }} </p>
                <p>{{ $t('msg.restore.restoring') }}</p>
            </div>
              <div v-if="restoreOutputs.length > 0">
                <div class="message is-link" style="width:400px">
                  <div class="message-body">
                    <div class="control">
                      <p class="is-size-7" v-for="output in restoreOutputs">{{ output }}</p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div v-else-if="page==='restored'"> 
            <p class="animated bounce has-text-weight-semibold has-text-warning is-size-5" 
                style="animation-iteration-count:2;margin-bottom:40px">
                {{ $t('msg.restore.restored') }}
            </p>
            <a class="button is-link is-inverted is-outlined" @click="toLogin">{{ $t('msg.restore.login') }}</a>
          </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { messageBus } from '@/messagebus'
const { exec } = require('child_process')
import walletServiceV3 from '../../shared/walletv3'
import {chainType, grinNode2, grinLocalNode} from '../../shared/config'

export default {
  name: "restore",
  data() {
    return {
      currentSeed: '',
      currentSeedInvalid: false,
      enoughSeeds: false,
      seeds:[],
      password: '',
      password2: '',
      page: 'addSeeds',
      
      errorPassword: false,
      errorInfoPassword: '',
      
      recoverErrorInfo: '',

      restoreOutputs: [],
    }
  },
  
  created(){
    messageBus.$on('walletRecoverReturn', (ret)=>{
      if(ret === 'ok'){
        let gnode = grinNode2

        this.page = 'recovered'
        let localGnodeStatus = this.$dbService.getLocalGnodeStatus()
        this.$log.debug('check grin local status before restore balance: ' + localGnodeStatus)
        if(localGnodeStatus == 'running'){
          this.$log.debug('check use grin local node')
          gnode = grinLocalNode
        }
        this.$walletService.check(this.updateOutput, gnode, this.password)
      }else if(ret === 'invalidSeeds'){
        this.page = 'recoverError'
        this.recoverErrorInfo = this.$t('msg.restore.invalid')
      }else{
        this.page = 'recoverError'
        this.recoverErrorInfo = this.$t('msg.restore.failed')
      }
    })
    messageBus.$on('walletCheckFinished', (ret)=>{
      this.page = 'restored'
    })
  },
  watch: {
    seeds:function(newVal, oldVal){
      if(newVal.length == 24 || newVal.length == 12){
        this.enoughSeeds = true
      }else{
        this.enoughSeeds = false
      }
    }
  },
  methods: {
    clearup(){
      this.enoughSeeds = false
      this.currentSeed = ''
      this.currentSeedInvalid = false
      this.seeds = []
      this.password =''
      this.password2 = ''
      this.page = 'addSeeds'
      this.errorPassword = false
      this.errorInfoPassword = ''
      this.recoverErrorInfo = ''

      this.restoreOutputs =[]
    },
    
    updateOutput(data){
      //let toDel = 'grin_wallet_libwallet::internal::restore'
      //this.restoreOutputs.push(data.replace(toDel, '').replace('WARN', ''))
      this.restoreOutputs.push(data)
    },

    validSeed(seed) {
      let re = /^[A-Za-z]+$/
      return re.test(seed)
    },
    add(){
      if(this.seeds.length >=24 )return
      let seed = this.currentSeed.trim()
      if(seed === '' || !this.validSeed(seed) ){
        return this.currentSeedInvalid = true
      }else{
        this.currentSeedInvalid = false
        this.seeds.push(seed)
        this.currentSeed = ''
      }
    },
    resetErrors(){
      this.errorPassword = false;
    },
    initR(){
      this.resetErrors()
      if(this.password.length == 0 ){
        this.errorPassword = true
        this.errorInfoPassword = this.$t('msg.create.errorPasswdEmpty')
        return
      }
      if(this.password != this.password2 ){
        this.errorPassword = true
        this.errorInfoPassword = this.$t('msg.create.errorPasswdConsistency')
        return
      }
      const seeds_ = this.seeds.join(' ')
      let len = 32
      if(this.seeds.length==12){
        len = 16
      }
      let chain
      if(chainType==='main')chain='Mainnet'
      if(this.$walletService.isWalletConfigExist()){
        walletServiceV3.createWallet(null, seeds_, len, this.password).then(
          (res)=>{
            this.$log.debug('createWallet return: '+ JSON.stringify(res))
            if(res.result.hasOwnProperty('Ok')){
              if(this.$walletService.isExist()){
                messageBus.$emit('walletRecoverReturn', 'ok')
              }else{
                messageBus.$emit('walletRecoverReturn', 'invalidSeeds')
              }
            }
          }).catch((err)=>{
            this.$log.error('createWallet failed: '+ err)
            messageBus.$emit('walletRecoverReturn', 'failed')
          })
      }else{
        walletServiceV3.createConfig(chain, null, null, null).then(
          (res) =>{
            this.$log.debug('createConfig return: '+ JSON.stringify(res))
            if(res.result.hasOwnProperty('Ok')){
              walletServiceV3.createWallet(null, seeds_, len, this.password).then(
                (res)=>{
                  this.$log.debug('createWallet return: '+ JSON.stringify(res))
                  if(res.result.hasOwnProperty('Ok')){
                    if(this.$walletService.isExist()){messageBus.$emit('walletRecoverReturn', 'ok')}
                    else{
                      messageBus.$emit('walletRecoverReturn', 'invalidSeeds')
                    }
                  }
                }).catch((err)=>{
                  this.$log.error('createWallet failed: '+ err)
                  messageBus.$emit('walletRecoverReturn', 'failed')
                })
            }
          }).catch((err)=>{
            this.$log.error('createConfig failed: '+ err)
            messageBus.$emit('walletRecoverReturn', 'failed')
          })
      }
    },
    delete_(){
      if(this.seeds.length>0)this.seeds.pop()
    },
    
    back(){
      this.clearup()
      messageBus.$emit('backToNew')
    },
    toLogin(){
      this.clearup()
      messageBus.$emit('restoredThenLogin')
    }
  }
}
</script>

<style>

</style>
