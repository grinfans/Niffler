<template>
  <div class="modal" :class="{'is-active': showMsg}">
    <div class="modal-background"></div>
    <div class="modal-content" style="width:400px">
     <article class="message" v-bind:class="msgClass" >
      <div class="message-header">
        <p>{{ $t("msg.msg") }}</p>
        <button class="delete" aria-label="delete" @click="closeMsg"></button>
      </div>
      <div class="message-body">
        {{msg}}
      </div>
    </article>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'message',
    props:{
      showMsg: false,
      msg: String,
      msgType: String,
      showTime: {
        type: Number,
        default: -1
      }
    },
  
    computed: {
      msgClass: function(){
        if(this.msgType)
          return `is-${this.msgType}`
      }
    },
    watch: {
      showMsg: function(newVal, oldVal){
        if(newVal&&this.showTime > 0){
          setTimeout(()=>this.closeMsg(), 
          this.showTime*1000)
        }
      }
    },
    methods: {
      closeMsg() {
        this.$emit('close');
      }
    }
  }
</script>

<style>
</style>
