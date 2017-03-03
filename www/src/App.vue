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
  color: black;
  height: 100%;
  width:100%
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
.btn{
  background-color: #fea;
  color: black;
}
.btn:hover{
  background-color: #fea;
}
.btn:focus{
  background-color: #fea;
}
html, body{
  height:  100%;
  width:100%
}
</style>
