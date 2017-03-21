<template>
  <div class="bgpic">
    <div class="container">
      <div class="row">
        <div class="col s7 card">
          <div class="card-head">
            <div class="card-title">Create a new game</div>
            <div class="card-content">
              <form @submit.prevent="createGame">
                <input type="text"  max="20" placeholder="name" v-model="gameName" required>
                <input type="number" min="2" max="20" placeholder="max players" v-model="maxPlayers" required>
              </form>
            </div>
          </div>
          <div class="card-action"  v-if="user.createdGame">
            <a href="#/games" @click="createGame" class="waves-effect waves-light orange-btn btn disabled">Create Game</button></a>
          </div>
           <div class="card-action"  v-else>
            <a href="#/games" @click="createGame" class="waves-effect waves-light orange-btn btn">Create Game</button></a>
          </div>
        </div>
      </div>
    </div>
        <lobby></lobby>
  </div>
</template>

<script>
import Lobby from "./Lobby"
export default {
  name: 'games',
  data() {
      return {
          text: '',
          gameName:'',
          maxPlayers:8
      }
  },
  components: { Lobby },
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
    }
  },
  methods: {
    submitText() {
      if(this.user.name && this.text) {
        this.$root.$data.store.actions.submitText(this.user.name, this.text)
        this.text = ''
      }
    },
    createGame(){
      let gameName = this.gameName.replace(/[^\w\s!?]/g,'');
      this.$root.$data.store.actions.createGame(this.user, gameName, this.maxPlayers, this.linkToGame)
    },
    linkToGame(gameName) {
      this.$router.push({path:'/games/'+ gameName})
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
