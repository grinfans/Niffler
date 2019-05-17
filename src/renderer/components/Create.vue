<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div v-if="walletCreated" class="column is-10" >
            
            <h1 class="title">{{ $t('msg.create.seedPhrase') }}</h1>
            
              <p class="animated bounce has-text-weight-semibold has-text-warning" style="animation-iteration-count:3">
                {{ $t('msg.create.backupNote') }}
              </p>

              <br/>
              <div class="tags are-medium">
                <span class="tag" v-for="seed in seeds">{{seed}}</span>
              </div>

            <a class="button is-link is-inverted is-outlined" @click="finish">{{ $t('msg.create.backupFinish') }}</a>
          </div>
              
          <div v-else class="column is-8" >
            <img src="../assets/logo.png" style="width:64px" class="is-pulled-left">
            <h2 class="title" style="margin-top: 24px; margin-left:70px" >{{ $t("msg.title") }}</h2>

            <div class="message is-warning is-small">
              <div class="message-header">
                <p>{{ $t("msg.welcome") }}</p>
              </div>
              <div class="message-body">
                <p>{{ $t("msg.create.toNewMsg") }}</p>
              </div>
            </div>

            <form class="box">
              <!--<div class="field has-text-centered">
                <img src="../assets/logo.png">
              </div>-->
              <div class="field">
                <label class="label">{{ $t('msg.password') }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': error}" v-model="password">
                  </div>
                </div>
                <div class="field">
                <label class="label">{{ $t('msg.passwordAgain') }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': error}" v-model="password2">
                  </div>
                  <p class="help is-warning" v-if="error">{{errorInfo}}</p>
                </div>
            
                <div class="field">
                  <button class="button is-link" @click.prevent="create" v-bind:class="{'is-loading':walletCreating}">
                    {{ $t('msg.create.newWallet') }}
                  </button>
                  <button class="button is-text" @click="back">{{ $t("msg.back") }}</button>

                </div>
            </form>
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
  name: "create",
  data() {
    return {
      password: "", 
      password2: "", 
      walletCreated: false,
      walletCreating: false,
      error: false,
      errorInfo: '',
      seeds: []
    }
  },
  created(){
    messageBus.$on('walletCreated', (seed)=>{
      this.$log.debug('new.vue got walletCreated event.')
      this.$walletService.initClient()
      this.walletCreating= false
      this.walletCreated = true
      this.seeds = seed.split(' ')
    })
    messageBus.$on('walletCreateFailed', (err)=>{
      this.error = true
      this.errorInfo = this.$t('msg.create.errorCreateFailed')
      this.clearup()
    })
  },
  methods: {
    create(){
      if(this.walletCreating){
        return
      }
      this.resetErrors()
      if(this.password.length == 0 ){
        this.error = true
        this.errorInfo = this.$t('msg.create.errorPasswdEmpty')
        return
      }
      if(this.password != this.password2 ){
        this.error = true
        this.errorInfo = this.$t('msg.create.errorPasswdConsistency')
        return
      }
      this.walletCreating = true
      this.$walletService.new(this.password)
    },
    finish(){
      this.clearup()
      messageBus.$emit('walletCreateFinished')
    },
    resetErrors(){
      this.error = false;
    },
    clearup(){
      this.password = ""
      this.password2 = ""
      this.walletCreating = false
      this.error = false,
      this.errorInfo = ''
    },
    back(){
      this.clearup()
      messageBus.$emit('backToNew')
    }
    
  }
}
</script>

<style>

</style>
