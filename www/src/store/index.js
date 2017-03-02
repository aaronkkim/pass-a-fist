import axios from 'axios'
import io from 'socket.io-client'


let api = axios.create({
    baseURL: 'http://localhost:3000/api/',
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
    isLoading: false,
    chat: [],
    error: {}
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
            api.post('http://localhost:3000/login',{
                email:email,
                password:password
            }).then(res => {
                state.activeUser = res.data.data
            }).catch(handleError)
        },
        register(username, email, password, age) {
            state.isLoading = true
            api.post('http://localhost:3000/register',{
                name:username,
                email:email,
                password:password,
                age:age
            }).then(res => {
                this.login(email, password)
            }).catch(handleError)
        },
        logout() {
            api.delete('http://localhost:3000/logout').then(res => {
                state.activeUser = {}
            }).catch(handleError)
        },
        authenticate() {
            api('http://localhost:3000/authenticate').then(res => {
                if(res.data.data) {
                    state.activeUser = res.data.data
                }
            }).catch(handleError)
        },
        // CHAT SYSTEM
        submitText(name, text) {
            client.emit('message', {
                name: name,
                text: text
            });
        }
    }

}


export default gameStore