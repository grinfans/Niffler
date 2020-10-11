<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background" @click="closeModal"></div>
  <div class="modal-card" style="width:480px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.send") }} (HTTP/HTTPS)</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>
    <section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
      
      <div class="notification is-warning" v-if="errors.length">
        <p v-for="error in errors" :key="error.id">{{ error }}</p>
      </div>
      <div v-if="!sent">
        <div class="field">
          <label class="label">{{ $t("msg.httpSend.address") }} (HTTP/HTTPS)</label>
          <div class="control">
            <input class="input" type="text" v-model="address">
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t("msg.httpSend.sendAmount") }}</label>
          <div class="control">
            <input class="input" type="text" v-model="amount">
          </div>
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
    <message :showMsg="openMsg" v-on:close="closeMsg" 
      v-bind:msg=msg v-bind:showTime="5" msgType="link">
    </message>
  </div>
</div>

</template>
<script>
import Message from '@/components/Message'
import { messageBus } from '@/messagebus'
//const urllib = require('urllib');
const axios = require('axios')
const fs = require('fs');
const urljoin = require('url-join');
import { constants } from 'fs';
import {execPromise} from '../../shared/utils'

export default {
  name: "http-send",
  components: {
      Message
  },
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
      sent: false,
      msg: this.$t('msg.httpSend.noTor'),
      openMsg:false
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
        return spendable >= parseFloat(amount) + 0.01 //0.008
      }
      return false
    },
    checkForm(){
      this.errors = []
      this.address = this.address.trim()
      this.amount = this.amount.trim()
      if (!this.address || !this.validAddress(this.address)) {
        if(!this.checkIfTor(this.address)){
          this.errors.push(this.$t('msg.httpSend.WrongAddress'))
        }
      }
      if (!this.amount || !this.validAmount(this.amount)) {
        this.errors.push(this.$t('msg.httpSend.WrongAmount'));
      }
      if (this.amount && this.validAmount(this.amount) && !this.enough(this.amount)) {
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
          "src_acct_name": null,
          "amount": this.amount * 1000000000, 
          "minimum_confirmations": 10,
          "max_outputs": 500,
          "num_change_outputs": 1,
          "selection_strategy_is_use_all": false,
          "target_slate_version": null,
          "payment_proof_recipient_address": null,
          "ttl_blocks": null,
          "send_args": null
        }

        let sendAsync = async function(){
          try{
            let res = await this.$walletServiceV3.issueSendTransaction(tx_data)
            //this.$log.debug('issueSendTransaction return: '+ JSON.stringify(res))
            let slate = res.result.Ok
            tx_id = slate.id
            if(!tx_id){
              this.errors.push(this.$t('msg.httpSend.TxCreateFailed'))
            }else{
              this.$log.debug('Generate slate file: ' + tx_id)

              let res = await this.$walletServiceV3.createSlatepackMessage(slate, 0, [])
              //this.$log.debug('createSlatepackMessage return: '+ JSON.stringify(res))
              let slatepack = res.result.Ok

              let url = urljoin(this.address, '/v2/foreign')
              const payload = {
                jsonrpc: "2.0",
                id: +new Date(),
                method: 'receive_tx',
                params: [slate, null, null],
              }
              res = await axios.post(url, payload)
              //console.log('payload', JSON.stringify(payload))
              //res = await urllib.request(url, {
              //  method: 'post',
              //  contentType: "application/json",
              //  dataType: 'json',
              //  timeout: '25s',
              //  content: JSON.stringify(payload)
              //});
              //this.$log.debug('post slate return res: ' + JSON.stringify(res))
              let slate2 = res.data.result.Ok
              if(slate2){
                this.$log.debug('Got slate2 file from receiver')

                let res = await this.$walletServiceV3.lockOutputs(slate)
                //this.$log.debug('lockOutputs return res: ' + JSON.stringify(res))
                this.$log.debug('output locked.')

                res = await this.$walletServiceV3.finalizeTransaction(slate2)
                //this.$log.debug('finalizeTransaction return res: ' + JSON.stringify(res))

                let slate3 = res.result.Ok
                this.$log.debug('finalized.')

                res = await this.$walletServiceV3.postTransaction(slate3, true)
                //this.$log.debug('postTransaction return res: ' + JSON.stringify(res))
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
            messageBus.$emit('update', true)
          }
        }
        sendAsync.call(this)
      }
    },
    checkIfTor(address){
      if (address.indexOf('_') !== -1){return false}
      let re = new RegExp('^\\w{50,60}$')
      return re.test(address)
    },
    send2(){
      this.address = this.address.trim()

      if(this.checkForm()&&!this.sending){
        if(this.checkIfTor(this.address)){
          console.log('it is a tor address')
          return this.sendViaTor()
        }

        let tx_id
        this.sending = true
        let tx_data = {
          "src_acct_name": null,
          "amount": this.amount * 1000000000, 
          "minimum_confirmations": 10,
          "max_outputs": 500,
          "num_change_outputs": 1,
          "selection_strategy_is_use_all": false,
          "target_slate_version": null,
          "payment_proof_recipient_address": null,
          "ttl_blocks": null,
          "send_args": {
            "dest": this.address,
            "post_tx": true,
            "fluff": true,
            "skip_tor":true
          }
        }

        this.$walletServiceV3.issueSendTransaction(tx_data).then(
          (res) => {
            //this.$log.debug('send2 issueSendTransaction return: '+ JSON.stringify(res))
            let slate = res.result.Ok
            tx_id = slate.id
            this.sent = true
            this.$dbService.addPostedUnconfirmedTx(tx_id)
          }).catch((error) => {
            this.$log.error('http send2 error:' + error)  
            this.$log.error(error.stack)
            if (error.response) {   
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
            this.errors.push(this.$t('msg.httpSend.TxFailed'))
          }).finally(()=>{
            this.sending = false
            messageBus.$emit('update', true)
          })
        }
    },
    sendViaTor(){
      console.log(this.$dbService.getTorRunning())
      if(!this.$dbService.getTorRunning()){
        this.openMsg = true
        return
      }
      let tx_id 
      this.sending = true

      let tx_data = {
          "src_acct_name": null,
          "amount": this.amount * 1000000000, 
          "minimum_confirmations": 10,
          "max_outputs": 500,
          "num_change_outputs": 1,
          "selection_strategy_is_use_all": true,
          "message": null,
          "target_slate_version": null,
          "payment_proof_recipient_address": null,
          "ttl_blocks": null,
          "send_args": null
        }

        let sendAsync = async function(){
          try{
            let res = await this.$walletService.issueSendTransaction(tx_data)
            let slate = res.data.result.Ok
            tx_id = slate.id
            if(!tx_id){
              this.errors.push(this.$t('msg.httpSend.TxCreateFailed'))
            }else{
              this.$log.debug('Generate slate file: ' + tx_id)
              let payload = {
                "jsonrpc": "2.0",
                "method": "receive_tx",
                "id": 1,
                "params":[slate, null, null]
              }
              payload = JSON.stringify(payload)
              const url = `http://${this.address}.onion/v2/foreign`
              const cmd = `curl --socks5-hostname 127.0.0.1:19050 -X POST -d '${payload}' ${url}`
              //console.log(cmd)
              const res = await execPromise(cmd)
              //this.$log.debug('post slate return res: ' + res)
              let slate2 = JSON.parse(res).result.Ok
              //console.log(slate2)
              if(slate2){
                this.$log.debug('Got slate2 file from receiver')

                let res = await this.$walletService.lock_outputs(slate, 0)
                this.$log.debug('output locked.')

                res = await this.$walletService.finalizeTransaction(slate2)
                //console.log(JSON.stringify(res))
                let tx = res.data.result.Ok.tx
                this.$log.debug('finalized.')

                res = await this.$walletService.postTransaction(tx, true)
                console.log(JSON.stringify(res))
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
            messageBus.$emit('update', true)
          }
        }
        sendAsync.call(this)
    },

    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowHttpSend');
    },
    closeMsg(){
      this.openMsg = false
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
