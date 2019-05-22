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
                请一个个地输入助记词({{seeds.length}}/{{total}})
              </p>
              <div class="field has-addons">
                <div class="control">
                  <input class="input" type="text" placeholder="助记词" v-model="currentSeed"  v-on:keyup.enter="add">
                </div>

                <div class="control">
                  <a class="button is-warning" @click="add">添加</a>
                </div>
              </div>
              <p class="help is-warning" v-show="currentSeedInvalid">助记词无效</p>
              <button class="button is-link is-inverted is-outlined is-small" @click="delete_">删除</button>
              <button class="button is-link is-inverted is-outlined is-small" @click="back">{{ $t("msg.back") }}</button>

              <br/>
              <br/>
              <div class="tags are-medium">
                <span class="tag" v-for="seed in seeds">{{seed}}</span>
              </div>
              <a class="button is-link is-inverted is-outlined" v-show="enoughSeeds" @click="page='addPassword'">助记词输入完成</a>
            </div>

            <div v-else-if="page==='addPassword'">
              <p class="has-text-weight-semibold has-text-warning" 
                style="margin-bottom:12px">
                设置新恢复钱包的密码
              </p>
              <form class="box" style="width:380px">
              
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
                  <button class="button is-link" @click.prevent="initR" >
                    恢复钱包</button>
                  <button class="button is-text" @click="page='addSeeds'">
                    {{ $t("msg.back") }}</button>
                </div>
              </form>
            </div>
          
          <div v-else-if="page==='recoverError'"> 
            <div class="notification is-warning">
            <p>{{recoverErrorInfo}}</p>
            </div>

            <button class="button is-link is-inverted is-outlined" @click="page='addSeeds'">
              重新输入
            </button>
          </div>
          <div v-else-if="page==='recovered'"> 
            <div class="animated bounce has-text-weight-semibold has-text-warning" 
                style="animation-iteration-count:2;margin-bottom:10px">
                <p>钱包恢复成功, 开始从Grin区块链同步钱包余额；</p>
                <p>预计需要15-30分钟，不要关闭钱包，请耐心等待 ......</p>
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
                导入钱包成功
            </p>
            <a class="button is-link is-inverted is-outlined" @click="toLogin">登陆钱包</a>
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

export default {
  name: "restore",
  data() {
    return {
      currentSeed: '',
      currentSeedInvalid: false,
      enoughSeeds: true,
      seeds: 'nurse chuckle view goddess wrist uncover spy youth mechanic result mad obey once frog swim ecology athlete link lottery size lab uncover force glory'.split(' '),
      password: '123',
      password2: '123',
      total: 24,
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
        this.page = 'recovered'
        this.$walletService.restore(this.password, this.updateOutput)
      }else if(ret === 'invalidSeeds'){
        this.page = 'recoverError'
        this.recoverErrorInfo = '助记词无效'
      }else{
        this.page = 'recoverError'
        this.recoverErrorInfo = ret
      }
    })
    messageBus.$on('walletRestored', (ret)=>{
      this.page = 'restored'
    })
  },
  watch: {
    seeds:function(newVal, oldVal){
      if(newVal.length == this.total){
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
      if(this.enoughSeeds)return
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
      this.$walletService.recover(this.seeds.join(' '), this.password)
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
