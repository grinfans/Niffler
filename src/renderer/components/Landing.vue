<template>
  <login v-if="walletExist"></login>
  <new v-else></new>
</template>
  
<script>
  import Login from '@/components/Login'
  import New from '@/components/New'

  export default {
    name: 'landing',
    components: {
      Login,
      New
    },
    props: {
      walletExist: false,
    },
}
</script>

<style>
</style>
