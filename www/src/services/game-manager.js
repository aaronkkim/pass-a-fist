import axios from 'axios'
import Store from '../store'

let api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 30000,
    withCredentials: true
})

let handleError = (err) => {
    Store.state.error = err
    Store.state.isLoading = false
    console.warn(err)
}

let gameManager = {
    resetUserData() {
        Store.state.gameSession = {}
        Store.state.activeUser.cards = []
        Store.state.activeUser.injuries = []
        Store.state.activeUser.createdGame = false
        Store.state.hand = []
        Store.state.injuryHand = []
        Store.state.chat = []
    },

    getPlayers(gameName) {
        api('game/' + gameName + '/players').then(res => {
            Store.state.players = res.data.data
            if (Store.state.activeUser) {
                for (var i = 0; i < Store.state.players.length; i++) {
                    var player = Store.state.players[i];
                    if (player._id === Store.state.activeUser._id) {
                        this.getHand(player._id)
                        this.getInjuryHand(player._id)
                    }
                }
            }
        })
    },

    dealHands(game) {
        if (!game.playersInGameSession) return;
        var players = game.playersInGameSession
        var playerHands = []
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            playerHands.push(this.dealHand(player._id))
        }
        Promise.all(playerHands).then(values => {
            return new Promise((resolve, reject) => {
                resolve(values)
            })
        })
    },

    dealHand(id) {
        let hand = Store.state.deck.draw(5)
        api.put('users/' + id + '/cards', { cards: hand }).then(res => {
            if (Store.state.activeUser._id === id) {
                this.getHand(id)
            }
        }).catch(handleError)
    },

    getHand(id) {
        api('users/' + id + '/cards').then(cards => {
            Store.state.hand = cards.data.data
        }).catch(handleError)
    },

    getInjuryHand(id) {
        api('users/' + id + '/injuries').then(injuries => {
            Store.state.injuryHand = injuries.data.data
        }).catch(handleError)
    },

    getDeck(gameName) {
        api('game/' + gameName + '/deck').then(deck => {
            Store.state.deck.cards = deck.data.data
        }).catch(handleError)
    },

    updateDeck(id) {
        api.put('games/' + id, { deck: Store.state.deck.cards }).then(deck => {
            // Hrmm
            return new Promise((resolve, reject) => {
                resolve(deck)
            })
        }).catch(handleError)
    },

    updateInjuryDeck(id) {
        api.put('games/' + id, { injuryDeck: Store.state.injuryDeck.cards }).then(deck => {
            // Hrmm
            return new Promise((resolve, reject) => {
                resolve(deck)
            })
        }).catch(handleError)
    },

    startTurn(game, cb) {
        if (!game.playersInGameSession) return;

        let players = game.playersInGameSession
        let player = players[Math.floor(Math.random() * players.length)]
        console.log(player)
        if (player._id) {
            api.put('game/' + game._id + '/turn', { currentTurn: player._id, activeTurn: player._id, phase: 1 }).then(turn => {
                let user = turn.data.data
                Store.state.currentTurn = user.currentTurn
                Store.state.activeTurn = user.activeTurn
                var playerName = Store.state.players.find(function (banana) {
                    return banana._id == player._id
                })
                cb(game.name, user, player.name)
            }).catch(handleError)
        }
    },

    nextTurn(game, cb) {
        let players = Store.state.players
        var currentPlayer = Store.state.currentTurn
        var currentPlayerIndex = players.findIndex(function (nPlayer) {
            return nPlayer._id == currentPlayer
        })
        if (players[currentPlayerIndex + 1]) {
            var nextPlayer = players[currentPlayerIndex + 1]
        } else {
            var nextPlayer = players[0]
        }
        if (nextPlayer) {
            console.log(nextPlayer)
            api.put('game/' + game._id + '/turn', { currentTurn: nextPlayer._id, activeTurn: nextPlayer._id, phase: 1 }).then(turn => {
                var user = turn.data.data
                Store.state.currentTurn = user.currentTurn
                Store.state.activeTurn = user.activeTurn
                cb(game.name, user, nextPlayer.name)
            }).catch(handleError)
        }

    },

    nextPhase(game, cb) {
        let phase = game.turnPhase + 1
        api.put('game/' + game._id + '/phase', { phase: phase }).then(nextPhase => {
            cb(game.name, phase)
        }).catch(handleError)
    },

    nextActiveTurn() {

    },

    getTargetType(card) {
        let index = card.index
        switch(index) {
            // use index to determine target types
            case 4:
            case 7:
            case 12:
            case 47:
            case 63:
            case 65:
            case 73:
            case 84:
            case 92:
            case 95:
            case 108:
            case 112:
            case 129:
            case 131:
                return "Left"
            case 17:
            case 31:
            case 33:
            case 37:
            case 40:
            case 67:
            case 85:
            case 86:
            case 88:
            case 90:
            case 91:
            case 104:
            case 126:
            case 127:
            case 130:
                return "Right" 
            case 23:
            case 28:
            case 35:
            case 44:
            case 52:
            case 60:
            case 68:
            case 96:
            case 101:
                return "Side"
            case 69: //aww yeah giggity xD
            case 70:
            case 71:
            case 78:
            case 83:
            case 93:
            case 110:
            case 115:
            case 117:
            case 118:
            case 120:
            case 125:
            case 128:
                return "None"
            case 72:
                return "Attacker"
            case 77:
            case 80:
            case 81:
            case 87:
            case 97:
            case 98:
            case 99:
            case 100:
            case 102:
            case 103:
            case 107:
            case 111:
            case 113:
            case 119:
            case 122:
            case 135:
                return "Last"
            case 2:
            case 10:
            case 19:
            case 25:
            case 46:
            case 49:
            case 62:
            case 76:
            case 79:
            case 89:
            case 94:
            case 114:
            case 116:
            case 121:
            case 124:
            case 132:
            case 133:
            case 134:
                return "Other"
            default:
                return "Any"
        }
    },
    getBehavior(card) {
        
    }
}


export default gameManager