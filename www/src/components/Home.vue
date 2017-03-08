<template>
    <div class="container">
        <div class="background">
          <h2>{{msg}}</h2>

          <div v-if="user.name">

                <h1>Welcome, {{user.name}} </h1>

                <router-link class="waves-effect waves-light btn" :to="'games'">FIND A GAME! </router-link>

                <h2>How to play:</h2>
                <ul>
                <li> To start turn, a player always draws 1 card from the top of the Fight deck. That player can then play an Attack card from their hand on another player.</li>
                <li>If an Attack card lands on a player at any time, that player can play a Counter card to stap or redirect the attack.</li>
                <li>If an Attack card lands on a player, and that player can't (or won't) play a Counter card, then the Attack card is successful, and the player receives an Injury card.</li>
                <li> If an Attack card results in an injury, the player that originally played the Attack gets to draw an additional Fight card as a bonus. </li>
                <li>If a player is knocked out by an attack card on your turn, you get their entire hand as a bonus, instead of drawing an additional fight card</li>
                <li class="redtext">IF YOU GET 3 INJURY CARDS, YOU'RE OUT OF THE GAME.</li>
                </ul>


           
            </div>
            <div v-else-if="loading">
                Loading...
            </div>
            <div v-else>
                Please login or register to play Pass-a-fist.
            </div>
        </div>
    </div>
</template>


<script>
    import cardService from '../services/card-service'
    import injuryService from '../services/injury-service'
    export default {
        name: 'home',
        components: { Error },
        // mounted() {
        //     this.$root.$data.store.actions.()
        // },
        computed: {
            user() {
                return this.$root.$data.store.state.activeUser
            },
            loading() {
                return this.$root.$data.store.state.isLoading
            }
        },
        data() {
            return {
                msg: 'Pass-a-fist',
                gameName: "The Game",
                cards: cardService.getSomeFakeCards(),
                injuries: injuryService.getSomeFakeInjuries()
            }
        },
        methods: {
            // goCrazy(card, index) {
            //     this.$root.$data.store.actions.goCrazy(card, index)
            // }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card{
    display:inline-flex;
}
img{
    height: 250px;
    /*width:150px;*/
}
.container{
  text-align: center;
  background-image: url("../assets/retinawood.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: absolute;
  height: 100%;
}


</style>