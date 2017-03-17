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
    // Time to fix shit
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
                gameName: gs.name
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
                console.log(game._id)
                // state.games.forEach(game => {
                //     if (game.playersInGameSession.length == 0) {
                //         console.log(game._id)
                //         this.deleteGame(game._id)
                //     }
                // })
            }).catch(handleError);
        },
        getGame(gameName) {
            api('game/' + gameName).then(res => {
                state.gameSession = res.data.data

                getDeck(state.gameSession._id)
                chatRefresh()
            }).catch(handleError)
        },

        chatRefresh() {

            client.emit('joining', { name: state.gameSession.name })
            client.on('joined', function() {
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
                client.emit('joining', { name: gameName })
                client.in(gameName).on('joined', function() {
                    console.log("Joined Room")
                        // console.log(data)
                })


            }).catch(handleError)
        },
        leaveGame(user, gameName) {

            client.emit('leavegame', gameName)
            api.post('leavegame', { userId: user._id, name: gameName }).then(res => {
                state.gameSession = {}
                state.chat = []


            }).catch(handleError)
        },
        getPlayers(gameName) {
            api('game/' + gameName + '/players').then(res => {
                state.players = res.data.data
                if (state.activeUser) {
                    for (var i = 0; i < state.players.length; i++) {
                        var player = state.players[i];
                        if (player._id === state.activeUser._id) {
                            getHand(player._id)
                        }
                    }
                }
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
            }
        },
        drawCard(gameId) {
            if (!state.activeUser._id) return;

            let card = state.deck.draw()
            let userId = state.activeUser._id
            api.put('users/' + userId + '/draw', { card: card }).then(res => {
                updateDeck(gameId)
                getHand(userId)
            }).catch(handleError)

        },
        getInjuryDeck() {
            api('injuries').then(res => {
                let injuryDeck = Shuffle.shuffle({ deck: res.data.data })
                state.injuryDeck = injuryDeck
            }).catch(handleError)
        },
        drawInjury(gameId) {
            if (state.activeUser) {
                let injuryHand = state.injuryDeck.draw()
                state.injuryHand.push(injuryHand)
            }
        },
        deleteGame(id) {
            api.delete('games/' + id)
                .then(res => {
                    this.getGames()
                })
                .catch(handleError)
        },
        startGame(id) {
            api.post('startgame', { id: id }).then(res => {
                if (res.data.data.canStart) {
                    //Shuffle the deck
                    api('fights').then(cards => {
                        let deck = Shuffle.shuffle({ deck: cards.data.data })
                        state.deck = deck
                        dealHands(res.data.data.game)
                        updateDeck(id)
                    }).catch(handleError)
                }
            })
        }
    }
}

let dealHands = (game) => {
    if (!game.playersInGameSession) return;
    var players = game.playersInGameSession
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        dealHand(player._id)
    }
}

let dealHand = (id) => {
    let hand = state.deck.draw(5)
    api.put('users/' + id + '/cards', { cards: hand }).then(res => {
        if (state.activeUser._id === id) {
            getHand(id)
        }
    }).catch(handleError)
}

let getHand = (id) => {
    api('users/' + id + '/cards').then(cards => {
        state.hand = cards.data.data
    }).catch(handleError)
}

let updateDeck = (id) => {
    api.put('games/' + id, { deck: state.deck.cards }).then(deck => {

    }).catch(handleError)
}

export default gameStore