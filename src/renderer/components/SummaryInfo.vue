<template>
  <div class="notification is-link" style="width:260px;">
    <p class="subtitle is-5">{{ $t("msg.info.spendable") }}:</p>
    <p class="title is-2">{{spendable}} ツ</p>
    <p>{{ $t("msg.info.total") }}: {{total}} ツ</p> 
    <p>{{ $t("msg.unconfirmed") }}: {{unconfirmed}} ツ</p>
    <p>{{ $t("msg.locked") }}: {{locked}} ツ</p>
  </div>
</template>

<script>
  import { messageBus } from '@/messagebus'

  export default {
    name: 'summary-info',
    data(){
      return {
        spendable: 0,
        total: 0,
        unconfirmed: 0,
        locked: 0
      }
    },

    mounted () {
      this.getSummaryinfo()
    },
    created () {
      messageBus.$on('update', ()=>this.getSummaryinfo())
    },
    methods: {
      getSummaryinfo: function() {
        this.$walletService.getSummaryInfo(10)
          .then( (res) => {
            this.spendable = res.data[1]['amount_currently_spendable']/1000000000
            this.total = res.data[1]['total']/1000000000
            this.unconfirmed = res.data[1]['amount_awaiting_confirmation']/1000000000
            this.locked = res.data[1]['amount_locked']/1000000000
            this.$dbService.setSpendable(this.spendable)
            }
          ).catch((error) => {
            this.$log.error('getSummaryinfo error:' + error)
            if (error.response) {   
              let resp = error.response      
              this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
            }
          })        
      }
    }
  }
</script>

<style>
</style>
