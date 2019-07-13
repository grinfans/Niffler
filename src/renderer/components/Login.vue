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

            <a class="button is-small is-text is-pulled-right" @click="openRemove=true">{{ $t("msg.remove.title") }}</a>

          </div>
        </div>
      
      <remove :showModal="openRemove"></remove>

      </div>
    </div>
  </section>
</template>

<script>
import { messageBus } from '@/messagebus'
import {isFirstTime} from '../../shared/first'
import Remove from '@/components/Remove'
import {version, grinNode, gnodeOption} from '../../shared/config'

export default {
  name: "login",

  components: {
    Remove
  },

  data() {
    return {
      firstTime:false,
      password: '', 
      error: false,
      openRemove: false,
      version: version,
    }
  },
  created(){
    messageBus.$on('closeWindowRemove',()=>{this.openRemove = false})
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
      this.$walletService.startOwnerApi(this.password, grinNode)
      setTimeout(()=>{
        this.$walletService.getNodeHeight().then(
          (res) =>{
            setPassword(password)
            messageBus.$emit('logined')
            if(gnodeOption.type!='remoteAllTime')messageBus.$emit('gnodeStarting')
          }).catch((error) => {
            return this.error = true
        })}, 500)
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
