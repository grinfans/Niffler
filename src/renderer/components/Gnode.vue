<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.gnode.title") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>

    </header>
    <section class="modal-card-body" style="height:400px;background-color: whitesmoke;">
      
       <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="tabs">
                    <ul>
                        <li :class="[ tab === 'status' ? 'is-active' : '']"><a @click="tab='status'">{{ $t("msg.gnode.tab_status") }}</a></li> 
                        <li :class="[ tab === 'peers' ? 'is-active' : '']"><a @click="tab='peers'">{{ $t("msg.gnode.tab_peers") }}</a></li>
                        <li :class="[ tab === 'log' ? 'is-active' : '']"><a @click="tab='log'">{{ $t("msg.gnode.tab_log") }}</a></li>
                        <li :class="[ tab === 'config' ? 'is-active' : '']"><a @click="tab='config'">{{ $t("msg.gnode.tab_config") }}</a></li>
                    </ul>
                </div>
                <div class="box">
                    <div v-if="tab ==='status'">
                       <p>{{status}}</p>
                    </div>
                    <code v-if="tab ==='peers'">
                        file_get_contents();
                    </code>
                    <code v-if="tab ==='log'">
                        curl --retry 2 {}
                    </code>
                    <code v-if="tab ==='config'">
                        # using urllib2:
                        import urllib2
                        urllib2.urlopen("{}")
                    </code>
                </div>
            </div>
        </div>
    </div>
    </section>
  </div>
</div>

</template>
<script>
import { messageBus } from '@/messagebus'
import {gnodeOption} from '../../shared/config'

import Message from '@/components/Message'
import { remote } from 'electron';

export default {
  name: "gnode",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  components: {
      Message
  },
  data() {
    return {
      tab: 'status', //status, peers, log, config
      status: 'toStart'//'toStart','syncing','running'
    }
  },
  created(){
    messageBus.$on('gnodeStarting',()=>{
      console.log('Got gnodeStarting event')
      setTimeout(()=>this.checkStarted(), 5000)
      setTimeout(()=>this.checkStarted(), 10000)
    })
  },
  mounted() {
    this.checkStarted()
  },
  methods: {
    checkStarted(){
      this.$gnodeService.getStatus().then((res)=>{
        console.log(res.data)
        this.checkStatus()
        this.autoCheck(5 * 1000)
      }).catch((error)=>{
        console.log('error when checkStatus: ' + error)
        this.status = 'toStart'
      })
    },
    checkStatus(){
      let checkStatusAsync = async function(){
        try{
        let res = await this.$gnodeService.getStatus()
        let localHeight = parseInt(res.data.tip.height)
        console.log('localHeight: ' + localHeight)
        res = await this.$remoteGnodeService.getStatus()
        let remoteHeight = parseInt(res.data.tip.height)
        console.log('remoteHeight: ' + remoteHeight)
        if(localHeight+10>remoteHeight){
          this.status = 'running'
        }else{
          this.status = 'syncing'
        }}catch(error){
          console.log(error)
          this.status = 'toStart'
        }
      }
      checkStatusAsync.call(this)
     
    },

    autoCheck(interval){
        setInterval(()=>{
         this.checkStatus()
        }, interval)
    },

    closeModal() {
      this.clearup()
      messageBus.$emit('close', 'windowGnode');
    },
    
    clearup(){
      this.checking = false
      this.checked = false
      this.checkOutputs = []
      this.openStopMsg = false
      this.openCheckedMsg = false
    },
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
