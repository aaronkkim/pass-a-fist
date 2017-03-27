<template>

    <div class="bgpic bggame">
        <button class="waves-effect waves-light btn orange-btn" @click="leaveGame">leave game</button>

        <div class="players-in-game">
            <ul v-for="player in players" v-if="player._id !== user._id" @click="targetPlayer(player)">
                <div class="countFights">{{player.cards.length}}</div>
                <li class="card-panel cardStyles" :class="{'player-valid': player.valid}" v-show="otherPlayer"> {{player.name}} <img :src="player.badgeUrl" alt="" class="img-opp"></li>
                <div class="countInjuries">{{player.injuries.length}}</div>
            </ul>
        </div>


        <div class="flex-container">
            <img src="../assets/cards/main-fight.png" v-if="game.active" class="deck-fight rotate90" :class="{'deck-fight-valid': deck.valid}"
                @click="drawCard(deck)">

            <div v-if="user._id == creator._id && players.length > 1 && !game.active">
                <button class="btn" @click="startGame" v-show="show">Start</button>
            </div>

            <div v-if="players.length == 1 && !game.winner">
                <h3 class="white-text">Waiting for players...</h3>
            </div>
            <div v-if="game.winner">
                <h3 class="white-text">{{game.winner}} wins!!!</h3>
            </div>
            <img v-if="game.active && lastCard.imgUrl" :src="lastCard.imgUrl"></img>
            <img v-if="game.active && discard.imgUrl" :src="discard.imgUrl">

            <img src="../assets/cards/main-injury.png" v-if="game.active" class="deck-injury rotate90" :class="{'deck-injury-valid': injuryDeck.valid}"
                @click="drawInjury(injuryDeck)">

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
                                    <span>{{message.name}}<a v-show="message.name">: </a>{{message.text}}</span>
                                </li>
                            </ul>


                        </div>
                        <form @submit.prevent="submitText" class="typing">
                            <input type="text" v-model="text">
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
            <div class="hand" :style="cardPosition" v-for="(card, index) in hand" @click="activateCard(card, index)">
                <img class="card" :class="{'card-valid': card.valid}" v-if="card.imgUrl" :src="card.imgUrl">
            </div>

        </div>

    </div>




</template>

