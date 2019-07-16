<template>

<div class="modal" :class="{'is-active': showModal}">
  <div class="modal-background"></div>
  <div class="modal-card" style="width:500px">
    <header class="modal-card-head">
      <p class="modal-card-title is-size-4 has-text-link has-text-weight-semibold">{{ $t("msg.gnode.title") }}</p>
      <button class="delete" aria-label="close" @click="closeModal"></button>

    </header>
    <section class="modal-card-body" style="height:540px;background-color: whitesmoke;">
      
       <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="tabs">
                    <ul>
                        <li :class="[ tab === 'status' ? 'is-active' : '']"><a @click="tab='status'">{{ $t("msg.gnode.tabStatus") }}</a></li> 
                        <li :class="[ tab === 'peers' ? 'is-active' : '']"><a @click="tab='peers'">{{ $t("msg.gnode.tabPeers") }}</a></li>
                        <li :class="[ tab === 'log' ? 'is-active' : '']"><a @click="tab='log'">{{ $t("msg.gnode.tabLog") }}</a></li>
                        <li :class="[ tab === 'config' ? 'is-active' : '']"><a @click="tab='config'">{{ $t("msg.gnode.tabConfig") }}</a></li>
                    </ul>
                </div>
                <div class="tab-is-link">
                    <div v-if="tab ==='status'">
                      <p>状态&nbsp;: 
                        <span class="has-text-centered has-text-weight-semibold">{{getStatusDisplay()}}</span>
                      </p>
                      <div v-if="status!='toStart'">
                        <p>本地节点高度/(全网高度)&nbsp;: 
                          <span class="has-text-centered has-text-weight-semibold">{{localHeight}}/({{remoteHeight}})</span>
                        </p>
                        <br/>
                        <p>节点版本&nbsp;: 
                          <span class="has-text-centered has-text-weight-semibold">{{userAgent}}</span>
                        </p>
                        <p>协议版本&nbsp;: 
                          <span class="has-text-centered has-text-weight-semibold">{{protocolVersion}}</span>
                        </p>
                        <br/>
                        <p>已连接到周边Grin节点数量&nbsp;: 
                          <span class="has-text-centered has-text-weight-semibold">{{peers.length}}</span>
                        </p>
                        <br/>
                        <p>全节点区块数据存储的位置&nbsp;: </p>
                        <p><span class="has-text-centered has-text-weight-semibold">{{chainDataPath}}</span></p>
                        <br/>
                        <p v-if="chainDataSize != 0">全节点区块数据大小&nbsp;: 
                          <span class="has-text-centered has-text-weight-semibold">{{chainDataSize}}</span>
                        </p>

                        <br/>
                        <a class="button is-link" @click="restart">重启本地grin节点</a>
                      </div>
                    </div>
                    <div v-if="tab ==='peers'">
                      <p class="tag is-warning">已连接到周边Grin节点数量:{{peers.length}}</p>
                      <br/>
                      <br/>

                      <table v-if="peers.length > 0" class="table is-striped is-narrow is-hoverable" style="font-size:0.8rem;background-color: #f6f9fe;color: #22509a;">
                        <thead>
                          <th>No.</th>

                          <th>IP</th>
                          <th>节点</th>
                          <th>最新高度</th>
                        </thead>
                        <tbody>
                          <tr v-for="(peer, index) in peers" :key="peer.id">
                            <td>{{index+1}}</td>
                            <td>{{peer.addr}}</td>
                            <td>{{peer.user_agent}}</td>
                            <td>{{peer.height}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-if="tab ==='log'">
                        <p class="is-size-7" v-for="log in nodeLog" :key="log.id">{{ log }}</p>
                    </div>
                    <div v-if="tab ==='config'">
                      <GnodeConfig v-on:close="closeModal"></GnodeConfig>
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
import {gnodeOption, grinNodeLog, chainDataPath} from '../../shared/config'

import GnodeConfig from '@/components/GnodeConfig'

import { remote } from 'electron';
import { setTimeout } from 'timers';
const Tail = require('tail').Tail;
const getSize = require('get-folder-size');

export default {
  name: "gnode",
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  components: {
      GnodeConfig
  },
  data() {
    return {
      tab: 'status', //status, peers, log, config
      status: 'toStart',//'toStart','syncing','running'
      localHeight: -1,
      remoteHeight: -1,
      userAgent: '',
      protocolVersion: '',
      peers: [],
      nodeLog: [],
      chainDataPath: chainDataPath,
      chainDataSize: 0 
    }
  },
  watch: {
    status:function(newVal, oldVal){
      this.$dbService.setLocalGnodeStatus(newVal)
    }
  },
  created(){
    messageBus.$on('gnodeStarting',()=>{
      this.$log.debug('Got event gnodeStarting')
      setTimeout(()=>this.checkStarted(), 5000)
    })
  },
  mounted() {
    this.checkStarted()
    this.getChainDataSize()
    setTimeout(()=>{
      if(this.status == 'toStart'){
        this.checkStarted()
      }
    }, 10*1000)
  },
  methods: {
    checkStarted(){
      this.$gnodeService.getStatus().then((res)=>{
        this.checkStatus()
        this.getPeers()
        this.startTailLog(this.nodeLog)
        this.autoCheck(10 * 1000)
      }).catch((error)=>{
        this.status = 'toStart'
      })
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

    getPeers(){
      this.$gnodeService.getPeersConnected().then(
        (res)=>{
         this.peers = res.data
      }).catch(
        (error)=>{
          this.$log.debug('Failed to get peers: ' + error)
          }
      )
    },

    getChainDataSize(){
      getSize(chainDataPath, (err, size) => {
        if (err) { this.$log.error('Error when get size of chain data dir: ' + err)}
        this.chainDataSize = (size / 1024 / 1024).toFixed(2) + ' MB'
      })
    },

    startTailLog(log){
      let tail = new Tail(grinNodeLog)
      //console.log(grinNodeLog)
      tail.on("line", function(data) {
        //console.log(data)
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
        }, interval)
    },
    restart(){
      this.$gnodeService.restartGnode()
      this.status = 'toStart'
      this.nodeLog = []
    },
    closeModal() {
      messageBus.$emit('close', 'windowGnode');
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
