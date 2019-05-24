<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:480px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.send") }}(HTTP/HTTPS)</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
      
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors">{{ error }}</p>
      </div>
      <div v-if="!sent">
        <div class="field">
          <label class="label">{{ $t("msg.httpSend.address") }}(HTTP/HTTPS)</label>
          <div class="control">
            <input class="input" type="text" v-model="address" placeholder="eg: https://donation.niffler.org:3415">
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t("msg.httpSend.sendAmount") }}</label>
          <div class="control">
            <input class="input" type="text" v-model="amount" placeholder="1 ツ">
          </div>
        </div>

        <div class="field">
        <label class="label">{{ $t("msg.httpSend.salteVersion") }}</label>

          <div class="control">
            <div class="select">
              <select v-model="slateVersion">
                <option>0</option>
                <option>1</option>
                <option>2</option>
              </select>
            </div>
          </div>
          <p class="help"> {{ $t("msg.httpSend.salteVersionHelp") }}</p>

        </div>

        <br/>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" v-bind:class="{'is-loading':sending}" @click="send">{{ $t("msg.send") }}</button>
          </div>
          <div class="control">
            <button class="button is-text" @click="closeModal">{{ $t("msg.cancel") }}</button>
          </div>
        </div>
      </div>
      <div v-else class="notification is-link" >
        <p>{{ $t("msg.httpSend.success") }}</p>
      </div>
    </section>
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
const fs = require('fs');

export default {
  name: "http-send",
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
      address: '',
      slateVersion: 0,
      sending: false,
      sent: false
    }
  },
  watch: {
      errors:function(newVal, oldVal){
        if(newVal.length > 0){
          setTimeout(()=>this.errors = [], 
          4*1000)
        }
      },
      sent:function(newVal, oldVal){
       if(newVal){
         setTimeout(()=>this.closeModal(), 
          4*1000)
       } 
      }
  },
  methods: {
    validAddress(address) {
      let re = new RegExp('^(https?:\\/\\/)'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); 
      return re.test(address);
    },
    validAmount(amount) {
      if(parseFloat(amount) <= 0)return fasle
      let re = /^\d+\.?\d*$/;
      return re.test(amount);
    },
    enough(amount){
      let spendable = this.$dbService.getSpendable()
      if(spendable){
        return spendable > parseFloat(amount) + 0.01 //0.008
      }
      return true
    },
    checkForm(){
      this.errors = []
      if (!this.address || !this.validAddress(this.address)) {
        this.errors.push(this.$t('msg.httpSend.WrongAddress'));
      }
      if (!this.amount || !this.validAmount(this.amount)) {
        this.errors.push(this.$t('msg.httpSend.WrongAmount'));
      }
      if (!this.enough(this.amount)) {
        this.errors.push(this.$t('msg.httpSend.NotEnough'));
      }
      if (!this.errors.length) {
        return true;
      }
    },
    send(){
      if(this.checkForm()&&!this.sending){
        let tx_id
        this.sending = true
        let tx_data = {
          "amount": this.amount * 1000000000, 
          "minimum_confirmations": 10,
          "method": "http",
          "dest": this.address,
          "max_outputs": 500,
          "num_change_outputs": 1,
          "selection_strategy_is_use_all": true,
          "target_slate_version": parseInt(this.slateVersion)
        }
        
        let send = async function(){
          try{
            let res = await this.$walletService.issueSendTransaction(tx_data)
            this.$log.debug(`issue tx ${tx_id} ok; return:${res.data}`)
            tx_id = res.data.id
            let res2 = await this.$walletService.postTransaction(res.data, true)
            this.sent = true
            this.$dbService.addPostedUnconfirmedTx(tx_id)
            this.$log.debug(`httpsend post tx ok; return:${res2.data}`)
          }catch(error){
            this.$log.error('http send error:' + error)   
            if (error.response) {   
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
            this.errors.push(this.$t('msg.httpSend.TxFailed'))
          }finally{
            this.sending = false
            messageBus.$emit('update')
          }
        }
        send.call(this)
      }
    },
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowHttpSend');
    },
    
    clearup(){
      this.errors = []
      this.amount = null
      this.address = ''
      this.sending = false
      this.sent = false
      this.slateVersion = 0
    },
    
  }
}
</script>
<style>
</style>
