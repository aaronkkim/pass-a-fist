<template>
    <div class="home">
        <h2>{{msg}}</h2>

        <div v-if="user.name">
            Welcome, {{user.name}}
            <div v-for="card in cards"> 
                {{card.name}} {{card.type}} 
            <img v-if="card.imgUrl" :src="card.imgUrl"> 
            </div>

            <div v-for="injury in injuries"> 
                {{injury}}
                <img v-if="injury.imgUrl" :src="injury.imgUrl">
            </div>
        </div>
        <div v-else-if="loading">
            Loading...
        </div>
        <div v-else>
            Please login or register to play Pass-a-fist.
        </div>
    </div>
</template>


<script>
    import cardService from '../services/card-service'
    import injuryService from '../services/injury-service'
    export default {
        name: 'home',
        components: { Error },
        // mounted() {
        //     this.$root.$data.store.actions.()
        // },
        computed: {
            user() {
                return this.$root.$data.store.state.activeUser
            },
            loading() {
                return this.$root.$data.store.state.isLoading
            }
        },
        data() {
            return {
                msg: 'Pass-a-fist',
                cards: cardService.getSomeFakeCards(),
                injuries: injuryService.getSomeFakeInjuries()
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img{
    height: 300px;
    width:200px;
}
    
</style>