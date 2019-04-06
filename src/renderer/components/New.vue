<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div v-if="walletCreated" class="column is-10" >
            
            <h1 class="title">{{ $t('msg.new_.seedPhrase') }}</h1>
            
              <p class="animated bounce has-text-weight-semibold has-text-warning" style="animation-iteration-count:3">
                {{ $t('msg.new_.backupNote') }}
              </p>

              <br/>
              <div class="tags are-medium">
                <span class="tag" v-for="seed in seeds">{{seed}}</span>
              </div>

            <a class="button is-link is-inverted is-outlined" @click="finish">{{ $t('msg.new_.backupFinish') }}</a>
          </div>
              
          <div v-else class="column is-8" >
            <h1 class="title">{{ $t('msg.title') }}</h1>
            
            <div class="message is-warning is-small">
              <div class="message-header">
                <p>{{ $t("msg.welcome") }}</p>
              </div>
              <div class="message-body">
                <p>{{ $t("msg.new_.toNewMsg") }}</p>
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
                  <button class="button is-link" @click.prevent="create">
                    {{ $t('msg.new_.newWallet') }}
                  </button>
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
  name: "new",
  data() {
    return {
      password: "", 
      password2: "", 
      walletCreated: false,
      error: false,
      errorInfo: '',
      seeds: []
    }
  },
  created(){
    messageBus.$on('walletCreated', (seed)=>{
      this.$log.debug('new.vue got walletCreated event.')
      this.$walletService.initClient()
      this.walletCreated = true
      this.seeds = seed.split(' ')
    })
  },
  methods: {
    create(){
      this.resetErrors()
      if(this.password.length == 0 ){
        this.error = true
        this.errorInfo = this.$t('msg.new_.errorPasswdEmpty')
        return
      }
      if(this.password != this.password2 ){
        this.error = true
        this.errorInfo = this.$t('msg.new_.errorPasswdConsistency')
        return
      }
      this.$walletService.new(this.password)
    },
    finish(){
      messageBus.$emit('walletCreateFinished')
    },
    resetErrors(){
      this.error = false;
    }
  }
}
</script>

<style>

</style>
