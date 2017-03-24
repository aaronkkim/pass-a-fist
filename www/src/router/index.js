import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Login from 'components/Login'
import Register from 'components/Register'
import Game from 'components/Game'
import Games from 'components/Games'
import Profile from 'components/Profile'

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
      path: '/games',
      name: 'Games',
      component: Games
    },
    {
      path: '/games/:id',
      name: 'Game',
      component: Game
    },
    {
      path: '/profile/',
      name: 'Profile',
      component: Profile
    }
  ]
})
