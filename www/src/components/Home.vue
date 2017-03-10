<template>
    <div>

        <div v-if="loading" class="loader">
            <img src="../assets/preloader.gif" alt="">
        </div>
        <div v-else>
            <div class="bgpicture">
                <div class="flex-con">
                    <div class="elevated-box">
                        <div v-if="user.name">
                            <p>Welcome, {{user.name}} </p>
                            <router-link class="waves-effect waves-light btn-flat" :to="'games'">FIND A GAME! </router-link>
                        </div>
                        <div v-else>
                            <p>
                                Please login or register to play Pass-a-fist.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
            <div class="row bgwhite">
                <div class="col s6">

                    <h2>How to play:</h2>
                </div>
                <div class="col s6">

                    <ul>
                        <li> To start turn, a player always draws 1 card from the top of the Fight deck. That player can then
                            play an Attack card from their hand on another player.</li>
                        <li>If an Attack card lands on a player at any time, that player can play a Counter card to stap or redirect
                            the attack.</li>
                        <li>If an Attack card lands on a player, and that player can't (or won't) play a Counter card, then the
                            Attack card is successful, and the player receives an Injury card.</li>
                        <li> If an Attack card results in an injury, the player that originally played the Attack gets to draw
                            an additional Fight card as a bonus. </li>
                        <li>If a player is knocked out by an attack card on your turn, you get their entire hand as a bonus,
                            instead of drawing an additional fight card</li>
                        <li class="redtext">IF YOU GET 3 INJURY CARDS, YOU'RE OUT OF THE GAME.</li>
                    </ul>
                </div>
            </div>
            <div class="row bgpic2">


                <div class="elevated-box2">
                    <p>Check out the original Pass-a-fist</p>
                </div>



            </div>




            <div class="row bgwhite">
                <div class="col s6">


                    <ul>
                        <li> To start turn, a player always draws 1 card from the top of the Fight deck. That player can then
                            play an Attack card from their hand on another player.</li>
                        <li>If an Attack card lands on a player at any time, that player can play a Counter card to stap or redirect
                            the attack.</li>
                        <li>If an Attack card lands on a player, and that player can't (or won't) play a Counter card, then the
                            Attack card is successful, and the player receives an Injury card.</li>
                        <li> If an Attack card results in an injury, the player that originally played the Attack gets to draw
                            an additional Fight card as a bonus. </li>
                        <li>If a player is knocked out by an attack card on your turn, you get their entire hand as a bonus,
                            instead of drawing an additional fight card</li>
                        <li class="redtext">IF YOU GET 3 INJURY CARDS, YOU'RE OUT OF THE GAME.</li>
                    </ul>

                </div>
                <div class="col s6">
                    <h2>The Story of Pass-A-Fist</h2>
                </div>
            </div>
        </div>


    </div>
</template>


<script>
    import cardService from '../services/card-service'
    import injuryService from '../services/injury-service'
    export default {
        name: 'home',
        components: {
            Error
        },
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
    .btn-flat {
        outline: 2px solid white;
        color: white;
    }
    
    .card {
        display: inline-flex;
    }
    
    img {
        height: 250px;
        /*width:150px;*/
    }
    
    .bgpicture {
        background-image: url("../assets/mainpic.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        height: 100vh;
        padding-top: 45px;
    }
    
    .bgwhite {
        background-color: white;
        height: 40vh;
        display: flex;
        align-items: center;
    }
    
    .bgpic2 {
        background-image: url("../assets/mainpic.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .flex-con {
        display: flex;
        justify-content: center;
    }
    
    .loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    
    .elevated-box {
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
        background: rgba(8, 17, 40, 0.45);
        color: #fafafa;
        width: 30vw;
        height: 15vh;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
        margin-top: 477px;
    }
    
    .elevated-box2 {
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
        background: rgba(8, 17, 40, 0.45);
        color: #fafafa;
        width: 30vw;
        height: 15vh;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
    }
</style>