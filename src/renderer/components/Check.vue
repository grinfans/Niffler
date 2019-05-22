<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.check.title") }}</p>
    </header>
    <section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
      <div v-if="checking">
        <div class="message is-link">
          <div class="message-header" v-if="checking"><p>{{ $t("msg.check.checking") }}</p></div>
          <div class="message-body">
            <div class="control">
              <p class="is-size-7" v-for="output in checkOutputs">{{ output }}</p>
          </div>
          </div>
        </div>
        <button class="button is-link is-outlined" @click="stop">
          {{ $t("msg.check.stop") }}
        </button>
      </div>

      <div v-else-if="checked">
        <div class="notification is-link" >
          <p>{{ $t("msg.check.checkedMsg") }}</p>
        </div>
        <button class="button is-link is-outlined center" @click="closeModal">ok</button>
      </div>  
      <div v-else>
        <div class="message is-warning">
          <div class="message-header"><p>{{ $t("msg.check.introTitle") }}</p></div>
          <div class="message-body">
            <p>{{ $t("msg.check.intro1") }}</p><br/>
            <p>{{ $t("msg.check.intro2") }}</p><br/>
            <p class="has-text-link has-text-weight-semibold">{{ $t("msg.check.tip") }}</p>
          </div>
        </div>
        <div class="center">
          <div class="field is-grouped " >
            <div class="control">
              <button class="button is-link" v-bind:class="{'is-loading':checking}" @click="start">
                {{ $t("msg.check.start") }}
              </button>
            </div>
            <div class="control">
              <button class="button is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <message :showMsg="openStopMsg" v-on:close="openStopMsg = false" 
      v-bind:msg=stopMsg v-bind:showTime="5" msgType="link">
    </message>
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
import Message from '@/components/Message'
import { setTimeout } from 'timers';

export default {
  name: "check",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  components: {
      Message
  },
  data() {
    return {
      checking:false,
      checked:false,
      checkOutputs: [],
      openStopMsg: false,
      stopMsg: this.$t("msg.check.stopCheckMsg"),
    }
  },
  created() {
      messageBus.$on('walletCheckFinished', ()=>{
        this.$log.debug('Got walletCheckFinished message.')
        this.checking = false
        this.checked = true
      })
  },
  methods: {
    start(){
      this.checking = true
      this.checked = false
      this.$walletService.check(this.updateOutput)
    },

    stop(){
      this.$walletService.stopProcess('check')
      this.openStopMsg = true
      this.checking = false
      setTimeout(()=>{
        this.closeModal()
      }, 2000)
    },

    updateOutput(data){
      this.checkOutputs.push(data)
    },

    closeModal() {
      if(!this.checking)this.clearup()
      messageBus.$emit('close', 'windowCheck');
    },
    
    clearup(){
      this.checking = false
      this.checked = false
      this.checkOutputs = []
      this.openStopMsg = false
      this.openCheckedMsg = false
    },
  }
}
</script>
<style>
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
