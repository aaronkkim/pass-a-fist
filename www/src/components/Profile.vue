<template>
    <div class="profileStyle">
        <h1>Welcome, {{user.name}}</h1>
        <div class="row">

        <form class="col s12" @submit.prevent="saveUser">
            <div class="row">
                <div class="input-field col s6">
                    <input v-model="username" type="text" placeholder="Change Name">
                </div>
              
            </div>
            <div class="row">

            <div v-for="badge in badges" class="flex-container1">
                    <input :id="badge.name" type="radio" name="userbadge" v-model="selectedBadge" :value="badge.badgeUrl" />
                    <label :for="badge.name"><img :src="badge.badgeUrl" class="badgesPic"/></label>
            </div>
            </div>
            <button class="waves-effect waves-light btn orange-btn">Update Player</button>

        </form>
        </div>
    </div>
</template>

<script>
    import badgeService from "../services/badge-service"

    export default {
        data() {
            return {
                badges: badgeService.getBadges(),
                selectedBadge: '',
                username: ''

            }
        },
        computed: {
            user() {
                return this.$root.$data.store.state.activeUser
            },
        },
        methods: {
            saveUser() {
                this.$root.store.actions.saveUser(this.username, this.selectedBadge)
                console.log(this.username)
                // Save the current User
                return this.user
            }
        }

    }

</script>
<style scoped>
    .main {
        text-align: right;
        padding-right: 5%;
    }
    
    nav {
        background-color: black;
        font-family: 'Montserrat', sans-serif;
        z-index: 2;
        overflow: hidden;
        position: fixed;
    }
    
    a {
        color: #11abb0
    }
    /*.badgesPic {
        height: 150px;
        display: inline-block;
    }*/
    
    .profileStyle {
        padding-top: 5rem;
    }
    
    .flex-container1 {
        display: inline-block;
        /*flex-direction: row;*/
    }
    .badgesPic{
        height: 15vh;
    }
</style>