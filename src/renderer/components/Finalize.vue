<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:545px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.finalize.finalize") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:450px;background-color: whitesmoke;">
      
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors" :key="error.id" class="is-size-6">{{ error }}</p>
      </div>
      
      <div v-if="status==='sent'">
      <div class="notification is-link" >
        {{ $t("msg.finalize.success") }}
      </div>
      <div class="center">
        <a class="button is-link is-outlined" @click="closeModal">
          {{ $t("msg.finalize.ok") }}
        </a>
      </div>
      </div>

      <div v-if="status==='sending'">
        <p class="is-size-5">{{ $t("msg.finalize.sending") }}</p>
        <br/>
        <progress class="progress is-link" max="100"></progress>
      </div>

      <div v-if="status==='toSend'">
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link is-small" @click="open">{{ $t("msg.finalize.toOpen") }}</button>
          </div>
          <div class="control">
            <p class="has-text-link is-size-7" style="margin-top:8px">{{ $t("msg.finalize.toPaste") }} </p>
          </div>
        </div>
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
            <button v-if="slatepack" class="button is-link is-small" @click="send2">{{ $t("msg.finalize.send") }}</button>
            <button v-else class="button is-link is-small"  disabled>{{ $t("msg.finalize.send") }}</button>
          </div>
          <div class="control">
            <button class="button is-small is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
          </div>
        </div>

      </div>

    </section>
    
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
import {grinNode, grinLocalNode} from '../../shared/config'

const fs = require('fs');

export default {
  name: "finalize",
  props: {
    showModal: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      errors: [],
      status: 'toSend',
      slatepack: null
    }
  },
  watch: {
    errors:function(newVal, oldVal){
      if(newVal.length > 0){
        setTimeout(()=>this.errors = [], 
        6*1000)
      }
    }
  },
  computed: {
    slatepackToDispaly: function() {
      if(this.slatepack){
        let res = this.slatepack.split(' ')
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
        result.push(line.join(' '))
        result.push(end)
        return result
      }else{
        return null
      }
    }
  },
  methods: {
    validSlatepack(slatepack){
      if(!slatepack.startsWith('BEGINSLATEPACK'))return false
      return true
    },
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowFinalize');
    },
    paste(evt){
      let sp = evt.clipboardData.getData('text')
      if(this.validSlatepack(sp)){
        this.slatepack = evt.clipboardData.getData('text')
      }else{
        this.errors.push(this.$t('msg.finalize.WrongSlatepack'))
      }
    },

    open(){
      let filePaths = this.$electron.remote.dialog.showOpenDialog({
          title: this.$t('msg.open'),
          message: this.$t('msg.finalize.openMsg'),
        })
      if(filePaths.length > 0){
        let fn = filePaths[0]
        let content = fs.readFileSync(fn).toString().trim()
        if(this.validSlatepack(content)){
          this.slatepack = content
        }else{
          this.errors.push(this.$t('msg.finalize.WrongSlatepack'))
        }
      }
    },

    send(){
      let tx_id
      this.status = 'sending'

      let fn = this.$walletService.createSlatepackFile(this.slatepack)

      let finalize = async function(){
        let gnode = grinNode
        let localGnodeStatus = this.$dbService.getLocalGnodeStatus()
        this.$log.debug('check grin local status before finalize: ' + localGnodeStatus)
        if(localGnodeStatus == 'running'){
          gnode = grinLocalNode
        }
        this.$log.debug('finalize use grin node:' + gnode)
        await new Promise(r => setTimeout(r, 1000))
        try{
          let res = await this.$walletService.finalizeByCli(fn, gnode)
          this.status = 'sent'
          if(tx_id)this.$dbService.addPostedUnconfirmedTx(tx_id)
          this.$log.debug(`finalize tx ${tx_id} ok; return:${res}`)
        }catch(error){
          this.$log.error('finalize or post error:' + error)        
          this.errors.push(this.$t('msg.finalize.TxFailed'))

          await new Promise(r => setTimeout(r, 4000))

          this.status = 'toSend'
        }finally{
          messageBus.$emit('update')
        }
      }

      finalize.call(this)
    },

    send2(){
      let tx_id
      this.status = 'sending'

      let finalize = async function(){
        try{
          let res = await this.$walletServiceV3.getSlateFromSlatepackMessage(this.slatepack, [0])
          //this.$log.debug('getSlateFromSlatepackMessage return:', JSON.stringify(res))
          let slate = res.result.Ok
          
          res = await this.$walletServiceV3.finalizeTransaction(slate)
          //this.$log.debug('finalizeTransaction return res: ' + JSON.stringify(res))
          let slate2 = res.result.Ok
          
          res = await this.$walletServiceV3.postTransaction(slate2, true)
          //this.$log.debug('postTransaction return res: ' + JSON.stringify(res))

          this.status = 'sent'
          tx_id = slate2.id
          if(tx_id)this.$dbService.addPostedUnconfirmedTx(tx_id)
          this.$log.debug(`finalize tx ${tx_id} ok; return:${res}`)
        }catch(error){
          this.$log.error('finalize or post error:' + error)        
          this.errors.push(this.$t('msg.finalize.TxFailed'))

          await new Promise(r => setTimeout(r, 4000))

          this.status = 'toSend'
        }finally{
          messageBus.$emit('update')
        }
      }

      finalize.call(this)
    },
   
    clearup(){
      this.errors = []
      this.status = 'toSend'
      this.slatepack = null
    },
    fileTypeIsSupported(file){
      return true
      if( !file.type || file.type.search('text')!=-1 ||	file.type.search('json')!=-1){
        return true
      }else{
        return false
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
