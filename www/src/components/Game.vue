<template>
  <div class="container">
    <form @submit.prevent="submitText">
        <input type="text" v-model="text">
        <button type="submit" class="waves-effect waves-light btn">Chat</button>
    </form>
    <h3>Chat should be below here</h3>
    <ul v-for="message in chat">
        <li>{{message.name}} : {{message.text}}</li>
    </ul>
  </div>
  
</template>

<script>
import gameService from '../services/game-service'
export default {
  name: 'game',
  data() {
      return {
          name: 'Dain bramage',
          text: ''
      }
  },
  computed: {
    user() {
        return this.$root.$data.store.state.activeUser
    },
    chat() {
        return this.$root.$data.store.state.chat
    }
  },
  methods: {
    submitText() {
      gameService.submitText(this.name, this.text)
      this.text = ''
    }
  }
}
</script>
