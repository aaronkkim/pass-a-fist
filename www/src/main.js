// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import io from 'socket.io-client'
import store from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    store
  },
  router,
  template: '<App/>',
  components: { App }
})

var client = io('http://localhost:3000');

client.on('connection', function (socket) {
    console.log(socket);
    
    socket.on('CONNECTED', function(data) {
       console.log(data);
    })
    
    socket.emit('message', 'le Message');

    socket.emit('update', function(data) {
      console.log(data)
    })
});





