<template>
  <div class="register container">
    <form @submit.prevent="registerUser" action="#">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="number" v-model="age" placeholder="Age" required>
      <input type="password" v-model="password" placeholder="Password" reqiured>
      <p class="grey-text">Badge</p>
      <input name="group1" type="radio" id="icon1" :value="icons.icon1"v-model="badge" />
      <label for="icon1"> <img :src="icons.icon1" alt=""></label>
      <input name="group1" type="radio" id="icon2" :value="icons.icon2" v-model="badge"/>
      <label for="icon2"> <img :src="icons.icon2" alt=""></label>
      <input name="group1" type="radio" id="icon3" :value="icons.icon3" v-model="badge"/>
      <label for="icon3"> <img :src="icons.icon3" alt=""></label>
      <input name="group1" type="radio" id="icon4" :value="icons.icon4" v-model="badge"/>
      <label for="icon4"> <img :src="icons.icon4" alt=""></label>
      <input name="group1" type="radio" id="icon5" :value="icons.icon5" v-model="badge"/>
      <label for="icon5"> <img :src="icons.icon5" alt=""></label>
      <input name="group1" type="radio" id="icon6" :value="icons.icon6" v-model="badge"/>
      <label for="icon6"> <img :src="icons.icon6" alt=""></label>
      <br>
      <button class="waves-effect waves-light btn">Register</button>
     
    </form>
    <!--<list></list>-->
  </div>
</template>

<script>
    import badges from "../assets/icons.js"
    export default {
        name: 'Register',
        data() {
            return {
                username: '',
                email: '',
                age: '',
                password: '',
                badge: '',
                icons: badges
            }
        },
        methods: {
            registerUser() {
                this.$root.$data.store.actions.register(this.username, this.email, this.password, this.age, this.badge)
                debugger
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
</style>