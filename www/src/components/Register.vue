<template>
  <div class="register container">
    <form @submit.prevent="registerUser">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="number" v-model="age" placeholder="Age" required>
      <input type="password" v-model="password" placeholder="Password" reqiured>
      <button class="waves-effect waves-light btn">Register</button>
    </form>
    <!--<list></list>-->
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      return {
        username: '',
        email: '',
        age:'',
        password: ''
      }
    },
    methods: {
      registerUser() {
        this.$root.$data.store.actions.register(this.username, this.email, this.password, this.age)
        this.$router.push({path: '/'})
        // this.username = ''
        // this.email = ''
        // this.password = ''
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register{
  padding-top: 5rem;
}
</style>