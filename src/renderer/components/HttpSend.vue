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

        <br/>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" v-bind:class="{'is-loading':sending}" @click="send3">{{ $t("msg.send") }}</button>
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
const urllib = require('urllib');
const fs = require('fs');
const urljoin = require('url-join');
import { constants } from 'fs';

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
      if(parseFloat(amount) <= 0)return false
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
      if (this.validAmount(this.amount) && !this.enough(this.amount)) {
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
            tx_id = res.data.id
            this.$log.debug(`issue tx ${tx_id} ok; return:${res.data}`)
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
    send2(){
      if(this.$walletService.passwordUndefined()){
        this.$log.debug('Use send1.')
        return this.send()
      }
      if(this.checkForm()&&!this.sending){
        let tx_id
        this.sending = true
        let send2Async = async function(){
          try{
            const slate = await this.$walletService.createSlate(this.amount, 1)
            tx_id = slate.id
            if(!tx_id){
              this.errors.push(this.$t('msg.httpSend.TxCreateFailed'))
            }else{
              let url = urljoin(this.address, '/v1/wallet/foreign/receive_tx')
              this.$log.debug('http send to: ' + url)
              const res = await urllib.request(url, {
                method: 'post',
                //contentType: "application/json",
                contentType: '',
                dataType: 'json',
                timeout: '10s',
                content: JSON.stringify(slate),
                //data:JSON.stringify(slate),
                //headers: {
                //   'User-Agent': 'grin-client',
                //'transfer-encoding': ''
                //},
              });
              if (res && res.data && res.data.id === tx_id) {
                this.$log.debug(`post transaction ok, start to finalize transaction ${tx_id}`);
                let result = await this.$walletService.finalizeSlate(res.data)
                this.sent = true
                this.$dbService.addPostedUnconfirmedTx(tx_id)
                this.$log.debug(`httpsend post tx ok; return:${JSON.stringify(result)}`)
              }else{
                this.$log.debug('post transaction return bad response: ' + JSON.stringify(res))
                this.errors.push(this.$t('msg.httpSend.TxResponseFailed'))
              }
            }
          }catch(error){
            this.$log.error('http send error:' + error)  
            this.$log.error(error.stack)
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
        send2Async.call(this)
      }
    },

    send3(){
      if(this.checkForm()&&!this.sending){
        let tx_id
        this.sending = true

        let tx_data = {
          "amount": this.amount * 1000000000, 
          "minimum_confirmations": 10,
          "max_outputs": 500,
          "num_change_outputs": 1,
          "selection_strategy_is_use_all": true,
          "method": "http",
          "dest": this.address,
        }

        let send3Async = async function(){
          try{
            let res = await this.$walletService.issueSendTransaction2(tx_data)
            let slate = res.data.result.Ok
            tx_id = slate.id
            if(!tx_id){
              this.errors.push(this.$t('msg.httpSend.TxCreateFailed'))
            }else{
              this.$log.debug('Generate slate file: ' + tx_id)

              let url = urljoin(this.address, '/v2/foreign')
              const payload = {
                jsonrpc: "2.0",
                id: +new Date(),
                method: 'receive_tx',
                params: [slate, null, null],
              }
              const res = await urllib.request(url, {
                method: 'post',
                contentType: "application/json",
                dataType: 'json',
                timeout: '10s',
                //data: payload,
                content: JSON.stringify(payload)
              });
              let slate2 = res.data.result.Ok
              if(slate2){
                this.$log.debug('Got slate2 file from receiver')

                let res = await this.$walletService.lock_outputs(slate, 0)
                this.$log.debug('output locked.')

                res = await this.$walletService.finalizeTransaction2(slate2)
                let tx = res.data.result.Ok.tx
                this.$log.debug('finalized.')

                res = await this.$walletService.postTransaction2(tx, true)
                this.$log.debug('posted.')

                this.sent = true
                this.$dbService.addPostedUnconfirmedTx(tx_id)
              }
            }
              
          }catch(error){
            this.$log.error('http send error:' + error)  
            this.$log.error(error.stack)
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
        send3Async.call(this)
      }

    },
    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowHttpSend');
    },
    
    clearup(){
      this.errors = []
      this.amount = null
      this.address = '',
      this.sending = false
      this.sent = false
      this.slateVersion = 0
    },
    
  }
}
</script>
<style>
</style>
