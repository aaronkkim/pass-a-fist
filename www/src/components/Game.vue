<template>

    <div class="bgpic bggame">
        <button class="waves-effect waves-light btn orange-btn" @click="leaveGame">leave game</button>

        <div class="players-in-game">

            <ul v-for="player in players" v-if="player._id !== user._id">
                <div class="countFights">{{player.cards.length}}</div>
                <li class="card-panel cardStyles" v-show="otherPlayer"> {{player.name}} <img src="../assets/preloader.gif" alt="" class="img-opp"></li>
                <div class="countInjuries">{{player.injuries.length}}</div>
            </ul>
        </div>


        <div class="flex-container">
            <img src="../assets/cards/main-fight.png" v-if="game.active"class="deck-fight rotate90" @click="drawCard">

            <div v-if="user._id == creator._id && !game.active">
                <button class="btn" @click="startGame" v-show="show">Start</button>
            </div>
            <img src="../assets/cards/main-injury.png" v-if= "game.active" class="deck-injury rotate90" @click="drawInjury">
        </div>

        <div class="fixed-action-btn click-to-toggle">
            <a class="btn-floating btn-large red">
                <i class="material-icons">chat_bubble</i>
            </a>
            <ul>

                <div class="textbox">
                    <div class="content">

                    <div class="messages">
                    <ul>
                        <li v-for="message in chat">
                            <span>{{message.name}} : {{message.text}}</span>
                        </li>
                    </ul>


                    </div>
                    <form @submit.prevent="submitText" class="typing">
                        <input type="text" v-model="text" >
                        <button type="submit" class="waves-effect waves-light btn">Chat</button>
                    </form>
                    </div>
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
                show: true,
                otherPlayer: true
            }
        },
        mounted() {
            this.$root.$data.store.actions.initiateDeck()
            this.$root.$data.store.actions.getGame(this.$route.params.id)
            this.$root.$data.store.actions.getPlayers(this.$route.params.id)
                // this.$root.$data.store.actions.chatRefresh(this.$route.params.id)


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
                return this.$root.$data.store.state.gameSession || true
            },
            creator() {
                return this.$root.$data.store.state.creator
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
        watch:{
            deck() {
                return this.$root.$data.store.state.deck 
        }
        },
        methods: {

            handleCardHover(event) {
                arguments
                let x = event.clientX
            },
            submitText() {
                if (this.user.name) {
                    this.$root.$data.store.actions.submitText(this.user.name, this.text, this.game)
                    this.text = ''
                   $(".messages ul").animate({ scrollTop: $(document).height() }, "slow");
                }

            },
            drawCard() {
                this.$root.$data.store.actions.drawCard(this.game._id, this.game.name)
            },
            drawInjury() {
                this.$root.$data.store.actions.drawInjury(this.game._id, this.game.name)
            },
            startGame() {
                this.show = !this.show
                this.$root.$data.store.actions.startGame(this.game._id, this.game.name)
            },
            leaveGame() {
                this.$root.$data.store.actions.leaveGame(this.$root.$data.store.state.activeUser, this.$route.params.id, this.returnHome)
            },
            returnHome() {
                this.$router.push({
                    path: '/'
                })
            }
        }
    }
</script>

<style lang="scss">
    .content {
        width: 100%;
        height: 100%;
        position: relative;
        overflow:hidden;
        ul {
            position: relative;
            bottom: auto;
            overflow: auto;
            height: 100%;
            text-align:left;
            margin-left: 10px;
        }
        .messages {
            overflow: hidden;
            
        }
    }
    
    .messages {
        height: 75%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
    }
    
    .countFights {
        height: 20px;
        width: 20px;
        border-radius: 50px;
        background-color: lightblue;
        text-align: center;
    }
    
    .countInjuries {
        height: 20px;
        width: 20px;
        border-radius: 50px;
        background-color: darkred;
        color: white;
        text-align: center;
    }
    
    .rotate90 {
        transform: rotate(270deg);
    }
    
    .cardStyles {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        background-color: rgba(100, 100, 100, .7);
        padding: 20px;
        width: 120px;
        height: 155px;
        border-radius: 25px;
    }
    
    .img-opp {
        height: 70%;
        /*width:250px;*/
    }
    
    .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 28vh;
        width: 100%
    }
    
    .bgpic {
        background-image: url(https://northendorg.files.wordpress.com/2016/09/freakalley.jpg?w=4000&h=&crop=1);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: fixed;
        height: 100vh;
        /*overflow-y: scroll;*/
        padding-top: 5rem;
    }
    
    .bggame {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        /*overflow-y: hidden;*/
        z-index: 1;
    }
    
  .typing{
      position:absolute;
      bottom: 0;
      width:75%;
      height: 25%;
      text-align: left;
      margin-left: 10px;
  }
    
    .textbox {
        background-color: white;
        width: 20%;
        height: 50%;
        position: fixed;
        bottom: 0;
        right: 0;
        /*margin-bottom: 81px;*/
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
        justify-content: space-between;
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
    
    .deck-fight {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 0.80));
        -webkit-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
    }
    
    .deck-injury {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 0.80));
        -webkit-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
    }
    
    .deck-fight:hover {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 8px rgba(0, 231, 255, 0.8));
    }
    
    .deck-injury:hover {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 8px #eb0606);
    }
    
    .players-in-game {
        display: flex;
        justify-content: space-around;
    }
</style>