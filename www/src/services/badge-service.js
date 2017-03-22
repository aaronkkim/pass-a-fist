import images from '../assets/icons.js'

let badges = [{
        name: 'icon1',
        badgeUrl: images.icon1
    },
    {
        name: 'icon2',
        badgeUrl: images.icon2
    },
    {
        name: 'icon3',
        badgeUrl: images.icon3
    },
    {
        name: 'icon4',
        badgeUrl: images.icon4
    },
    {
        name: 'icon5',
        badgeUrl: images.icon5
    },
    {
        name: 'icon6',
        badgeUrl: images.icon6
    }
]

let badgeService = {
    getBadges() {
        return badges
    }
}

export default badgeService