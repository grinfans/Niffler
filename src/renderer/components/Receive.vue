<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:480px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.receive") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:320px;background-color: whitesmoke;">
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors">{{ error }}</p>
      </div>
      <div class="center">
        <a class="button is-link is-outlined" v-if="errors.length" @click="clearup">{{ $t("msg.clearup") }}</a>
      </div>

      <div class="center" v-show="toDrag" id="filebox" v-bind:class="{'drag-over':isDragOver}"
         @dragover.prevent="isDragOver=true" @dragleave.prevent="isDragOver=false" @drop.prevent="drop">
        <p class="is-size-5 has-text-link has-text-weight-semibold">{{ $t("msg.fileReceive.dropMsg") }}</p>
      </div>

    </section>
    
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
const fs = require('fs');
const path = require('path');

export default {
  name: "receive",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      toDrag:true,
      isDragOver:false,
      errors: [],
      //ip:''
    }
  },
  methods: {
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowReceive');
    },

    drop(event){
      let fn = event.dataTransfer.files[0]
      this.toDrag = false
      
      if(this.fileTypeIsSupported(fn)){
        let content
        
        try{
          content = fs.readFileSync(fn.path).toString();
          JSON.parse(content)
        }catch(e){
          this.$log.error('read tx file error:' + e)
          this.errors.push(this.$t('msg.fileReceive.WrongFileType'))
          return
        }

        let filePath = path.dirname(fn.path);

        let fn_output = this.$electron.remote.dialog.showSaveDialog({
          title: this.$t('msg.save'),
          message: this.$t('msg.fileReceive.saveMsg'),
          defaultPath: filePath
        })
        if(fn_output){
          this.$walletService.receiveTransaction(JSON.parse(content), null, null)
              .then( (res) => {
                console.log(res)
                let slate = res.data.result.Ok
                fs.writeFileSync(fn_output, JSON.stringify(slate))
                messageBus.$emit('update')
                this.closeModal()
                this.$log.debug(`Generated tx file ok; return ${res.data}`)
              }).catch((error) => {
                this.$log.error('receiveTransaction error:' + error)
                if (error.response) {   
                  let resp = error.response      
                  this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
                }
                let e1 = this.$t('msg.fileReceive.CreateFailed')
                this.errors.push(e1)
              })
        }else{
          this.errors.push(this.$t('msg.fileReceive.NoSavePlace'))
        }
      }
      else{
        this.errors.push(this.$t('msg.fileReceive.WrongFileType'))
      }
    },
    clearup(){
      this.errors = []
      this.toDrag = true
      this.isDragOver = false
    },
    fileTypeIsSupported(file){
      if( !file.type || file.type.search('text')!=-1 ||	 file.type.search('json')!=-1){
        return true
      }else{
        return false
      }
    },
  }
}
</script>
<style>
#filebox {
  height:280px;
  border-style:dashed; 
  border-width:2px;
  color:#dbdbdb;/*#3273dc;*/
  background-color: white;
}

#filebox.drag-over{
  border-color:#22509a;
  background-color:#f6f9fe;
}

.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
