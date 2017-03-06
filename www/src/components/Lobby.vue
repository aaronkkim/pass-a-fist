<template>
  <div class="container">
    <div class="row">
        <div class="col s4 card" v-for="game in lobby"> 
            <div>
                <div class="card-head">
                    <div class="card-title">{{game.name}}</div>
                </div>
                <div class="card-content">
                    <p>Current Players: {{game.playersInGameSession.length}}/{{game.maxPlayers}}</p>
                   
                </div>
                <div class="card-action">
                    <a href="#/games" @click="joinGame(game)">Join Game</a>
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
    game() {
        return this.$root.$data.store.state.gameSession
    },
    lobby() {
      return this.$root.$data.store.state.games
    }
  },
  mounted() {
      this.$root.$data.store.actions.getGames()
  },
  methods: {
    joinGame(game) {
        if(this.user.name && game.name) {
            if(!this.user.activeGameId || this.user.activeGameId === game._id) {
                this.$root.$data.store.actions.joinGame(this.user, game.name, this.linkToGame);
            }
            else {
                console.log(this.user.name + " is already in a game")
            }
        }
    },
    linkToGame(gameName){
        this.$router.push({path: '/games/' + gameName})
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
  width: 20%;
  overflow: auto;
  height: 90%;
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
