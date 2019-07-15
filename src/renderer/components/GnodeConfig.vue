<template>
<div class="field">
    <p class="tag is-warning">普通用户推荐使用默认值 !</p>
    
    <label class="label" style="color:#22509a;margin-top:17.5px">节点:</label>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <span style="font-size:0.88rem">本地节点</span>:
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input is-small" type="text" v-model="localAddr">
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <span style="font-size:0.88rem">远程节点</span>:
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input is-small" type="text" v-model="remoteAddr">
                </div>
            </div>
        </div>
    </div>               
    <label class="label" style="color:#22509a; margin-top:17.5px">节点连接方式:</label>
    <div class="control" style="font-size:0.8rem">
      <label class="radio">
            <input type="radio" value="remoteFirst" v-model="connectMethod">&nbsp;(推荐)优先使用远程. 当远程节点不可用, 使用本地节点
        </label>
        <br/>
        <label class="radio">
            <input type="radio" value="localFirst" v-model="connectMethod">&nbsp;当本地节点同步完成时优先连接本地, 否则使用远程
        </label>
        <br/>
        <label class="radio">
            <input type="radio" value="remoteAllTime" v-model="connectMethod">&nbsp;始终连接远程节点
        </label>
        <br/>
        <label class="radio">
            <input type="radio" value="localAllTime" v-model="connectMethod">&nbsp;始终连接本地节点
        </label>
    </div>
    <label class="label" style="color:#22509a; margin-top:17.5px">其他:</label>
    <label class="checkbox" style="font-size:0.88rem">
    <input type="checkbox" v-model="background">
    (推荐)钱包退出后，本地节点后台运行
    </label>
    <br/><br/>
    <a class="button is-link is-small" @click="save">保存</a>
    <a class="button is-text is-small" @click="restore">恢复默认值</a>

    <message :showMsg="openMsg" v-on:close="closeConfig" 
    v-bind:msg=msg v-bind:showTime="5" msgType="link">
    </message>

</div>
</template>

<script>
import {gnodeOption, defaultGnodeOptions, setConfig} from '../../shared/config'
import Message from '@/components/Message'

export default {
  name: "gnodeConfig",
  
  components: {
      Message
  },

  data() {
    return{
      useLocalGnode: gnodeOption.useLocalGnode,
      localAddr: gnodeOption.localAddr,
      remoteAddr: gnodeOption.remoteAddr,
      connectMethod: gnodeOption.connectMethod,
      background: gnodeOption.background,
      openMsg:false,
      msg:'设置已经保存, 重启钱包后生效.'
    }
  },
  methods: {
    save(){
      let options = {
        'connectMethod': this.connectMethod,
        'remoteAddr': this.remoteAddr,
        'localAddr': this.localAddr,
        'background': this.background,
        'useLocalGnode': true
      }
      setConfig({'gnode': options})
      this.openMsg = true
    },
    restore(){
      this.localAddr = defaultGnodeOptions.localAddr
      this.remoteAddr = defaultGnodeOptions.remoteAddr
      this.connectMethod = defaultGnodeOptions.connectMethod
      this.background = defaultGnodeOptions.background
      setConfig({'gnode': defaultGnodeOptions})
    },
    closeConfig(){
      this.openMsg = false
      this.$emit('close')
    }
  }
}
</script>
<style>
</style>
