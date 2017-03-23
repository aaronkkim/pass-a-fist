<template>
    <div>
        <h1>Profile Page</h1>

        <div v-for="badge in badges">
            <label :for="badge.name"><img :src="badge.badgeUrl"
            /></label>
            <input :id="badge.name" type="radio" name="userbadge" v-model="selectedBadge" :value="badge.badgeUrl" /> 
        </div>
        <button @click="saveUser">Set Badge</button>
    </div>
</template>

<script>
    import badgeService from "../services/badge-service"

    export default {
        data() {
            return {
                badges: badgeService.getBadges(),
                selectedBadge: ''
            }
        },
        computed: {
            user() {
                return this.$root.$data.store.state.activeUser
            },
        },
        methods: {
            saveUser() {
                this.user.badgeUrl = this.selectedBadge
                console.log(this.user)
                // Save the current User
            }
        }

    }

</script>
<style>
       .main {
        text-align: right;
        padding-right: 5%;
    }
    nav{
        background-color: black;
        font-family:'Montserrat', sans-serif;
        z-index: 2;
        overflow: hidden;
        position: fixed;
       
    }
    a{
       color: #11abb0
    }
</style>