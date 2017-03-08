<template>
  <div class="login container">
    <form @submit.prevent="loginUser">
      <input type="email" v-model="username" placeholder="Email" required >
      <input type="password" v-model="password" placeholder="Password" required>
      <button class="waves-effect waves-light btn">Login</button>
    </form>
    <!--<list></list>-->
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      loginUser() {
        this.$root.$data.store.actions.login(this.username, this.password)
        this.$router.push({path: '/'})
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
  padding-top: 5rem;
}
</style>