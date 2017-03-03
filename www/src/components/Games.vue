<template>

<div class="bgpic">
<form @submit.prevent= "createGame">
<input type="text" placeholder= "name" v-model="gameName" required>
<input type="number" placeholder= "max players" v-model="maxPlayers" required>
</form>
<button @click = "createGame">Create Game</button>
  </div>

</div>

</div>
  

  
</template>

<script>
export default {
  name: 'game',
  data() {
      return {
          text: '',
          gameName:'',
          maxPlayers:8
      }
  },
  // mounted() {
  //   this.$root.$data.store.actions.getGame()
  //   this.getDeck()
  // },
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
