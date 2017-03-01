<template>
    <nav class="main">
        <div v-if="loading">
            <p>One sec...</p>
        </div>
        <div v-else-if="!user.name">
            <router-link :to="'login/'">Login </router-link>
            <router-link :to="'register/'">Register </router-link>
        </div>
        <div v-else>
            <p v-if="user.name">Welcome, {{user.name}}! <a href='#' @click="logout">Logout</a></p>
        </div>
        
    </nav>
</template>

<script>
    export default {
        name: 'main',
        mounted() {
            this.$root.$data.store.actions.authenticate()
        },
        methods: {
            logout() {
                this.$root.$data.store.actions.logout()
                this.$router.push({path: '/'})
            }
        },
        computed: {
            user() {
                return this.$root.$data.store.state.activeUser
            },
            loading() {
                return this.$root.$data.store.state.isLoading
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main {
        text-align: right;
        padding-right: 5%;
    }
</style>