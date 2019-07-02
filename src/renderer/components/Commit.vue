<template>
  <div class="card" >
    <div class="card-content">
     
      <div class="level">
        <div class="level-left">
          <h2 class="title is-4 level-item">
            {{ $t("msg.commit.unspentCmt") }}
          </h2>
        </div>

        <div class="level-right">
          <form v-on:submit.prevent="search" class="level-item">
            <div class="field has-addons">
              <p class="control">
                <input class="input is-link is-small" type="text" placeholder="" v-model="keyword" @keyup.enter="search" v-bind:disabled="searched">
              </p>
              <p class="control">
                <button class="button is-link is-small is-outlined" @click="search" v-show="!searched">{{ $t("msg.search") }}</button>
                <button class="button is-link is-small is-outlined" @click="clearup" v-show="searched">{{ $t("msg.clearup") }}</button>
              </p>
            </div>
          </form>
        </div>

      </div>

      <div v-for="(ct, index) in current_commits" :key="ct.id" style="margin-top: 20px">
        <div class="level">
          <div class="level-left">
            <div>
              <p class="title is-6 is-marginless" @mouseover="(event)=>mouseover(index)" @mouseleave="mouseLeave" >
                <span v-if="ct.status=='Unconfirmed'" >{{ct.commit| truncate(35)}}</span>
                <a v-else @click="open(`https://grin-fans.org/commit/${ct.commit}`)">{{ct.commit| truncate(35)}}</a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="showCopy===index" @click="copy(index)">
                  <icon name="copy" scale="0.85" ></icon>
                </span>
                <span v-if="copied===index">
                  <span class="tag is-black" style="font-size:0.7rem">{{ $t("msg.commit.copied") }}</span>
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;

              </p>
              <small>{{ $t("msg.commit.heightCreated") }}: 
                <span  v-if="ct.status=='Unconfirmed'">{{ct.height}}</span>
                <a v-else @click="open(`https://grin-fans.org/block/${ct.height}`)">{{ct.height}}</a>
              </small>
            </div>
          </div>
          <div class="level-right">
            <div class="has-text-right">
              <p class="title is-6 is-marginless">
                {{ ct.value/1000000000 }} ツ
              </p>
              <span v-if="ct.status=='Unspent'" class="tag is-link">{{ $t("msg.commit.unspent") }}</span>
              <span v-if="ct.status=='toUnspent'" class="tag is-warning">({{ct.confirmed_count+'/10'}}) {{ $t("msg.unconfirmed") }} </span>
              <span v-if="ct.status=='Unconfirmed'" class="tag is-warning">{{ $t("msg.unconfirmed") }}</span>
              <span v-if="ct.status=='Locked'" class="tag is-warning">{{ $t("msg.locked") }}</span>
              <span v-if="ct.status=='Spent'" class="tag is-warning">{{ $t("msg.commit.spent") }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <br/>
      <br/>

      <div v-if="pages_count>1 && !searched" class="level">
        <div class="level-left">
        </div>
        <div class="level-right">

        <button v-if="current_page_index>1" class="button is-outlined is-link is-small level-item" @click="prev">
          <span class="is-size-7">&lt;</span>
        </button>
        <span class="level-item" style="vertical-align:bottom;">{{current_page_index}}/{{pages_count}}</span>
        <button v-if="current_page_index<pages_count" class="button is-outlined is-link is-small level-item" @click="next">
          <span class="is-size-7">&gt;</span>
        </button>
        &nbsp;&nbsp;
        <input v-model="jump_to" @keyup.enter="jump" class="input is-link is-small level-item" placeholder="2" style="width:30px">
        <button class="button is-link is-small is-outlined level-item">
          <span class="is-size-7" @click="jump">{{ $t("msg.jump") }}</span>
        </button>
        </div>
      </div>

      <p v-if="searched && current_commits.length == 0"> {{ $t("msg.commit.noCmtFound") }}</p>
      <p v-if="current_commits.length == 0 && !searched"> {{ $t("msg.commit.noCmt") }}</p>
    </div>
  </div>
</template>

<script>
  import { messageBus } from '@/messagebus'
  const clipboard = require('electron').clipboard

  export default {
    name: 'commit',
    props:{
      count_per_page:{
        type:Number
      },
      nodeHeight:{
        type:Number,
        default:function(){
          return 0
        }
      }
    },

    data() {
      return {
        current_commits: [],
        total_commits: [],
        current_page_index: 1,
        pages_count: 1,
        jump_to: 2,
        keyword: "",
        searched: false,
        showCopy: -1,
        copied: -1
      }
    },
    mounted () {
      this.getCommits()
    },
    
    created () {
      messageBus.$on('update', ()=>this.getCommits())
    },

    methods: {
      mouseover(index){
        if(this.copied===-1){
          this.showCopy = index
        }
      },
      mouseLeave(){
        this.showCopy = -1,
        this.copied =  -1
      },
      copy(index){
        let ct = this.current_commits[index]
        clipboard.writeText(ct.commit)
        this.copied = index
        this.showCopy = -1
      },
      
      getCommits() {
        this.$walletService.getCommits(false, true, null)
          .then((res) => {
            this.total_commits = this.processCommits(res.data.result.Ok[1].reverse())
           
            this.current_commits = this.total_commits.slice(0, this.count_per_page)
            if (this.total_commits.length%this.count_per_page ==0){
              this.pages_count = parseInt(this.total_commits.length/this.count_per_page)
            }else{
              this.pages_count = parseInt(this.total_commits.length/this.count_per_page) + 1
            }
          }
          ).catch((error) => {
            this.$log.error('getCommits error:' + error)
            if (error.response) {   
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
          })        
      },
      
      processCommits(cts){
        let nodeHeight = this.nodeHeight
        let cts_processed = cts.map(function(ct){
          let c = ct['output']
          if( c.status === 'Unspent' && nodeHeight>0){
            c.confirmed_count = nodeHeight - c.height + 1
            if(c.confirmed_count < 10){
              c.status = 'toUnspent'
            }
          }
          return c
        })
        return cts_processed
      },

      next(){
        this.current_page_index += 1
        let s = (this.current_page_index-1)*this.count_per_page
        this.current_commits = this.total_commits.slice(s, s+this.count_per_page)
      },
      prev(){
        this.current_page_index -= 1
        var s = (this.current_page_index-1)*this.count_per_page
        this.current_commits = this.total_commits.slice(s, s+this.count_per_page)
      },
      jump(){
        this.jump_to = parseInt(this.jump_to)
        
        if(isNaN(this.jump_to)) {
          this.jump_to = this.current_page_index
          return
        }
        
        if(this.jump_to > this.pages_count) this.jump_to = this.pages_count
        if(this.jump_to < 1) this.jump_to = 1
        this.current_page_index = this.jump_to
        let s = (this.current_page_index-1)*this.count_per_page
        this.current_commits = this.total_commits.slice(s, s+this.count_per_page)
      },

      search(){
        let keyword = this.keyword
        if(this.keyword){
          this.current_commits = this.total_commits.filter(function(ct){
            if(ct.commit.search(keyword) != -1){
              return ct
            }})
          this.searched = true
        }
      },
    
      clearup(){
        this.keyword = ""
        this.searched = false
        let s = (this.current_page_index-1)*this.count_per_page
        this.current_commits = this.total_commits.slice(s, s+this.count_per_page)
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
</style>
