<template>
  <div class="register container">
    <form @submit.prevent="registerUser" action="#">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="number" v-model="age" placeholder="Age" required>
      <input type="password" v-model="password" placeholder="Password" reqiured>
      <input name="group1" type="radio" id="icon1" />
      <label for="icon1"> <img src="../assets/icon1.png" alt=""></label>
      <input name="group1" type="radio" id="icon2" />
      <label for="icon2"> <img src="../assets/icon2.png" alt=""></label>
      <input name="group1" type="radio" id="icon3" />
      <label for="icon3"> <img src="../assets/icon3.png" alt=""></label>
      <input name="group1" type="radio" id="icon4" />
      <label for="icon4"> <img src="../assets/icon4.png" alt=""></label>
      <input name="group1" type="radio" id="icon5" />
      <label for="icon5"> <img src="../assets/icon5.png" alt=""></label>
      <input name="group1" type="radio" id="icon6" />
      <label for="icon6"> <img src="../assets/icon6.png" alt=""></label>
      <br>
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
                age: '',
                password: ''
            }
        },
        methods: {
            registerUser() {
                this.$root.$data.store.actions.register(this.username, this.email, this.password, this.age)
                this.$router.push({
                        path: '/'
                    })
                    // this.username = ''
                    // this.email = ''
                    // this.password = ''
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .register {
        padding-top: 5rem;
    }
    
    img {
        height: 100px;
        width: 100px;
    }
    
    label.active {
        background-color: aquamarine;
    }
</style>