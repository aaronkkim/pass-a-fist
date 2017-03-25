<template>


<nav v-if= "true">
    <div class="nav-wrapper">
      <a href="#" class="brand-logo">Pass-a-Fist</a>
      <div v-if="loading">
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li>one sec...</li>
      </ul>
      </div>
      <div v-else-if="user && !user.name">
       <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><router-link to="login">Login </router-link> </li>
            <li><router-link to="register">Register </router-link> </li>
            
      </ul>
      </div>
      <div v-else-if="game && game.name">
       <ul id="nav-mobile" class="right hide-on-med-and-down" >
       
        <li><router-link v-show="!hideGame" :to="'games/'+game.name">Current Game</router-link></li>
        <li><router-link to="profile"> Welcome, {{user.name}}!</router-link> </li>
        <li><img class="badger" :src="badgeUrl"/></li>
        <li><a href='#' @click="logout">Logout</a></li>
      </ul>
      </div>
      <div v-else>
       <ul id="nav-mobile" class="right hide-on-med-and-down" >
        <li><router-link to="profile"> Welcome, {{user.name}}!</router-link> </li>
        <li><img class="badger" :src="badgeUrl"/></li>
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
            hideGame(){
                console.log(this.$route.path)
                if (this.$route.path === '/games/' + this.game.name){
                    return true
                } else {
                    return false
                }
            }, 
            badgeUrl(){
              return this.$root.$data.store.state.activeUser.badgeUrl
            }
        },
    

        
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
        z-index: 2;
        overflow: hidden;
        position: fixed;
       
    }
    a{
       color: #11abb0
    }
    .badger{
        height: 5vh;
    }
</style>