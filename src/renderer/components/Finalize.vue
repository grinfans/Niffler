<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:480px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.finalize.finalize") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:320px;background-color: whitesmoke;">
      
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors" :key="error.id">{{ error }}</p>
      </div>
      <div class="center">
        <a class="button is-link is-outlined" v-if="errors.length" @click="clearup">{{ $t("msg.clearup") }}</a>
      </div>

      <div class="notification is-link" v-show="isSent">
        {{ $t("msg.finalize.success") }}
      </div>
      <div class="center">
        <a class="button is-link is-outlined" v-show="isSent" @click="closeModal">
          {{ $t("msg.finalize.ok") }}
        </a>
      </div>

      <div v-show="isSending">
        <p class="is-size-5">{{ $t("msg.finalize.sending") }}</p>
        <br/>
        <progress class="progress is-link" max="100"></progress>
      </div>

      <div class="center" v-show="toDrag" id="filebox2" v-bind:class="{'drag-over':isDragOver}"
         @dragover.prevent="isDragOver=true" @dragleave.prevent="isDragOver=false" @drop.prevent="drop">
        <p class="is-size-5 has-text-link has-text-weight-semibold">{{ $t("msg.finalize.dropMsg") }}</p>
      </div>

    </section>
    
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
const fs = require('fs');

export default {
  name: "finalize",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errors: [],
      toDrag:true,
      isDragOver:false,
      isSent:false,
      isSending:false
    }
  },
  methods: {
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowFinalize');
    },

    drop(event){
      let fn = event.dataTransfer.files[0]
      this.toDrag = false

      if(this.fileTypeIsSupported(fn)){
        let tx_id
        let content
        
        try{
          content = fs.readFileSync(fn.path).toString();
          let data = JSON.parse(content)
          tx_id = data.id
          this.$log.debug('tx to finalize is ' + tx_id)
        }catch(e){
          this.$log.error('read tx file error:' + e)
          this.errors.push(this.$t('msg.finalize.WrongFileType'))
          return
        }

        this.isSending = true
        let send = async function(){
          try{
            let res = await this.$walletService.finalizeTransaction(JSON.parse(content))
            console.log(res)
            tx_id = res.data.result.Ok.id
            let tx = res.data.result.Ok.tx
            let res2 = await this.$walletService.postTransaction(tx, true)
            this.isSent = true
            this.$dbService.addPostedUnconfirmedTx(tx_id)
            this.$log.debug(`finalize tx ${tx_id} ok; return:${res.data}`)
            this.$log.debug(`post tx ok; return:${res2.data}`)
          }catch(error){
            this.$log.error('finalize or post error:' + error)   
            if (error.response) {   
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
            this.errors.push(this.$t('msg.finalize.TxFailed'))
          }finally{
            this.isSending = false
            messageBus.$emit('update')
          }
        }
        send.call(this)
        //let finalize = async function(){
        //  try{
        //    let res = await this.$walletService.finalize(fn.path)
        //    this.isSent = true
        //    if(tx_id)this.$dbService.addPostedUnconfirmedTx(tx_id)
        //    this.$log.debug(`finalize tx ${tx_id} ok; return:${res}`)
        //  }catch(error){
        //    this.$log.error('finalize or post error:' + error)        
        //    this.errors.push(this.$t('msg.finalize.TxFailed'))
        //  }finally{
        //    this.isSending = false
        //    messageBus.$emit('update')
        //  }
        //}
        //finalize.call(this)
      //}else{
        //this.errors.push(this.$t('msg.finalize.WrongFileType'))
      }
    },
    clearup(){
      this.errors = []
      this.toDrag = true
      this.isDragOver = false
      this.isSent = false
      this.isSending= false
    },
    fileTypeIsSupported(file){
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
#filebox2 {
  height:280px;
  border-style:dashed; 
  border-width:2px;
  color:#dbdbdb;/*#3273dc;*/
  background-color: white;

}

#filebox2.drag-over{
  border-color:#22509a;
  background-color:#f6f9fe;
}

.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
