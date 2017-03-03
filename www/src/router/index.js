import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Login from 'components/Login'
import Register from 'components/Register'
import Game from 'components/Game'
import Games from 'components/Games'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/game',
      name: 'Games',
      component: Games
    },
    {
      path: '/game/:id',
      name: 'Game',
      component: Game
    }
  ]
})
