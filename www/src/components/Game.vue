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
export default {
  name: 'game',
  data() {
      return {
          text: ''
      }
  },
  mounted() {
    this.$root.$data.store.actions.getGame()
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
