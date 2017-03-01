import injuryIcons from '../assets/cards/injury-cards/icons.js'

let injuries = [
    {
        name: "Dain Bramage",
        damage: 1,
        imgUrl: injuryIcons.dain_bramage__injury
    },
    {
        name: "Torn Achiles",
        damage: 1,
        imgUrl: injuryIcons.torn_achiles__injury
    },
    {
        name: "A third fake injury",
        damage: 1
    }
]

let injuryService = {
    getSomeFakeInjuries() {
        return injuries
    },
    addFakeInjury(injuryName) {
        injuries.push({ name: injuryName, damage: 1})
        console.log('New injury added')
    }
}

export default injuryService;