<template>

  <div class="bgpic">

   <button class="waves-effect waves-light btn" @click="leaveGame">leave game</button>
   <div v-for="player in players">
    <p> {{player.name}}</p>
   </div>
    <div class="flex-container">  


      <img src="../assets/cards/main-fight.png" class="deck" @click="drawCard">
      <img src="../assets/cards/main-injury.png" class="deck" @click="drawInjury">

    </div>
    <div class="fixed-action-btn click-to-toggle">
      <a class="btn-floating btn-large red" >
        <i class="material-icons">chat_bubble</i>
      </a>

      <ul>
        <div class="container textbox">
          <ul>
          <li v-for="message in chat">
            <span>{{message.name}} : {{message.text}}</span>
          </li>

          </ul>
          <form @submit.prevent="submitText">
            <textarea type="text" v-model="text"></textarea>
            <button type="submit" class="waves-effect waves-light btn">Chat</button>
          </form>
        </div>

      </ul>
    </div>

    <div class="flex-injury" @mouseover="handleCardHover">
      <div class="injuryHand" v-for="injury in injuryHand">
        <img class="injury" v-if="injury.imgUrl" :src="injury.imgUrl">
      </div>

    </div>
    <div class="flex-hand" @mouseover="handleCardHover">
      <div class="hand" :style="cardPosition" v-for="card in hand">
        <img class="card" v-if="card.imgUrl" :src="card.imgUrl">
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
            }
        },
        mounted() {
            this.$root.$data.store.actions.getGame(this.$route.params.id)
            this.$root.$data.store.actions.getPlayers(this.$route.params.id)
            // this.$root.$data.store.actions.getDeck()
            // this.$root.$data.store.actions.getInjuryDeck()

        },
        computed: {
            cardPosition() {
                let marginLeft = 5 - this.hand.length * 5
                marginLeft = Math.min(10, marginLeft)
                marginLeft = marginLeft + 'px'
                return {
                    marginLeft
                }
            },
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
            injuryDeck() {
                return this.$root.$data.store.state.injuryDeck
            },
            injuryHand() {
                return this.$root.$data.store.state.injuryHand
            },
            players() {
                return this.$root.$data.store.state.players
            }
        },
        methods: {
            handleCardHover(event) {
                arguments
                let x = event.clientX
            },
            submitText() {
                if (this.user.name) {
                    this.$root.$data.store.actions.submitText(this.user.name, this.text)
                    this.text = ''
                }
            },
            drawCard() {
                this.$root.$data.store.actions.drawCard()
            },
            drawInjury() {
                this.$root.$data.store.actions.drawInjury()
            },

            leaveGame() {
                this.$root.$data.store.state.gameSession = {}
                this.$root.$data.store.state.activeUser.activeGameId = ''
                this.$router.push({
                        path: '/'
                    })
                    // I started trying to take them out of the array but it is def not right - rachel
                this.$root.$data.store.state.game.playersInGameSession.splice(i, 1)
            }

        }
    }
</script>

<style>
    .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
        width: 100%
    }
    
    .bgpic {
        background-image: url(https://northendorg.files.wordpress.com/2016/09/freakalley.jpg?w=4000&h=&crop=1);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: fixed;
        height: 100vh;
    }
    
    .textbox {
        background: rgba(205, 210, 216, .7);
        width: 20%;
        overflow: auto;
        height: 80%;
        position: fixed;
        bottom: 0;
        right: 0;
    }
    /*.hand {
    /*display: inline-flex;*/
    /*transition: transform 500ms ease-out;*/
    /*transform: scale(1) translateY(0);*/
    /*}*/
    
    .hand:hover {
        transform: scale(1.25) translateY(0);
        padding-bottom: 100px;
        /*margin-left: 100px;
    margin-right: 100px;*/
        z-index: 1;
    }
    
    .flex-hand {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        bottom: 0;
        position: fixed;
        width: 60%;
        margin-left: 20%;
        margin-right: 20%;
        /*overflow-x: hidden;*/
        /*overflow-y: visible;*/
        padding-left: 50px;
    }
    
    .flex-injury {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        position: fixed;
        bottom: 0;
    }
    
    .card {
        height: 200px;
        z-index: 0;
        margin-left: -50px;
        transition: transform 500ms ease-out;
        transform: scale(1) translateY(0);
    }
    
    .injury {
        height: 200px;
        z-index: 0;
        /*margin-bottom: -50px;*/
        transition: transform 500ms ease-out;
        transform: scale(1) translateY(0);
    }
    
    .injury:hover {
        z-index: 1;
    }
    
    .injuryHand {
        display: inline;
        transition: transform 500ms ease-out;
        transform: scale(1) translateY(0);
    }
    
    .card:hover {
        /*transform: scale(1.25) translateY(-200px);*/
        /*margin-left: 100px;
    margin-right: 100px;*/
        z-index: 1;
    }
    
    .deck {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
    }
</style>