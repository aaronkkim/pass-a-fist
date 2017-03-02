import io from 'socket.io-client'
import store from '../store'

let client = io.connect('http://localhost:3000/');

client.on('message', function (data) {
    console.log(data);
    if(data.name && data.text) {
        store.state.chat.push(data)
    }
});

let gameService = {
    submitText(name, text) {
        client.emit('message', {
            name: name,
            text: text
        });
    }
}


export default gameService