<script>
    import badges from "../services/badge-service.js"
    import fightCards from '../services/card-service.js'
    export default {
        name: 'game',
        data() {
            return {
                text: '',
                show: true,
                otherPlayer: true,
                fightCard: fightCards.getSomeFakeCards()[0]
            }
        },
        mounted() {
            this.$root.$data.store.actions.initiateDeck()
            this.$root.$data.store.actions.getGame(this.$route.params.id)
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
            deck() {
                let deck = {}
                if (this.user && this.activeTurn && this.phase) {
                    if (this.user._id == this.activeTurn) {
                        if (this.phase == 1 || this.phase == 2) {
                            deck.valid = true
                        }
                    }
                }
                return deck
            },
            injuryDeck() {
                let injuryDeck = {}
                if (this.user && this.activeTurn && this.phase) {
                    if (this.user._id == this.activeTurn) {
                        if (this.phase == 3) {
                            injuryDeck.valid = true
                        } else {
                            injuryDeck.valid = false
                        }
                    }
                }
                return injuryDeck
            },
            creator() {
                return this.$root.$data.store.state.creator
            },
            hand() {
                let hand = this.$root.$data.store.state.hand
                if (this.user && this.activeTurn && this.phase) {
                    if (this.user._id == this.activeTurn)
                        for (let card of hand) {
                            if (card.type == 'Attack' && this.phase === 2) {
                                card.valid = true
                            } else if (card.type == 'Counter' && this.phase === 3) {
                                card.valid = true
                            }
                        }
                }
                return hand
            },
          
            injuryHand() {
                return this.$root.$data.store.state.injuryHand
            },
            players() {
                let players = this.$root.$data.store.state.players
                if (players && this.validTargets) {
                    for (let player of players) {
                        if (player && this.validTargets[player._id]) {
                            player.valid = true
                        } else {
                            player.valid = false
                        }
                    }
                }
                return players
            },
            validTargets() {
                return this.$root.$data.store.state.validTargets
            },
            fightCard() {
                return this.$root.$data.store.state.activeCard
            },
            currentTurn() {
                return this.$root.$data.store.state.currentTurn
            },
            activeTurn() {
                return this.$root.$data.store.state.activeTurn
            },
            phase() {
                return this.$root.$data.store.state.phase
            },
            lastCard() {
                return this.$root.$data.store.state.lastCard
            },
            activeCard() {
                return this.$root.$data.store.state.activeCard
            },
            discard() {
                return this.$root.$data.store.state.discard
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
            drawCard(deck) {
                if (deck.valid) {
                    this.$root.$data.store.actions.drawCard(this.game)
                } else {
                    console.log('nope')
                }
            },
            activateCard(card, index) {
                if (card.valid) {
                    this.$root.$data.store.actions.activateCard(card, index)
                } else {
                    console.log('nope')
                }
            },
            targetPlayer(player) {
                if (player.valid) {
                    this.$root.$data.store.actions.targetPlayer(player)
                } else {
                    console.log('nope')
                }
            },
            drawInjury(injuryDeck) {
                if (injuryDeck.valid) {
                    this.$root.$data.store.actions.drawInjury(this.game._id, this.game.name)
                } else {
                    console.log('no!')
                }

            },
            startGame() {
                this.show = !this.show
                this.$root.$data.store.actions.startGame(this.game._id, this.game.name, this.creator)
            },
            leaveGame() {
                this.$root.$data.store.actions.leaveGame(this.user, this.game.name, this.returnHome)
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
        overflow: hidden;
        ul {
            position: relative;
            bottom: auto;
            overflow: auto;
            height: 100%;
            text-align: left;
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
    .lastCard{
        height: 23vh;
    }
    
    .cardStyles {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        background-color: rgba(100, 100, 100, .7);
        padding: 20px;
        width: 8vw;
        height: 16vh;
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
        height: 11vh;
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
    
    .typing {
        position: absolute;
        bottom: 0;
        width: 75%;
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
        height: 19vh;
        z-index: 0;
        margin-left: -50px;
        transition: transform 500ms ease-out;
        transform: scale(1) translateY(0);
    }
    
    .card-valid {
        -webkit-filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.8));
        box-shadow: 0px 0px 20px 10px #ff8
    }
    
    .injury {
        height: 19vh;
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
        height: 11vh;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 0.80));
        -webkit-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
    }
    
    .deck-fight-valid {
        -webkit-filter: drop-shadow(0px 0px 8px rgba(0, 231, 255, 0.8));
        box-shadow: 0px 0px 20px 10px #0ff
    }
    
    .deck-fight-valid:hover {
        -webkit-filter: drop-shadow(0px 0px 8px rgba(0, 231, 255, 0.8));
        box-shadow: 0px 0px 35px 15px #7ff
    }
    
    .deck-injury {
        border-radius: 25px;
        height: 11vh;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 0.80));
        -webkit-transition: all 0.5s linear;
        -o-transition: all 0.5s linear;
        transition: all 0.5s linear;
    }
    
    .deck-injury-valid {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 8px #eb0606);
        box-shadow: 0px 0px 25px 10px #ffb3b3
    }
    
    // .deck-fight:hover {
    //     border-radius: 25px;
    //     height: 100px;
    //     margin: 10px;
    //     -webkit-filter: drop-shadow(0px 0px 8px rgba(0, 231, 255, 0.8));
    //     box-shadow: 0px 0px 25px 10px #0ff
    // }
    .deck-injury-valid:hover {
        border-radius: 25px;
        height: 100px;
        margin: 10px;
        -webkit-filter: drop-shadow(0px 0px 8px #eb0606);
        box-shadow: 0px 0px 35px 15px #ffb7b7
    }
    
    .players-in-game {
        display: flex;
        justify-content: space-around;
        margin-bottom: 45px;
        margin-top: -30px;
        height: 27vh;
    }
    
    .player-valid {
        -webkit-filter: drop-shadow(0px 0px 8px #eb0606);
        box-shadow: 0px 0px 25px 10px #ffb3b3
    }
</style>