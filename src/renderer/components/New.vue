<template>
  <section class="hero is-link is-fullheight" v-if="current==='new'">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div class="column is-6" >
            <img src="../assets/logo.png" style="width:64px" class="is-pulled-left">
            <h2 class="title" style="margin-top: 24px; margin-left:70px" >{{ $t("msg.title") }}</h2>
              <div class="column">
                <a class="button is-link is-inverted is-outlined" @click="current='create'">
                {{ $t("msg.new_.create") }}</a>
              </div>
              <div class="column"><a class="button is-link is-inverted is-outlined" @click="current='restore'">
                {{ $t("msg.new_.restore") }}</a>
              </div>
              <div class="column">
                <a class="button is-link is-inverted is-outlined has-text-grey" style="pointer-events: none;">
                  {{ $t("msg.new_.import") }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
  <create v-else-if="current === 'create'"></create>
  <restore v-else></restore>
</template>

<script>
import { messageBus } from '@/messagebus'
import Create from '@/components/Create'
import Restore from '@/components/Restore'

export default {
  name: "new",
  components: {
      Create,
      Restore
  },
  data() {
    return {
      current:'new'
    }
  },
  created(){
    messageBus.$on('backToNew', ()=>{
      this.current = 'new'
    })
  }
}
</script>
<style>

</style>
