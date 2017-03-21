import axios from 'axios'
import io from 'socket.io-client'
import Shuffle from 'shuffle'


let api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 30000,
    withCredentials: true
})


let client = io.connect('http://localhost:3000/');

client.on('CONNECTED', function (data) {
    console.log(data);
});

client.on('message', function (data) {

    console.log(data);

    if (data.name && data.text) {
        state.chat.push(data)
    }
});

client.on('joined', function (data) {
    console.log(data)
    if (data.user) {
        var message = `${data.user.name} has joined the game.`
        state.chat.push({ text: message })
    }
    getPlayers(state.gameSession.name)
})
client.on('started', function (data) {
    console.log(data)
     if (data.user) {
        var message = `${data.user.name} has started the game.`
        state.chat.push({ text: message })
     }
    state.gameSession.active = true
    gameStore.actions.getGame(state.gameSession.name)
})
client.on('leavegame', function (data) {
    var message = `${data.user.name} has left the game.`
    state.chat.push({ text: message })
    getPlayers(state.gameSession.name)
})
client.on('drawn', function (data) {
    console.log("Drawing Card")
    getPlayers(state.gameSession.name)
})
client.on('started', function (id) {
    console.log("starting Game")
    gameStore.actions.activateGame()
})

let state = {
    activeUser: {},
    games: [],
    gameSession: {},
    creator: {},
    players: [],
    isLoading: false,
    chat: [],
    error: {},
    deck: {},
    hand: [],
    injuryDeck: {},
    injuryHand: [],
    currentTurn: '',
    activeTurn: ''
}

let handleError = (err) => {
    state.error = err
    state.isLoading = false
    console.warn(err)
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

                //This should probably be done on the backend
                state.games.forEach(game => {
                    if (game.playersInGameSession.length == 0) {
                        this.deleteGame(game._id)
                    }
                })
            }).catch(handleError);
        },
        getGame(gameName) {
            api('game/' + gameName).then(res => {
                state.gameSession = res.data.data
                state.creator = res.data.data.creatorId
                state.deck.cards = res.data.data.deck
                state.injuryDeck.cards = res.data.data.injuryDeck
                // this.chatRefresh()
                getPlayers(gameName)
            }).catch(handleError)
        },
        initiateDeck() {
            //Initiates a fake deck before assigning cards
            state.deck = Shuffle.shuffle({ deck: ['Pass', 'a', 'fist'] })
            state.injuryDeck = Shuffle.shuffle({ deck: ['Pass', 'a', 'fist'] })
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
                    this.joinGame(user, gameName, cb)
                }

            }).catch(handleError)
        },
        joinGame(user, gameName, cb) {
            //console.log(gameName)
            api.post('joingame', { user: user, name: gameName }).then(res => {
                cb(gameName)
                console.log(res)
                state.gameSession = res.data.data.game
                //console.log("attempting to join room")
                client.emit('joining', { name: gameName, user: user })

            }).catch(handleError)
        },

        leaveGame(user, gameName, cb) {
            api.post('leavegame', { userId: user._id, name: gameName }).then(res => {
                client.emit('leavegame', gameName)
                // console.log("Left game")
                resetUserData()
                cb()
            }).catch(handleError)
        },
        drawCard(gameId, gameName) {
            if (!state.activeUser._id) return;

            let card = state.deck.draw()
            let userId = state.activeUser._id
            api.put('users/' + userId + '/draw', { card: card }).then(res => {
                updateDeck(gameId)
                getHand(userId)
                client.emit('drawing', { name: gameName })
            }).catch(handleError)

        },
        drawInjury(gameId, gameName) {
            if (!state.activeUser._id) return;

            let card = state.injuryDeck.draw()
            let userId = state.activeUser._id

            api.put('users/' + userId + '/drawinjury', { card: card }).then(res => {
                client.emit('drawing', { name: gameName })
                updateInjuryDeck(gameId)
                getInjuryHand(userId)
            }).catch(handleError)

        },
        deleteGame(id) {
            api.delete('games/' + id)
                .then(res => {
                    this.getGames()
                })
                .catch(handleError)
        },
        startGame(id, gameName, creator) {
            api.post('startgame', { id: id }).then(res => {
                if (res.data.data.game) {
                    //Shuffle the deck
                    api('fights').then(cards => {
                        let deck = Shuffle.shuffle({ deck: cards.data.data })
                        state.deck = deck
                        api('injuries').then(injuries => {
                            let injuryDeck = Shuffle.shuffle({ deck: injuries.data.data })
                            state.injuryDeck = injuryDeck
                            state.gameSession.active = true

                            let p1 = dealHands(res.data.data.game)
                            let p2 = startTurn(res.data.data.game)
                            let p3 = updateDeck(id)
                            let p4 = updateInjuryDeck(id)
                            Promise.all([p1, p2, p3, p4]).then(values => {
                                setTimeout(function () { client.emit('starting', { name: gameName, user: creator }); }, 500)
                            })
                        })
                    }).catch(handleError)
                } else {
                    console.log(res.data.data.message)
                }
            })
        },
        activateGame() {
            state.gameSession.active = true
        }
    }
}

let resetUserData = () => {
    state.gameSession = {}
    state.activeUser.cards = []
    state.activeUser.injuries = []
    state.activeUser.createdGame = false
    state.hand = []
    state.injuryHand = []
}

let getPlayers = (gameName) => {
    api('game/' + gameName + '/players').then(res => {
        state.players = res.data.data
        if (state.activeUser) {
            for (var i = 0; i < state.players.length; i++) {
                var player = state.players[i];
                if (player._id === state.activeUser._id) {
                    getHand(player._id)
                    getInjuryHand(player._id)
                }
            }
        }
    })
}

let dealHands = (game) => {
    if (!game.playersInGameSession) return;
    var players = game.playersInGameSession
    var playerHands = []
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        playerHands.push(dealHand(player._id))
    }
    Promise.all(playerHands).then(values => {
        return new Promise((resolve, reject) => {
            resolve(values)
        })
    })
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

let getInjuryHand = (id) => {
    api('users/' + id + '/injuries').then(injuries => {
        state.injuryHand = injuries.data.data
    }).catch(handleError)
}

let updateDeck = (id) => {
    api.put('games/' + id, { deck: state.deck.cards }).then(deck => {
        // Hrmm
    }).catch(handleError)
}

let updateInjuryDeck = (id) => {
    api.put('games/' + id, { injuryDeck: state.injuryDeck.cards }).then(deck => {
        // Hrmm
    }).catch(handleError)
}

let startTurn = (game) => {
    if (!game.playersInGameSession) return;

    let players = game.playersInGameSession
    let player = players[Math.floor(Math.random() * players.length)]
    console.log(player)
    if (player._id) {
        api.put('game/' + game._id + '/turn', { currentTurn: player._id, activeTurn: player._id, phase: 1 }).then(turn => {
            let user = turn.data.data
            state.currentTurn = user.currentTurn

            state.activeTurn = user.activeTurn
        }).catch(handleError)
    }
}

let nextTurn = function () {

}

let nextActiveTurn = function () {

}


export default gameStore