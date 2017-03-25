<template>
    <div class="register container">
        <form @submit.prevent="registerUser" action="#">
            <input type="text" v-model="username" placeholder="Username" required>
            <input type="email" v-model="email" placeholder="Email" required>
            <input type="number" v-model="age" placeholder="Age" required>
            <input type="password" v-model="password" placeholder="Password" reqiured>
            <p class="grey-text">Badge</p>
            <div v-for="badge in badges" class="flex-container1">
                <input :id="badge.name" type="radio" name="userbadge" v-model="selectedBadge" :value="badge.badgeUrl" />
                <label :for="badge.name"><img :src="badge.badgeUrl" class="badgesPic"/></label>
            </div>
            <br>
            <button class="waves-effect waves-light btn">Register</button>

        </form>
        <!--<list></list>-->
    </div>
</template>

<script>
    import badgeService from "../services/badge-service"
    export default {
        name: 'Register',
        data() {
            return {
                username: '',
                email: '',
                age: '',
                password: '',
                selectedBadge: '',
                badges: badgeService.getBadges()
            }
        },
        methods: {
            registerUser() {
                this.$root.$data.store.actions.register(this.username, this.email, this.password, this.age, this.selectedBadge)

                this.$router.push({
                    path: '/'
                })
                // this.username = ''
                // this.email = ''
                // this.password = ''
            },
            displayBadgeUrl(badges) {
                for (let badge of badges) {
                    console.log(badge.name)
                    console.log(badge.badgeUrl)
                }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .register {
        padding-top: 5rem;
    }
    
   
     .flex-container1 {
        display: inline-block;
        /*flex-direction: row;*/
    }
    .badgesPic{
        height: 12vh;
    }
</style>