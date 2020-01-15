<template>
<div class="field">
    <p class="tag is-warning" style="font-size:0.85rem;margin-left:-10px">{{ $t("msg.gnodeConfig.warning") }}</p>
    <br/>
    <label class="checkbox" style="color:#22509a;font-size:0.95rem;margin-top:20px">
    <input type="checkbox" v-model="useLocalGnode">
    {{ $t("msg.gnodeConfig.useLocalorNot") }}
    </label>
    <div v-if="useLocalGnode">
      <label class="label" style="color:#22509a;margin-top:17.5px">{{ $t("msg.node") }}:</label>
      <div class="field is-horizontal">
          <div class="field-label is-normal">
              <span style="font-size:0.88rem">{{ $t("msg.localNode") }}</span>:
          </div>
          <div class="field-body">
              <div class="field">
                  <div class="control">
                      <input class="input is-small" type="text" v-model="localAddr">
                  </div>
              </div>
          </div>
      </div>
      <div class="field is-horizontal">
          <div class="field-label is-normal">
              <span style="font-size:0.88rem">{{ $t("msg.remoteNode") }}</span>:
          </div>
          <div class="field-body">
              <div class="field">
                  <div class="control">
                      <input class="input is-small" type="text" v-model="remoteAddr">
                  </div>
              </div>
          </div>
      </div>               
      <label class="label" style="color:#22509a; margin-top:17.5px">{{ $t("msg.gnodeConfig.connectMethod") }}:</label>
      <div class="control" style="font-size:0.8rem">
        <label class="radio">
              <input type="radio" value="remoteFirst" v-model="connectMethod">&nbsp;{{ $t("msg.gnodeConfig.remoteFirst") }}
          </label>
          <br/>
          <label class="radio">
              <input type="radio" value="localFirst" v-model="connectMethod">&nbsp;{{ $t("msg.gnodeConfig.localFirst") }}
          </label>
          <br/>
          <label class="radio">
              <input type="radio" value="remoteAllTime" v-model="connectMethod">&nbsp;{{ $t("msg.gnodeConfig.remoteAllTime") }}
          </label>
          <br/>
          <label class="radio">
              <input type="radio" value="localAllTime" v-model="connectMethod">&nbsp;{{ $t("msg.gnodeConfig.localAllTime") }}
          </label>
      </div>
      <label class="label" style="color:#22509a; margin-top:17.5px">{{ $t("msg.other") }}:</label>
      <label class="checkbox" style="font-size:0.88rem">
      <input type="checkbox" v-model="background">
        {{ $t("msg.gnodeConfig.background") }}
      </label>
    </div>
    <br v-if="!useLocalGnode"/>
    <br/>
    <a class="button is-link is-small" @click="save">{{ $t("msg.save") }}</a>
    <a class="button is-text is-small" @click="restore">{{ $t("msg.gnodeConfig.restoreToDefault") }}</a>

    <message :showMsg="openMsg" v-on:close="closeConfig" 
    v-bind:msg=msg v-bind:showTime="5" msgType="link">
    </message>

</div>
</template>

<script>
import {gnodeOption, defaultGnodeOptions, setConfig} from '../../shared/config'
import Message from '@/components/Message'

export default {
  name: "gnodeConfig",
  
  components: {
      Message
  },

   watch: {
    connectMethod:function(newVal, oldVal){
      if(newVal=='localAllTime'){
        this.background = true
      }
    },
  },

  data() {
    return{
      useLocalGnode: gnodeOption.useLocalGnode,
      localAddr: gnodeOption.localAddr,
      remoteAddr: gnodeOption.remoteAddr,
      connectMethod: gnodeOption.connectMethod,
      background: gnodeOption.background,
      openMsg:false,
      msg: this.$t('msg.gnodeConfig.saved')
    }
  },
  methods: {
    save(){
      let options = {
        'useLocalGnode':this.useLocalGnode,
        'connectMethod': this.connectMethod,
        'remoteAddr': this.remoteAddr,
        'localAddr': this.localAddr,
        'background': this.background,
      }
      setConfig({'gnode': options})
      this.openMsg = true
    },
    restore(){
      this.useLocalGnode = defaultGnodeOptions.useLocalGnode
      this.localAddr = defaultGnodeOptions.localAddr
      this.remoteAddr = defaultGnodeOptions.remoteAddr
      this.connectMethod = defaultGnodeOptions.connectMethod
      this.background = defaultGnodeOptions.background
      setConfig({'gnode': defaultGnodeOptions})
    },
    closeConfig(){
      this.openMsg = false
      this.$emit('close')
    }
  }
}
</script>
<style>
</style>
