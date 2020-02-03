<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">Tor</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>
    </header>

    <section class="modal-card-body" style="height:400px;background-color: whitesmoke;">
      
       <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="tabs">
                    <ul>
                        <li :class="[ tab === 'status' ? 'is-active' : '']"><a @click="tab='status'">{{ $t("msg.tor.tabStatus") }}</a></li> 
                        <li :class="[ tab === 'log' ? 'is-active' : '']"><a @click="tab='log'">{{ $t("msg.tor.tabLog") }}</a></li>
                        <li :class="[ tab === 'config' ? 'is-active' : '']"><a @click="tab='config'">{{ $t("msg.tor.tabConfig") }}</a></li>
                    </ul>
                </div>
                <div class="tab-is-link">
                    <div v-if="tab ==='status'">
                      <p>{{ $t("msg.tor.status") }}&nbsp;: 
                        <span class="has-text-centered has-text-weight-semibold">{{getStatusDisplay()}}</span>
                      </p>
                      
                      <a class="button is-link" @click="restart">{{ $t("msg.tor.restart") }} </a>
                    </div>
                    <div v-if="tab ==='log'">
                        <p class="is-size-7" v-for="log in torLog" :key="log.id">{{ log }}</p>
                    </div>
                    <div v-if="tab ==='config'">
                    </div>
                    
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
import {torLogPath} from '../../shared/config'
const Tail = require('tail').Tail;

export default {
  name: "tor",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 'status', //status, log, config
      status: 'toStart',//'toStart','syncing','running'
      torAddress: '',
      torLog: [],
    }
  },
  watch: {
    status:function(newVal, oldVal){
    }
  },
  created(){
    
  },
  mounted() {
    this.checkStarted()
    setTimeout(()=>{
      if(this.status == 'toStart'){
        this.checkStarted()
      }
    }, 10*1000)
  },
  methods: {
    checkStarted(){
    },

    checkStatus(){
      let checkStatusAsync = async function(){
        try{
          let res = await this.$gnodeService.getStatus()
          this.localHeight = parseInt(res.data.tip.height)
          res = await this.$remoteGnodeService.getStatus()
          this.remoteHeight = parseInt(res.data.tip.height)
          this.userAgent = res.data.user_agent
          this.protocolVersion = res.data.protocol_version
          //console.log(`remote ${remoteHeight}; local ${this.localHeight}`)
        if( this.localHeight+10 > this.remoteHeight){
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


    startTailLog(log){
      let tail = new Tail(torLogPath, {'useWatchFile':true})
      //console.log(grinNodeLog)
      tail.on("line", function(data) {
        //console.log(data)
        if(log.length >= 30){log.shift()}
        log.push(data)
      });

      tail.on("error", function(error) {
        log.push('Error: ' + error)
      });
    },

    getStatusDisplay(){
      let s = {
        'running': this.$t('msg.gnode.statusRunning'),
        'syncing': this.$t('msg.gnode.statusSyncing'),
        'toStart': this.$t('msg.gnode.statusToStart')
      }
      return s[this.status]
    },

    autoCheck(interval){
        setInterval(()=>{
         this.checkStatus()
         this.getPeers()
         this.getChainDataSize()
        }, interval)
    },
    restart(){
      this.status = 'toStart'
      this.torLog = []
    },
    closeModal() {
      messageBus.$emit('close', 'windowTor');
    },
  }
}
</script>
<style scoped>
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
li.is-active{
  background-color: #3273dc;
  color: #fff;
  border-radius: 4px 4px 0 0;
}

.tabs li.is-active a{
  color: #fff;
}

.tab-is-link{
  background-color: #f6f9fe;
  border-radius: 4px;
  color: #22509a;
  padding: 1.5em 1.8em;
  margin-top: -1.5rem
}

.is-size-7{
  font-size: 0.95rem
}
</style>
