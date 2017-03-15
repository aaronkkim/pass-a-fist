let Users = require('../models/user')


export default {

    getUser: {
        path: '/users/:id',
        reqType: 'get',
        method(req, res, next) {
            let action = 'get a user'
            Users.findOne({ _id: req.params.id })
                .then(user => {
                    res.send(handleResponse(action, user))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    updateCards: {
        path: '/users/:id',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update a player\'s hand'
            Users.findByIdAndUpdate(req.params.id, {
                $set: { cards: req.body.cards },
            }, { new: true })
                .then(user => {
                    user.save()
                    console.log(user.cards)
                    res.send(handleResponse(action, user))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    getHand: {
        path: '/users/:id/cards',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get your hand'
            Users.findById(req.params.id).populate("cards").then(user => {
                res.send(handleResponse(action, user.cards))
            })
        }
    }
}


function handleResponse(action, data, error) {
    var response = {
        action: action,
        data: data
    }
    if (error) {
        response.error = error
    }
    return response
}


