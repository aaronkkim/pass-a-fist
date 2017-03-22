import axios from 'axios'
import io from 'socket.io-client'
import Shuffle from 'shuffle'

import GameManager from '../services/game-manager'

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
    GameManager.getPlayers(state.gameSession.name)
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
    GameManager.getPlayers(state.gameSession.name)
})
client.on('drawn', function (data) {
    console.log("Drawing Card")
    GameManager.getPlayers(state.gameSession.name)
    GameManager.getDeck(state.gameSession.name)
})
client.on('changeTurn', function (data) {
    console.log("Changing Turn")
    let playerName = data.name
    state.activeTurn = data.user.activeTurn
    state.currentTurn = data.user.currentTurn
    Materialize.toast(`${playerName}\'s turn`, 9000)
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

let changeTurn = (gameName, user, userName) => {
    client.emit('changingTurn', { gameName: gameName, name: userName, user: user })
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
                GameManager.getPlayers(gameName)
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
                client.emit('leavegame', { name: gameName, user: user })
                // console.log("Left game")
                GameManager.resetUserData()
                cb()
            }).catch(handleError)
        },
        drawCard(game) {
            if (!state.activeUser._id) return;
            state.activeTurn = ''
            let card = state.deck.draw()
            let userId = state.activeUser._id
            api.put('users/' + userId + '/draw', { card: card }).then(res => {
                var p1 = GameManager.updateDeck(game._id)
                var p2 = GameManager.getHand(userId)
                Promise.all([p1, p2]).then(values => {
                    setTimeout(function () { client.emit('drawing', { name: game.name }) }, 200)
                    GameManager.nextTurn(game, changeTurn)
                })
            }).catch(handleError)

        },
        drawInjury(gameId, gameName) {
            if (!state.activeUser._id) return;

            let card = state.injuryDeck.draw()
            let userId = state.activeUser._id

            api.put('users/' + userId + '/drawinjury', { card: card }).then(res => {
                client.emit('drawing', { name: gameName })
                GameManager.updateInjuryDeck(gameId)
                GameManager.getInjuryHand(userId)
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

                            let p1 = GameManager.dealHands(res.data.data.game)
                            let p2 = GameManager.startTurn(res.data.data.game, changeTurn)
                            let p3 = GameManager.updateDeck(id)
                            let p4 = GameManager.updateInjuryDeck(id)
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


export default gameStore