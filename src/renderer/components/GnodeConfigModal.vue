<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:450px">
    
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">设置Grin本地节点</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:380px;background-color: #f6f9fe;color: #22509a;">
      <GnodeConfig v-on:close="quit"></GnodeConfig>
    </section>
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
const {ipcRenderer} = require('electron')
import GnodeConfig from '@/components/GnodeConfig'

export default {
  name: "gnode-config-modal",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  components: {
      GnodeConfig
  },
  methods: {
    quit(){
      ipcRenderer.send('quit')
    },
    closeModal() {
      messageBus.$emit('closeWindowGnodeConfig');
    }
  }
}
</script>
<style>
</style>
