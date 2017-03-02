<template>
  <div id="app">
    <!--<error></error>-->
    <navbar></navbar>
    <!--<img src="./assets/logo.png">-->
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'app',
  components: {Navbar}
}
</script>

<style>
#app {
  font-family: Georgia, 'Times New Roman', Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  background-image: url('./assets/retinawood.png')
}
h1, h2{
  color: #11ABB0;
font-family: 'Montserrat', sans-serif;
}
.redtext{
  color: #eb0606
}
.inline-flex {
  display: inline-flex;
  flex-direction: row-reverse;
}
</style>
