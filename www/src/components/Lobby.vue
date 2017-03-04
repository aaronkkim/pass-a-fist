<template>
  <div class="container">
    <div class="row">
        <div class="col s4 card" v-for="game in lobby"> 
            <div>
                <div class="card-head">
                    <div class="card-title">{{game.name}}</div>
                </div>
                <div class="card-content">
                    <p>Current Players: 0/{{game.maxPlayers}}</p>
                </div>
                <div class="card-action">
                    <router-link :to="'/games/' + game.name">Join Game</router-link>
                </div>
            </div>
        </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'lobby',
  computed: {
    user() {
        return this.$root.$data.store.state.activeUser
    },
    chat() {
        return this.$root.$data.store.state.chat
    },
    game() {
        return this.$root.$data.store.state.gameSession
    },
    deck() {
      return this.$root.$data.store.state.deck
    },
    hand() {
      return this.$root.$data.store.state.hand
    },
    lobby() {
      return this.$root.$data.store.state.games
    }
  },
  mounted() {
      this.$root.$data.store.actions.getGames()
  },
  methods: {
    submitText() {
      if(this.user.name) {
        this.$root.$data.store.actions.submitText(this.user.name, this.text)
        this.text = ''
      }
    },
    getDeck() {
      this.$root.$data.store.actions.getDeck()
      
    },
    drawHand() {
      this.$root.$data.store.actions.drawHand()
    },
    drawCard() {
      this.$root.$data.store.actions.drawCard()
    },
    createGame(){
      this.$root.$data.store.actions.createGame(this.user, this.gameName, this.maxPlayers)
      this.$router.push({path:'/game/'+ this.gameName})
    }
  }
}
</script>

<style>
.bgpic{
  background-image: url(https://northendorg.files.wordpress.com/2016/09/freakalley.jpg?w=4000&h=&crop=1);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: absolute;
  height: 100%;
}
.textbox{
  background: rgba(205, 210, 216, .7);
  width: 300px;
  overflow: auto;
  max-height: 300px;
  position: fixed;
  bottom: 0;
  right:0;
}
.card{
    display:inline-flex;
}
img{
    height: 250px;
    /*width:150px;*/
}
/*.flex-container{
  display: flex;
  align-content: flex-end;
  
  
  height: 100%;
  width: 100%;
}*/
</style>
