<template>
    <div id="home">


        <div v-if="loading" class="loader">
            <img src="../assets/preloader.gif" alt="">
        </div>
        <div v-else>
              
            <div class="bgpicture">
                <div class="flex-con">
                    <div class="elevated-box center-things">
                        <div v-if="user.name">
                            <p>Welcome, {{user.name}} </p>
                            <router-link class="waves-effect waves-light btn-flat" :to="'games'">FIND A GAME! </router-link>
                        </div>
                        <div v-else>
                            <h4>
                                Please <router-link to="login">login </router-link> or <router-link  to="register">register </router-link> to play Pass-a-fist.
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wood">
                <ul id="staggered-list">
                    <li>
                        <div class="rules">
                            <h3>ATTACK OTHER PLAYERS</h3>
                            <p>Play attack cards to try and knock your opponents out of the game. If your attack lands, you get a bonus card</p>
                        </div>
                    </li>
                    <li>
                        <div class="rules">
                            <h3>DEFEND YOURSELF</h3>
                            <p>Play counter cards to prevent attacks from landing on you. Stop, or redirect those cards to other players.</p>
                        </div>
                    </li>
                    <li>
                        <div class="rules">
                            <h3>GET INJURED</h3>
                            <p>Can't counter an attack? Draw an injury card. Get three injurues, and you're out of the game.</p>
                        </div>
                    </li>
                </ul>

            </div>
            
            <!--<div class="row bgwhite">
                <div class="col s6">

                    <h1>How to play:</h1>
                </div>
                <div class="col s6">

                    <ul>
                        <li> To start turn, a player always draws 1 card from the top of the Fight deck. That player can then
                            play an Attack card from their hand on another player.</li>
                            <br>
                        <li>If an Attack card lands on a player at any time, that player can play a Counter card to stap or redirect
                            the attack.</li>
                            <br>
                        <li>If an Attack card lands on a player, and that player can't (or won't) play a Counter card, then the
                            Attack card is successful, and the player receives an Injury card.</li>
                            <br>
                        <li> If an Attack card results in an injury, the player that originally played the Attack gets to draw
                            an additional Fight card as a bonus. </li>
                            <br>
                        <li>If a player is knocked out by an attack card on your turn, you get their entire hand as a bonus,
                            instead of drawing an additional fight card</li>
                            <br>
                        <li class="redtext">IF YOU GET 3 INJURY CARDS, YOU'RE OUT OF THE GAME.</li>
                    </ul>
                </div>
            </div>-->
            <!--<div class="row bgpic2">


                <div class="elevated-box2 center-things">
                     <a class="waves-effect waves-light btn-flat" href="www.passafist.net">Real life pass-a-fist </a>
                </div>



            </div>-->



<!--
            <div class="row bgwhite">
                <div class="col s6">


                    <ul>
                        <li> To start turn, a player always draws 1 card from the top of the Fight deck. That player can then
                            play an Attack card from their hand on another player.</li>
                            <br>
                        <li>If an Attack card lands on a player at any time, that player can play a Counter card to stop or redirect
                            the attack.</li>
                            <br>
                        <li>If an Attack card lands on a player, and that player can't (or won't) play a Counter card, then the
                            Attack card is successful, and the player receives an Injury card.</li>
                            <br>
                        <li> If an Attack card results in an injury, the player that originally played the Attack gets to draw
                            an additional Fight card as a bonus. </li>
                            <br>
                        <li>If a player is knocked out by an attack card on your turn, you get their entire hand as a bonus,
                            instead of drawing an additional fight card</li>
                            
                        <li class="redtext">IF YOU GET 3 INJURY CARDS, YOU'RE OUT OF THE GAME.</li>
                    </ul>

                </div>
                <div class="col s6">
                    <h2>The Story of Pass-A-Fist</h2>
                </div>
            </div>-->
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
        mounted() {
            var options = [{
                selector: '#staggered-list',
                offset: 400,
                callback: function(el) {
                    Materialize.showStaggeredList($(el));
                }
            }];
            Materialize.scrollFire(options);
        },
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
            scroll() {
                var options = [{
                    selector: '#staggered-list',
                    offset: 100,
                    callback: function(el) {
                        Materialize.showStaggeredList($(el));
                    }
                }];
                Materialize.scrollFire(options);
            }
            // goCrazy(card, index) {
            //     this.$root.$data.store.actions.goCrazy(card, index)
            // }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #home {
        font-family: 'Josefin Sans', sans-serif;
    }
    
    li {
        font-size: 20px;
        opacity: 0;
    }
    
    h1 {
        font-size: 197px;
        line-height: .8;
    }
    
    h2 {
        font-size: 119px;
        line-height: 1;
    }
    
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
    
    .rules {
        border: 2px solid white;
        width: 60vh;
        border-radius: 5px;
        padding: 5px;
        margin: 20px;
        text-align: center;
    }
    
    .rules h3 {
        color: #32605b
    }
    
    .bgpicture {
        background-image: url("../assets/mainpic.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        /*background-attachment: fixed;*/
        height: 100vh;
        padding-top: 45px;
    }
    
    .bgwhite {
        background-color: white;
        height: 100vh;
        display: flex;
        align-items: center;
    }
    
    .wood {
        background-image: url("../assets/retinawood.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        /*background-attachment: fixed;*/
        height: 200vh;
        display: flex;
        justify-content: center;
        /*align-items: center;*/
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
    
    a {
        color: #32605b
    }
</style>