<template>
<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.address") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:400px;background-color: whitesmoke;">
      <div class="message is-link">
        <div class="message-header" ></div>
        <div class="message-body">
          <p>{{ $t("msg.gaddress.address") }} :</p>
          <p class="has-text-weight-semibold is-size-5" style="margin-top:15px;margin-bottom:15px;word-wrap:break-word;"> 
            {{this.grinAddress}}
          </p>
          <p class="is-size-7 tag is-warning animated is-pulled-right bounce" v-if="copied" style="animation-iteration-count:3">
            {{ $t("msg.gaddress.copied") }}
          </p>
          <button v-else class="button is-small is-link is-outlined is-pulled-right" @click="copy" >
            {{ $t("msg.gaddress.copy") }}
          </button>
          <br/>
          <br/>
          <p class="help is-success">{{ $t("msg.gaddress.tips") }}</p>
        </div>
      </div>
      <button class="button is-link is-small"  @click="closeModal" >{{ $t("msg.close") }}</button>
    </section>
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
const clipboard = require('electron').clipboard

export default {
  name: "address",
  props: {
    showModal: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      copied: false,
      grinAddress: '',
    }
  },
  created() {
      this.getGrinAddress()
  },
  methods: {
    getGrinAddress(){
        this.$walletServiceV3.getSlatepackAddress(0).then(res=>{
          console.log('getGrinAddress return:' + JSON.stringify(res))
          this.grinAddress = res.result.Ok
        }).catch(err=>{
              console.log('getGrinAddress error:' + err)
        })
      },
   
    copy(){
      clipboard.writeText(this.grinAddress)
      this.copied = true

      setTimeout(()=>{this.copied = false}, 4000)
    },

    closeModal() {
      this.grinAddress = ''
      this.copied = false
      messageBus.$emit('close', 'windowAddress');
    },
    
  }
}
</script>
<style>
</style>
