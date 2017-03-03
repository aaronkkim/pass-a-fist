<template>

<div class="bgpic">

<div class="flex-container">

  <div class="container textbox">
    <ul v-for="message in chat" >
        <li>{{message.name}} : {{message.text}}</li>
    </ul>
    <form @submit.prevent="submitText">
        <input type="text" v-model="text">
        <button type="submit" class="waves-effect waves-light btn">Chat</button>
    </form>
  </div>

</div>

</div>
  

  
</template>

<script>
export default {
  name: 'game',
  data() {
      return {
          text: ''
      }
  },
  mounted() {
    this.$root.$data.store.actions.getGame('1234')
  },
  computed: {
    user() {
        return this.$root.$data.store.state.activeUser
    },
    chat() {
        return this.$root.$data.store.state.chat
    },
    game() {
        return this.$root.$data.store.state.gameSession
    }
  },
  methods: {
    submitText() {
      if(this.user.name) {
        this.$root.$data.store.actions.submitText(this.user.name, this.text)
        this.text = ''
      }
    }
  }
}
</script>

<style>
.bgpic{
  background-image: url(https://northendorg.files.wordpress.com/2016/09/freakalley.jpg?w=4000&h=&crop=1);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: absolute;
  height: 100%;
}
.textbox{
  background: rgba(205, 210, 216, .7);
  width: 300px;
  overflow: auto;
  max-height: 300px;
  position: fixed;
  bottom: 0;
  right:0;
}
/*.flex-container{
  display: flex;
  align-content: flex-end;
  
  
  height: 100%;
  width: 100%;
}*/
</style>
