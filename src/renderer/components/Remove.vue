<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:400px">
    
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-danger has-text-weight-semibold">{{ $t("msg.remove.title") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:275px;background-color: whitesmoke;">
      <div v-if="removed" >
        <p class="notification is-danger">{{ $t("msg.remove.success") }}</p>
        <div class="center">
        <button class="button is-outlined" @click="quit">ok</button>
        </div>
      </div>
      <div v-else>
        <div class="message is-danger">
          <div class="message-header"><p>{{ $t("msg.remove.warning") }}</p></div>
          <div class="message-body">
            <p>{{ $t("msg.remove.info") }}</p>
          </div>
        </div>

        <p v-if="noConfirmed" class="animated bounce has-text-weight-semibold has-text-danger" style="animation-iteration-count:3">
          {{ $t("msg.remove.help") }}
        </p>
        <p v-else class="help is-danger">{{ $t("msg.remove.help") }}</p>

        <div class="field has-addons">
          <div class="control">
          <input class="input" type="text" v-model="removeConfirmedText" placeholder="" v-bind:class="{'is-danger': noConfirmed }">
        </div>
        <div class="control">
          <a class="button is-danger" @click="remove">
            {{ $t("msg.remove.remove") }}
          </a>
        </div>
        <div class="control">
              <button class="button is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
            </div>
        </div>
          
        <br/>
      </div>
    </section>
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
import { grinDIR, nifflerPath} from '../../shared/config'
const fse = require('fs-extra')
const {ipcRenderer} = require('electron')
const path = require('path')

export default {
  name: "remove",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      removeConfirmedText: '',
      removed:false,
      noConfirmed: false
    }
  },
  watch: {
      noConfirmed:function(newVal, oldVal){
        if(newVal){
          setTimeout(
            ()=>this.noConfirmed = false, 
            5*1000)
        }
      },
  },
  methods: {
    quit(){
      ipcRenderer.send('quit')
    },
    remove(){
      let rcText = this.removeConfirmedText.trim().toLowerCase()
      if(['移除', 'remove'].indexOf(rcText) >= 0){
        let suffix = String(Math.random()).slice(2)
        let dest = path.join(nifflerPath, `.grin_${suffix}`)
        fse.moveSync(grinDIR, dest)
        this.removed = true
      }else{
        this.noConfirmed = true
      }
    },
    closeModal() {
      messageBus.$emit('closeWindowRemove');
      this.noConfirmed = false
    }
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
