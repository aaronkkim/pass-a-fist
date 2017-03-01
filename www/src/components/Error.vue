<template>
  <div v-if="error">
    Error: {{error}}
  </div>
</template>

<script>
export default {
  name: 'error',
  computed:{
      error(){ 
        return this.$root.$data.store.state.error;
      }
  },
}
</script>
