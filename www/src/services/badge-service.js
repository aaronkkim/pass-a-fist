import badgeIcons from '../assets/badges/icons.js'

let badges = [{
        name: 'icon1',
        badgeUrl: badgeIcons.icon1
    },
    {
        name: 'icon2',
        badgeUrl: badgeIcons.icon2
    },
    {
        name: 'icon3',
        badgeUrl: badgeIcons.icon3
    },
    {
        name: 'icon4',
        badgeUrl: badgeIcons.icon4
    },
    {
        name: 'icon5',
        badgeUrl: badgeIcons.icon5
    },
    {
        name: 'icon6',
        badgeUrl: badgeIcons.icon6
    }
]

let badgeService = {
    getBadges() {
        return badges
    }
}

export default badgeService