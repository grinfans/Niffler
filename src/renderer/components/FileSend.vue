<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:520px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.fileSend.slatepack") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:450px;background-color: whitesmoke;">
      
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors" :key="error.id" >{{ error }}</p>
      </div>

      <div v-if="slatepack">
        <p class="animated bounce has-text-link has-text-weight-semibold is-size-5" style="animation-iteration-count:3">
          {{ $t("msg.fileSend.slatepackCreated") }}
        </p>

        <p v-if="slatepackAddress" class="help is-success" style="margin-bottom:5px">{{ $t("msg.fileSend.slatepackEncryptedTips") }}</p>
        <p v-else class="help is-warning" style="margin-bottom:5px">{{ $t("msg.fileSend.slatepackUnEncryptedTips") }}</p>

        <div id="slatepack_box">
          <div style="padding:10px">
            <p v-for="line in slatepackToDispaly" :key="line.id" class="is-family-monospace is-size-7 has-text-link">
              {{line}}
            </p>
          </div>
        </div>
        <br/>
        <div class="field is-grouped">
          <div class="control">
            <button v-if="copied" class="button is-success is-small">{{ $t("msg.fileSend.copied") }}</button>

            <button v-else class="button is-link is-small" @click="copy">{{ $t("msg.fileSend.copySlatepack") }}</button>
          </div>
          <div class="control">
            <button class="button is-link is-small" @click="save">{{ $t("msg.fileSend.fileSlatepack") }}</button>
          </div>
          <div class="control">
            <button class="button is-small is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
          </div>
        </div>

      </div>

      <div v-else>
        <br/>
        <div class="field">
          <label class="label">{{ $t("msg.fileSend.slatepackAddress") }} ({{ $t('msg.optional') }})</label>
          <p class="help is-link" style="margin-bottom:3px">{{ $t("msg.fileSend.slatepackAddressTips") }}</p>
          <div class="control">
            <input class="input" type="text" v-model="slatepackAddress">
          </div>
        </div>
        <br/>
        <div class="field">
          <label class="label">{{ $t("msg.fileSend.sendAmount") }}</label>
          <div class="control">
            <input class="input" type="text" v-model="amount">
          </div>
        </div>
        <br/>
        <br/>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-small is-link" v-bind:class="{'is-loading':creating}" @click="send">{{ $t("msg.fileSend.createTxFile") }}</button>
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
const clipboard = require('electron').clipboard
const fs = require('fs');

export default {
  name: "file-send",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errors: [],
      amount: null,
      slatepack: null,
      slatepackAddress: null,
      creating: false,
      copied: false
    }
  },
  watch: {
    errors:function(newVal, oldVal){
      if(newVal.length > 0){
        setTimeout(()=>this.errors = [], 
        6*1000)
      }
    },
    copied:function(newVal, oldVal){
      if(newVal){
        setTimeout(()=>this.copied = false, 
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
        result.push(end)
        return result
      }else{
        return null
      }
    }
  },

  methods: {
    validAmount(amount) {
      if(parseFloat(amount) <= 0)return fasle
      let re = /^\d+\.?\d*$/;
      return re.test(amount);
    },
    validAddress(address) {
      if(!address.startsWith('grin'))return false
      if(address.length !== 63)return false
      return true
    },
    checkForm(){
      if(this.amount)this.amount = this.amount.trim()
      if(this.slatepackAddress)this.slatepackAddress = this.slatepackAddress.trim()

      this.errors = []
      if (!this.amount || !this.validAmount(this.amount)) {
        this.errors.push(this.$t('msg.fileSend.WrongAmount'));
      }
      if (this.amount && this.validAmount(this.amount) && !this.enough(this.amount)) {
        this.errors.push(this.$t('msg.fileSend.NotEnough'));
      }
      if(this.slatepackAddress)console.log(this.validAddress(this.slatepackAddress))
      if (this.slatepackAddress && !this.validAddress(this.slatepackAddress)) {
        this.errors.push(this.$t('msg.fileSend.WrongSlatepackAddress'))
      }
      if (!this.errors.length) {
        return true;
      }
    },
    enough(amount){
      let spendable = this.$dbService.getSpendable()
      if(spendable){
        return spendable >= parseFloat(amount) + 0.01 //0.008
      }
      return false
    },
    async send(){
      if(this.checkForm()){
        this.creating = true

        let tx_data = {
          "src_acct_name": null,
          "amount": this.amount * 1000000000, 
          "minimum_confirmations": 10,
          "max_outputs": 500,
          "num_change_outputs": 1,
          "selection_strategy_is_use_all": false,
          "target_slate_version": null,
          "payment_proof_recipient_address": this.slatepackAddress,
          "ttl_blocks": null,
          "send_args": null
        } 

        try {
          let res = await this.$walletServiceV3.issueSendTransaction(tx_data)
          let slate = res.result.Ok
          let recipients = []
          if(this.slatepackAddress){
            recipients = [this.slatepackAddress]
          }
          let res2 = await this.$walletServiceV3.createSlatepackMessage(slate, 0 , recipients)
          console.log('createSlatepackMessage return:', JSON.stringify(res2))
          this.slatepack = res2.result.Ok

          let res3 = await this.$walletServiceV3.lockOutputs(slate)
          console.log('ockOutputs return:', JSON.stringify(res3))
          
          messageBus.$emit('update', false)

        }catch(err){
          this.$log.error('file send got error:', err)
        }finally{
          this.creating = false
        }
      }  
    },

    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowFileSend');
    },
    
    clearup(){
      this.errors = []
      this.amount = null
      this.slatepackAddress = null
      this.slatepack = null
      this.creating = false
    },

    copy(){
      clipboard.writeText(this.slatepack)
      this.copied = true
    },

    save(){
      if(this.slatepack){
        let fn_output = this.$electron.remote.dialog.showSaveDialog({
          title: this.$t('msg.save'),
          message: this.$t('msg.fileSend.saveMsg'),
        })
        if(fn_output){
          fn_output = fn_output + '.slatepack'
          fs.writeFileSync(fn_output, this.slatepack)
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

</style>
