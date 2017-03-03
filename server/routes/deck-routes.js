let Shuffle = require('shuffle')
let Fight = require('../models/fight')
let Injury = require('../models/injury')
let Game = require('../models/game')
let User = require('../models/user')



export default {
    deckCards: {
        path: '/game',
        reqType: 'get',
        method(req, res, next) {
            let action = 'shuffle deck'
            Fight.find().then(fight=>{
                res.send(handleResponse(action, fight))
            }).catch(error =>{
                return next(handleResponse(action, null, error))
            })
        }
    }

    
}
