import axios from 'axios'
import io from 'socket.io-client'
import Shuffle from 'shuffle'


let api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 30000,
    withCredentials: true
})


let client = io.connect('http://localhost:3000/');

client.on('CONNECTED', function(data) {
    console.log(data);


});

client.on('message', function(data) {

    console.log(data);

    if (data.name && data.text) {
        state.chat.push(data)
    }
});

let state = {
    activeUser: {},
    games: [],
    gameSession: {},
    players: [],
    isLoading: false,
    chat: [],
    error: {},
    deck: {},
    hand: [],
    injuryDeck: {},
    injuryHand: []
}

let handleError = (err) => {
    state.error = err

    state.isLoading = false
}

let gameStore = {
    //ALL DATA LIVES IN THE STATE
    state,
    //ACTIONS are responsible for managing all async requests
    actions: {
        // USER AUTHENTICATION
        login(email, password) {
            state.isLoading = true
            api.post('login', {
                email: email,
                password: password
            }).then(res => {
                state.activeUser = res.data.data
                state.isLoading = false
            }).catch(handleError)
        },
        register(username, email, password, age) {
            state.isLoading = true
            api.post('register', {
                name: username,
                email: email,
                password: password,
                age: age
            }).then(res => {
                this.login(email, password)
            }).catch(handleError)
        },
        submitText(name, text, gs) {
            console.log("gamesession", gs)
            client.emit('message', {
                name: name,
                text: text,
                roomId: gs._id
            });
        },
        logout() {
            api.delete('logout').then(res => {
                state.activeUser = {}
            }).catch(handleError)
        },
        authenticate() {
            api('authenticate').then(res => {
                if (res.data.data) {
                    state.activeUser = res.data.data
                    state.loading = false
                }
            }).catch(handleError)
        },
        // GET GAMES
        getGames() {
            api('lobby/').then(res => {
                state.games = res.data.data
            }).then(res => {
                state.games.forEach(game => {
                    if (game.playersInGameSession.length == 0) {
                        console.log(game._id)
                        this.deleteGame(game._id)
                    }
                })
            }).catch(handleError);
        },
        getGame(gameName) {
            api('game/' + gameName).then(res => {
                state.gameSession = res.data.data

                if (state.activeUser) {
                    state.activeUser.hand = []
                }
            }).then(res => {
                this.getDeck()
                this.getInjuryDeck()

                // console.log(data)

            }).catch(handleError)
        },

        chatRefresh(gameName){
                            
               client.emit('joining',{name: gameName})
                client.on('joined', function(){
                    console.log("Joined Room")
                })

        },
        createGame(user, gameName, maxPlayers, cb) {
            let game = {
                name: gameName,
                creatorId: user._id,
                maxPlayers: maxPlayers
            }
            state.activeUser.createdGame = true
            api.post('games', game).then(res => {
                if (res.data.data.name) {
                    this.getGame(res.data.data.name)
                    cb(gameName)
                }

            }).catch(handleError)
        },
        joinGame(user, gameName, cb) {
            //console.log(gameName)

            api.post('joingame', { user: user, name: gameName }).then(res => {
                console.log(res.data.data)
                cb(gameName)
                state.gameSession = res.data.game

                console.log("attempting to join room")

            }).catch(handleError)
        },
        leaveGame(user, gameName) {

            client.emit('leavegame', gameName)
            api.post('leavegame', { userId: user._id, name: gameName }).then(res => {
                state.gameSession = {}
               

            }).catch(handleError)
        },
        getPlayers(gameName) {
            api('game/' + gameName + '/players').then(res => {
                state.players = res.data.data
                console.log(res.data.data)
            })
        },
        getDeck() {
            api('fights').then(res => {
                let deck = Shuffle.shuffle({ deck: res.data.data })
                state.deck = deck

                this.drawHand(state.activeUser._id)

            }).catch(handleError)
        },
        drawHand(id) {
            if (state.activeUser) {
                let hand = state.deck.draw(5)
                api.put('users/' + id, { cards: hand }).then(res => console.log(res)).catch(handleError)


                for (let card of hand) {
                    state.hand.push(card)
                }
            }
        },
        drawCard(id) {
            if (state.activeUser) {
                let hand = state.deck.draw()
                api.put('users/' + id, { cards: hand }).then(res => console.log(res)).catch(handleError)

                state.hand.push(hand)
            }
        },
        getInjuryDeck() {
            api('injuries').then(res => {
                let injuryDeck = Shuffle.shuffle({ deck: res.data.data })
                state.injuryDeck = injuryDeck
            }).catch(handleError)
        },
        drawInjury() {
            if (state.activeUser) {
                let injuryHand = state.injuryDeck.draw()
                state.injuryHand.push(injuryHand)
            }
        },
        deleteGame(id) {
            api.delete('games/' + id)
                .then(res => {
                    console.log(res)
                    this.getGames()
                })
                .catch(handleError)
        }

        // goCrazy(card, index) {
        //     card.index = index
        //     api.post('/injuries', card).then(res => {
        //         console.log(res.data.data)
        //     }).catch(handleError)
        // }
    }

}



export default gameStore