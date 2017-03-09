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
    state.chat.push(data)
    debugger
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
            }).catch(handleError)
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
            }).catch(handleError)
        },
        createGame(user, gameName, maxPlayers, cb) {
            let game = {
                name: gameName,
                creatorId: user._id,
                maxPlayers: maxPlayers
            }
            api.post('games', game).then(res => {
                if (res.data.data.name) {
                    this.getGame(res.data.data.name)
                    cb(gameName)
                }

            }).catch(handleError)
        },
        joinGame(user, gameName, cb) {
            api.post('joingame', { user: user, name: gameName }).then(res => {
                console.log(res.data.data)
                cb(gameName)
            }).catch(handleError)
        },
        leaveGame(user, gameName) {
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
        submitText(name, text) {
            client.emit('message', {
                name: name,
                text: text
            });
        },
        getDeck() {
            api('fights').then(res => {
                let deck = Shuffle.shuffle({ deck: res.data.data })
                state.deck = deck
                this.drawHand()
            }).catch(handleError)
        },
        drawHand() {
            if (state.activeUser) {
                let hand = state.deck.draw(5)

                for (let card of hand) {
                    state.hand.push(card)
                }
            }
        },
        drawCard() {
            if (state.activeUser) {
                let hand = state.deck.draw()
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