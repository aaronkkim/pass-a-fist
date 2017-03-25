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
            <!--<input name="group1" type="radio" id="icon1" :value="badges[0].badgeUrl"v-model="badge"/>
      <label for="icon1"> <img :src="badges[0].badgeUrl" alt="" @click="displayBadgeUrl(badges)"></label>
      <input name="group1" type="radio" id="icon2" :value="badges[1].badgeUrl" v-model="badge"/>
      <label for="icon2"> <img :src="badges[1].badgeUrl" alt=""></label>
      <input name="group1" type="radio" id="icon3" :value="badges[2].badgeUrl" v-model="badge"/>
      <label for="icon3"> <img :src="badges[2].badgeUrl" alt=""></label>
      <input name="group1" type="radio" id="icon4" :value="badges[3].badgeUrl" v-model="badge"/>
      <label for="icon4"> <img :src="badges[3].badgeUrl" alt=""></label>
      <input name="group1" type="radio" id="icon5" :value="badges[4].badgeUrl" v-model="badge"/>
      <label for="icon5"> <img :src="badges[4].badgeUrl" alt=""></label>
      <input name="group1" type="radio" id="icon6" :value="badges[5].badgeUrl" v-model="badge"/>
      <label for="icon6"> <img :src="badges[5].badgeUrl" alt=""></label>-->
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
    
    img {
        height: 100px;
        width: 100px;
    }
</style>