<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div class="column is-6" >
            <img src="../assets/logo.png" style="width:64px" class="is-pulled-left">
            <h2 class="title" style="margin-top: 24px; margin-left:70px;font-size:1.75rem" >{{ $t("msg.title") }}</h2>
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
                  <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': error}" v-model="password">
                  </div>
                  <p class="help is-warning" v-if="error">{{ $t("msg.wrongPassword") }}</p>
                </div>
            
                <div class="field">
                  <button class="button is-link" @click.prevent="tryLogin">
                    {{ $t("msg.login_") }}
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
import {isFirstTime} from '../../shared/first'

export default {
  name: "login",
  data() {
    return {
      firstTime:false,
      password: '', 
      error: false 
    }
  },
  mounted(){
    this.$log.info('isfirst(login.vue)? '+isFirstTime())
    this.firstTime = isFirstTime()
  },
  methods: {
    tryLogin(){
      
      let setPassword = this.$walletService.setPassword
      let password = this.password

      this.resetErrors()
      this.$walletService.initClient()
      this.$walletService.start(this.password)
      setTimeout(()=>{
        this.$walletService.getNodeHeight().then(
          (res) =>{
            setPassword(password)
            messageBus.$emit('logined')
           
          }).catch((error) => {
            return this.error = true
        })}, 250)
      this.resetErrors()
      },
    resetErrors(){
      this.error = false;
    }
  }
}
</script>

<style>
</style>
