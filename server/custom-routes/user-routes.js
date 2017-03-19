let Users = require('../models/user')


export default {

    getUser: {
        path: '/users/:id',
        reqType: 'get',
        method(req, res, next) {
            let action = 'get a user'
            Users.findOne({ _id: req.params.id })
                .then(user => {
                    user.password = null
                    res.send(handleResponse(action, user))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    updateCurrentTurn: {
        path: '/users/:id/turn',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update a player\'s current turn'
            Users.findByIdAndUpdate(req.params.id, {
                $set: {
                    currentTurn: req.body.currentTurn,
                    activeTurn: req.body.activeTurn
                },
            }, { new: true })
                .then(user => {
                    user.save()
                    console.log(user.currentTurn)
                    res.send(handleResponse(action, {
                        id: user._id,
                        currentTurn: user.currentTurn,
                        activeTurn: user.activeTurn
                    }))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    updateActiveTurn: {
        path: '/users/:id/activeturn',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update a player\'s active turn'
            Users.findByIdAndUpdate(req.params.id, {
                $set: {
                    activeTurn: req.body.activeTurn
                },
            }, { new: true })
                .then(user => {
                    user.save()
                    console.log(user.activeTurn)
                    res.send(handleResponse(action, user.activeTurn))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    updateCards: {
        path: '/users/:id/cards',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update a player\'s hand'
            Users.findByIdAndUpdate(req.params.id, {
                $set: { cards: req.body.cards },
            }, { new: true })
                .then(user => {
                    user.save()
                    console.log(user.cards)
                    res.send(handleResponse(action, user.cards))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    addCard: {
        path: '/users/:id/draw',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Adds one card to player\'s hand'
            Users.findByIdAndUpdate(req.params.id, {
                $push: { cards: req.body.card },
            }, { new: true })
                .then(user => {
                    user.save()
                    console.log(user.cards)
                    res.send(handleResponse(action, user.cards))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    getCards: {
        path: '/users/:id/cards',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get your hand'
            Users.findById(req.params.id).populate("cards").then(user => {
                res.send(handleResponse(action, user.cards))
            }).catch(error => {
                return next(handleResponse(action, null, error))
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


