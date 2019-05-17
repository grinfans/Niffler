<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div class="column is-10" >
            
            <h1 class="title">{{ $t('msg.restore.title') }}</h1>
            <p class="animated bounce has-text-weight-semibold has-text-warning" 
               style="animation-iteration-count:2;margin-bottom:12px">
              请一个个地输入助记词
            </p>
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="text" placeholder="助记词" v-model="currentSeed"  v-on:keyup.enter="add">
              </div>

              <div class="control">
                <a class="button is-warning" @click="add">添加</a>
              </div>
            </div>
            <p class="help is-warning" v-show="currentSeedInvalid">助记词无效</p>
            <button class="button is-link is-inverted is-outlined is-small" @click="delete_">删除</button>
            <button class="button is-link is-inverted is-outlined is-small" @click="back">{{ $t("msg.back") }}</button>

            <br/>
            <br/>
            <div class="tags are-medium">
              <span class="tag" v-for="seed in seeds">{{seed}}</span>
            </div>

            <a class="button is-link is-inverted is-outlined" v-show="enoughSeeds">助记词输入完成, 恢复钱包</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { messageBus } from '@/messagebus'
const { exec } = require('child_process')

export default {
  name: "restore",
  data() {
    return {
      currentSeed: '',
      currentSeedInvalid: false,
      enoughSeeds: false,
      seeds: []
    }
  },
  created(){
    messageBus.$on('walletRestored', (seed)=>{
     
    })
    messageBus.$on('walletRestoreFailed', (err)=>{
      
    })
  },
  watch: {
    seeds:function(newVal, oldVal){
      if(newVal.length == 24){
        this.enoughSeeds = true
      }else{
        this.enoughSeeds = false
      }
    }
  },
  methods: {
    
    validSeed(seed) {
      let re = /^[A-Za-z]+$/
      return re.test(seed)
    },
    add(){
      if(this.enoughSeeds)return
      let seed = this.currentSeed.trim()
      if(seed === '' || !this.validSeed(seed) ){
        return this.currentSeedInvalid = true
      }else{
        this.currentSeedInvalid = false
        this.seeds.push(seed)
        this.currentSeed = ''
      }
    },
    delete_(){
      if(this.seeds.length>0)this.seeds.pop()
    },
    clearup(){
      this.enoughSeeds = false
      this.currentSeed = ''
      this.currentSeedInvalid = false
      this.seeds = []
    },
    back(){
      this.clearup()
      messageBus.$emit('backToNew')
    }
  }
}
</script>

<style>

</style>
