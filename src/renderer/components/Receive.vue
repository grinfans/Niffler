<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:520px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.receive") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:450px;background-color: whitesmoke;">
      
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors" :key="error.id" class="is-size-6">{{ error }}</p>
      </div>
      
      <div v-if="slatepackCreated">
        <p class="animated bounce has-text-link has-text-weight-semibold is-size-5" style="animation-iteration-count:3">
          {{ $t("msg.fileReceive.slatepackCreated") }}
        </p>
        <p v-if="sender" class="help is-success" style="margin-bottom:5px">{{ $t("msg.fileReceive.sender") }}: {{sender}}</p>

        <div id="slatepack_box" contenteditable="true" @paste.prevent="paste">
          <div style="padding:10px">
            <p v-for="line in slatepackToDispaly2" :key="line.id" class="is-family-monospace is-size-7 has-text-link">
              {{line}}
            </p>
          </div>
        </div>
        <br/>
        
        <div class="field is-grouped">
          <div class="control">
            <button v-if="copied" class="button is-success is-small">{{ $t("msg.fileReceive.copied") }}</button>

            <button v-else class="button is-link is-small" @click="copy">{{ $t("msg.fileReceive.copySlatepack") }}</button>
          </div>
          <div class="control">
            <button class="button is-link is-small" @click="save">{{ $t("msg.fileReceive.fileSlatepack") }}</button>
          </div>
          <div class="control">
            <button class="button is-small is-text" @click="closeModal">{{ $t("msg.close") }}</button>
          </div>
        </div>

      </div>

      <div v-else>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link is-small" @click="open">{{ $t("msg.fileReceive.toOpen") }}</button>
          </div>
          <div class="control">
            <p class="has-text-link is-size-7" style="margin-top:8px">{{ $t("msg.fileReceive.toPaste") }} </p>
          </div>
        </div>
        <p v-if="sender" class="help is-success" style="margin-bottom:5px">{{ $t("msg.fileReceive.sender") }}: {{sender}}</p>

        <div id="slatepack_box" contenteditable="true" @paste.prevent="paste">
          <div style="padding:10px">
            <p v-for="line in slatepackToDispaly" :key="line.id" class="is-family-monospace is-size-7 has-text-link">
              {{line}}
            </p>
          </div>
        </div>
        <br/>
        
        <div class="field is-grouped">
          <div class="control">
            <button v-if="slatepack" class="button is-link is-small" @click="create">{{ $t("msg.fileReceive.create") }}</button>
            <button v-else class="button is-link is-small"  disabled>{{ $t("msg.fileReceive.create") }}</button>
          </div>
          <div class="control">
            <button class="button is-small is-text" @click="closeModal">{{ $t("msg.close") }}</button>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
const clipboard = require('electron').clipboard

const fs = require('fs');

export default {
  name: "receive",
  props: {
    showModal: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      errors: [],
      sender: null,
      slatepack: null,
      slatepackCreated: null,
      copied:false
    }
  },
  watch: {
    errors:function(newVal, oldVal){
      if(newVal.length > 0){
        setTimeout(()=>this.errors = [], 
        5*1000)
      }
    }
  },
  computed: {
    slatepackToDispaly: function() {
      if(this.slatepack){
        return this.formatSlatepack(this.slatepack)
      }else{
        return null
      }
    },
    slatepackToDispaly2: function() {
      if(this.slatepack){
        return this.formatSlatepack(this.slatepackCreated)
      }else{
        return null
      }
    }
  },
  methods: {
    formatSlatepack(slatepack){
      let res = slatepack.split(' ')
      let head = res.shift()
      let end = res.pop()
      let result = [head, ]
      let line = []
      for (let i = 0; i < res.length; i++) {
        if(i%4 === 0){
          if(line.length>0)result.push(line.join(' '))
          line = [res[i]]
        }else{
          line.push(res[i])
        }
      }
      result.push(end)
      return result
    },

    validSlatepack(slatepack){
      if(!slatepack.startsWith('BEGINSLATEPACK'))return false
      return true
    },
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowReceive');
    },
    paste(evt){
      let sp = evt.clipboardData.getData('text')
      if(this.validSlatepack(sp)){
        this.slatepack = sp
        this.getSender(sp)
      }else{
        this.errors.push(this.$t('msg.fileReceive.WrongSlatepack'))
      }
    },

    open(){
      let filePaths = this.$electron.remote.dialog.showOpenDialog({
          title: this.$t('msg.open'),
          message: this.$t('msg.fileReceive.openMsg'),
        })
      if(filePaths.length > 0){
        let fn = filePaths[0]
        let content = fs.readFileSync(fn).toString().trim()
        if(this.validSlatepack(content)){
          this.slatepack = content
          this.getSender(content)
        }else{
          this.errors.push(this.$t('msg.fileReceive.WrongSlatepack'))
        }
      }
    },

    getSender(slatepack){
      this.$walletServiceV3.decodeSlatepackMessage(slatepack, [0]).then((res)=>{
          let slatepackMessage = res.result.Ok
          this.sender = slatepackMessage.sender
      }).catch(err=>{this.$log.debug('Failed to get sender:', err)})
    },
    create(){

      let create_ = async function(){
        try{
          let res = await this.$walletServiceV3.getSlateFromSlatepackMessage(this.slatepack, [0])
          console.log(JSON.stringify(res))
          this.$log.debug('getSlateFromSlatepackMessag return:', JSON.stringify(res))
          let slate = res.result.Ok

          res = await this.$walletService.receiveTransaction2(slate, null, null)
          this.$log.debug('receiveTransaction return:', JSON.stringify(res))

          console.log(JSON.stringify(res))
          let slate2 = res.data.result.Ok
          console.log(JSON.stringify(slate2))
          
          res = await this.$walletServiceV3.createSlatepackMessage(slate2, 0, [this.sender])
          this.$log.debug('createSlatepackMessage return:', JSON.stringify(res))
          console.log(JSON.stringify(res))

          this.slatepackCreated = res.result.Ok

        }catch(error){
          this.$log.error('create resp slate error:' + error)        
          this.errors.push(this.$t('msg.fileReceive.CreateFailed'))

          await new Promise(r => setTimeout(r, 4000))

        }finally{
          messageBus.$emit('update', false)
        }
      }

      create_.call(this)
    },
    clearup(){
      this.errors = []
      this.slatepack = null
      errors: [],
      this.sender = null,
      this.slatepack = null,
      this.slatepackCreated = null,
      this.copied = false
    },
    fileTypeIsSupported(file){
      return true
      if( !file.type || file.type.search('text')!=-1 ||	file.type.search('json')!=-1){
        return true
      }else{
        return false
      }
    },
    copy(){
      clipboard.writeText(this.slatepackCreated)
      this.copied = true
    },

    save(){
      if(this.slatepack){
        let fn_output = this.$electron.remote.dialog.showSaveDialog({
          title: this.$t('msg.save'),
          message: this.$t('msg.fileReceive.saveMsg'),
        })
        if(fn_output){
          fn_output = fn_output + '.S2.slatepack'
          fs.writeFileSync(fn_output, this.slatepackCreated)
          this.closeModal()
        }
      }
    }
  }
}
</script>
<style>
#slatepack_box {
  height:280px;
  overflow-y: scroll;
  border-style:dashed; 
  border-width:2px;
  border-color:#dbdbdb;
  background-color:#f6f9fe;
}

.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
