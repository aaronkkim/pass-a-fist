<template>


<nav>
    <div class="nav-wrapper">
      <a href="#" class="brand-logo">Pass-a-Fist</a>
      <div v-if="loading">
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li>one sec...</li>
      </ul>
      </div>
      <div v-else-if="!user.name">
       <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><router-link to="login">Login </router-link> </li>
            <li><router-link to="register">Register </router-link> </li>
      </ul>
      </div>
      <div v-else-if="user.activeGameId">
       <ul id="nav-mobile" class="right hide-on-med-and-down" >
       
        <li><router-link :to="'games/'+game.name">Current Game</router-link></li>
        <li> Welcome, {{user.name}}!</li>
        <li><a href='#' @click="logout">Logout</a></li>
      </ul>
      </div>
      <div v-else>
       <ul id="nav-mobile" class="right hide-on-med-and-down" >
        <li> Welcome, {{user.name}}!</li>
        <li><a href='#' @click="logout">Logout</a></li>
      </ul>
      </div>
    </div>
  </nav>


    
</template>

<script>
    export default {
        name: 'main',
        mounted() {
            this.$root.$data.store.actions.authenticate()
        },
        methods: {
            logout() {
                this.$root.$data.store.actions.logout()
                this.$router.push({path: '/'})
            }
        },
        computed: {
            user() {
                return this.$root.$data.store.state.activeUser
            },
            loading() {
                return this.$root.$data.store.state.isLoading
            },
             game() {
        return this.$root.$data.store.state.gameSession
    },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main {
        text-align: right;
        padding-right: 5%;
    }
    nav{
        background-color: black;
        font-family:'Montserrat', sans-serif;
    }
    a{
       color: #11abb0
    }
</style>