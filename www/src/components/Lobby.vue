<template>
  <div class="container game-lobby">
  <button class = "waves-effect waves-light btn" @click="refreshGame">Refresh</button>
    <div class="row flex-card">
        <div class="col s4 card" v-for="game in lobby" v-if="lobby.length"> 
            <div>
                <div class="card-head">
                    <div class="card-title">{{game.name}}</div>
                </div>
                <div class="card-content" >
                    <p>Current Players: {{game.playersInGameSession.length}}/{{game.maxPlayers}}</p>
                    <p>Created By: {{game.creatorId.name}}</p>
                </div>
                <div class="card-action" v-if="game.playersInGameSession.length < game.maxPlayers">
                   <a href ="#/games" @click="joinGame(game)" class ="waves-effect waves-light btn orange-btn">Join Game</a>
                    <!--<a href="#/games" @click="deleteGame(game._id)" class ="waves-effect waves-light btn orange-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></a>-->
                </div>
                 <div class="card-action" v-if="game.playersInGameSession.length >= game.maxPlayers">
                    <a href="#/games" @click="joinGame(game)" class ="waves-effect waves-light btn disabled">Join Game</a>
                    <!--<a href="#/games" @click="deleteGame(game._id)" class ="waves-effect waves-light btn orange-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></a>-->
                    
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
                return this.$root.$data.store.state.games.filter(function(game) {
                    return game.creatorId
                })

            }
        },
        mounted() {
            this.$root.$data.store.actions.getGames()
        },
        methods: {
            joinGame(game) {
                if (this.user.name && game.name) {
                    if (!this.game._id || this.game._id === game._id) {
                        this.$root.$data.store.actions.joinGame(this.user, game.name, this.linkToGame);
                    } else {
                        console.log(this.user.name + " is already in a game")
                    }
                }
            },
            linkToGame(gameName) {
                this.$router.push({
                    path: '/games/' + gameName
                })
            },
            refreshGame() {
                this.$root.$data.store.actions.getGames()
            },
            deleteGame(id) {
                this.$root.$data.store.actions.deleteGame(id)
            }
        }
    }
</script>

<style>
    .bgpic {
        background-image: url(https://northendorg.files.wordpress.com/2016/09/freakalley.jpg?w=4000&h=&crop=1);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: fixed;
        height: 100%;
    }
    /*.textbox {
        background: rgba(205, 210, 216, .7);
        width: 20%;
        overflow: auto;
        height: 70%;
        position: fixed;
        bottom: 0;
        right: 0;
    }*/
    
    .orange-btn {
        background-color: #ffab40;
        color: white;
    }
    
    .orange-btn:hover {
        background-color: #ffab40;
    }
    
    .orange-btn:focus {
        background-color: #ffab40;
    }
    
    .card {
        display: inline-flex;
    }
    
    .flex-card {
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: wrap-reverse;
    }
    
    img {
        height: 250px;
        /*width:150px;*/
    }
    
    .game-lobby {}
    /*.flex-container{
  display: flex;
  align-content: flex-end;
  
  
  height: 100%;
  width: 100%;
}*/
</style>