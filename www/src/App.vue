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
  width:100%;
  font-family: 'Didcat Gothic', sans-serif;
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
  background-color: #10999e;
  color: black;
}
.btn:hover{
  background-color: #10999e;
}
.btn:focus{
  background-color: #10999e;
}
html, body{
  height:  100%;
  width:100%
}
.center-things{
  display:flex;
  justify-content: center;
}
</style>
