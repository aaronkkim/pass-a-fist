import axios from 'axios'
import io from 'socket.io-client'
import Shuffle from 'shuffle'
import cardService from '../services/card-service'
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
    if (data.name && data.text) {
        state.chat.push(data)
    }
});

client.on('joined', function (data) {
    if (data.user) {
        var message = `${data.user.name} has joined the game.`
        state.chat.push({ text: message })
    }
    GameManager.getPlayers(state.gameSession.name)
})
client.on('started', function (data) {
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
    if (state.gameSession.name)
        GameManager.getPlayers(state.gameSession.name);
})
client.on('play', function(data) {
    console.log(data)
    gameStore.actions.getGame(data.name)
})
client.on('drawn', function (data) {
    gameStore.actions.getGame(data.name)
})
// client.on('playCard', function (data) {
//     console.log(data)
//     state.lastCard = data.card
// })
client.on('changeTurn', function (data) {
    let playerName = data.name
    state.activeTurn = data.user.activeTurn
    state.currentTurn = data.user.currentTurn
    state.phase = data.user.phase
    state.gameSession.turnPhase = data.user.phase
    Materialize.toast(`${playerName}\'s turn`, 9000)
})
client.on('changePhase', function (data) {
    state.phase = data
    state.gameSession.turnPhase = data
})
client.on('started', function (id) {
    console.log("starting Game")
    gameStore.actions.activateGame()
})

let state = {
    isLoading: false,
    error: {},
    activeUser: {},
    games: [],
    chat: [],
    gameSession: {},
    // refactor
    creator: {},
    players: [],
    deck: {},
    hand: [],
    injuryDeck: {},
    injuryHand: [],
    currentTurn: '',
    activeTurn: '',
    lastTurn: '',
    phase: 0,
    lastCard: {},
    activeCard: {},
    //
    playableCard: {},
    validTargets: {}

}

let handleError = (err) => {
    state.error = err
    state.isLoading = false
    console.warn(err)
}

let changeTurn = (gameName, user, userName) => {
    client.emit('changingTurn', { gameName: gameName, name: userName, user: user })
}

let changePhase = (gameName, phase) => {
    client.emit('changingPhase', { gameName: gameName, phase: phase })
}

let playCard = (card, index, player) => {
    if (!state.activeUser._id) return;
    if (!state.gameSession._id) return;

    state.phase = 0

    let data = {}

    data.card = card
    data.target = player || null;

    let game = state.gameSession
    let userId = state.activeUser._id

    data.userId = userId

    let lastCard = state.hand.splice(index, 1)[0]
    let hand = state.hand

    for (let card of hand) {
        card.valid = false
    }
    
    state.validTargets = {}

    api.put('game/' + game._id + '/play', data).then(res => {
        client.emit("playing", { name: game.name })
        // GameManager.nextTurn(game, changeTurn)
    }).catch(handleError)
}

let validateTargets = (targetType) => {
    state.validTargets = {}

    let players = state.players
    let playerIndex = players.findIndex(player => {
        return player._id == state.activeUser._id
    })

    let leftTarget = players[playerIndex - 1] || players[players.length - 1]
    let rightTarget = players[playerIndex + 1] || players[0]
    let lastTarget = players.find(player => {
        return player._id == state.lastTurn
    })
    let lastAttacker = state.currentTurn

    switch (targetType) {
        case "None":
            return false
        case "Any":
            // Change store to validate any player as a target
            for (let player of players) {
                state.validTargets[player._id] = true
                console.log(state.validTargets)
            }
            break
        case "Left":
            // Change store to validate player on left
            state.validTargets[leftTarget._id] = true
            break
        case "Right":
            // Change store to validate player on right
            state.validTargets[rightTarget._id] = true
            break
        case "Side":
            // Change store to validate players on left/right
            state.validTargets[leftTarget._id] = true
            state.validTargets[rightTarget._id] = true
            break
        case "Last":
            // Change store to validate last player who played
            state.validTargets[lastTarget] = true
            break
        case "Attacker":
            // Change store to validate player who attacked
            state.validTargets[lastAttacker] = true
            break
        
        return true
    }
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
        saveUser(username, password, badgeUrl) {
            state.isLoading = true
            let userId = state.activeUser._id
            let user = state.activeUser

            let updatedUser = {
                name: username,
                password: password,
                badgeUrl: badgeUrl
            }
            console.log(updatedUser)

            api.put('users/' + userId, updatedUser).then(res => {

                state.activeUser = res.data.data
                console.log("its changed")
            }).catch(handleError)
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
                state.players = res.data.data.playersInGameSession
                state.creator = res.data.data.creatorId
                state.deck.cards = res.data.data.deck
                state.injuryDeck.cards = res.data.data.injuryDeck
                state.activeTurn = res.data.data.activeTurn
                state.currentTurn = res.data.data.currentTurn
                state.phase = res.data.data.turnPhase
                state.lastCard = res.data.data.lastCard || {}
                state.activeCard = res.data.data.activeCard || {}

                if (state.activeUser) {
                    for (var i = 0; i < state.players.length; i++) {
                        var player = state.players[i];
                        if (player._id === state.activeUser._id) {
                            GameManager.getHand(player._id)
                            GameManager.getInjuryHand(player._id)
                        }
                    }
                }
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
            state.phase = 0
            let card = state.deck.draw()
            let userId = state.activeUser._id
            api.put('users/' + userId + '/draw', { card: card }).then(res => {
                var p1 = GameManager.updateDeck(game._id)
                var p2 = GameManager.getHand(userId)
                Promise.all([p1, p2]).then(values => {
                    setTimeout(function () { client.emit('drawing', { name: game.name }) }, 200)
                    if (state.gameSession.turnPhase == 1)
                        GameManager.nextPhase(game, changePhase);
                    else if (state.gameSession.turnPhase == 2) {
                        GameManager.nextTurn(game, changeTurn);
                    }
                })
            }).catch(handleError)

        },
        activateCard(card, index) {
            let targetType = GameManager.getTargetType(card)
            state.playableCard = { card, index }
            let needsTarget = validateTargets(targetType)
            console.log(needsTarget)
            if (needsTarget == false) {
                playCard(card, index)
            }
        },
        targetPlayer(player) {
            let cardData = state.playableCard
            playCard(cardData.card, cardData.index, player)
        },
        drawInjury(gameId, gameName) {
            if (!state.activeUser._id) return;

            let card = state.injuryDeck.draw()
            let userId = state.activeUser._id

            api.put('game/' + gameId + '/takeInjury', { card: card, userId: userId }).then(res => {
                console.log(res.data.data)
                GameManager.updateInjuryDeck(gameId)
                GameManager.getInjuryHand(userId)
                // Setup a client.emit to injury route
                client.emit("playing", { name: gameName })
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