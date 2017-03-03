import axios from 'axios'
import io from 'socket.io-client'


let axe = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 30000,
    withCredentials: true
})


let client = io.connect('http://localhost:3000/');

client.on('message', function (data) {
    console.log(data);
    if(data.name && data.text) {
        state.chat.push(data)
    }
});

let state = {
    activeUser: {},
    gameSession: {},
    isLoading: false,
    chat: [],
    error: {},
    deck: []
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
            axe.post('login',{
                email:email,
                password:password
            }).then(res => {
                state.activeUser = res.data.data
                state.loading = false
            }).catch(handleError)
        },
        register(username, email, password, age) {
            state.isLoading = true
            axe.post('register',{
                name:username,
                email:email,
                password:password,
                age:age
            }).then(res => {
                this.login(email, password)
            }).catch(handleError)
        },
        logout() {
            axe.delete('logout').then(res => {
                state.activeUser = {}
            }).catch(handleError)
        },
        authenticate() {
            axe('authenticate').then(res => {
                if(res.data.data) {
                    state.activeUser = res.data.data
                    state.loading = false
                }
            }).catch(handleError)
        },
        // CHAT SYSTEM
        getGame(gameId) {
            axe('api/game/' + gameId).then(res => {
                state.gameSession = res.data.data
                console.log(state.gameSession)
            }).catch(handleError)
        },
        submitText(name, text) {
            client.emit('message', {
                name: name,
                text: text
            });
        },
        getDeck() {
            axe('api/fights').then(res => {
                state.deck = res.data.data
                // Shuffle.shuffle
             }).catch(handleError)
        }
        
        // goCrazy(card, index) {
        //     card.index = index
        //     axe.post('/injuries', card).then(res => {
        //         console.log(res.data.data)
        //     }).catch(handleError)
        // }
    }

}



export default gameStore