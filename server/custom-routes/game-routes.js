let Games = require('../models/game')
let Users = require('../models/user')
let Fights = require('../models/fight')
let Injuries = require('../models/injury')

export default {
    gameSession: {
        path: '/game/:name',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get game session by custom game name'
            Games.findOne({ name: req.params.name })
                .populate('creatorId', 'name badgeUrl')
                .populate('playersInGameSession', 'name cards injuries badgeUrl')
                .populate('lastCard')
                .then(game => {
                    res.send(handleResponse(action, game))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    joinGame: {
        path: '/joingame',
        reqType: 'post',
        method(req, res, next) {
            let action = 'Join a game'
            Games.findOneAndUpdate({ name: req.body.name }, { $addToSet: { playersInGameSession: req.body.user } }, { safe: true, upsert: true, new: false })
                .then(game => {
                    Users.findByIdAndUpdate(req.body.user._id,
                        {
                            $set:
                            {
                                activeGameId: game._id
                            }
                        }, { new: true }).then(user => {
                            res.send(handleResponse(action, { activeGameId: user.activeGameId, game: game }))
                        })
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    leaveGame: {
        path: '/leavegame',
        reqType: 'post',
        method(req, res, next) {
            let action = 'Leave a game'
            let userId = req.body.userId
            Games.findOne({ name: req.body.name }).then(game => {
                game.playersInGameSession.pull(userId)
                game.save()
                Users.findByIdAndUpdate(userId,
                    {
                        $unset:
                        {
                            activeGameId: {},
                            cards: [],
                            injuries: []
                        },
                        $set:
                        {
                            alive: true,
                            conscious: true,
                            turnEnabled: true
                        }
                    }
                ).then(user => {
                    res.send(handleResponse(action, user.cards))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
            })
        }
    },
    getPlayers: {
        path: '/game/:name/players',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get game session by custom game name'
            Games.findOne({ name: req.params.name }).populate('playersInGameSession', 'name cards injuries badgeUrl')
                .then(game => {
                    res.send(handleResponse(action, game.playersInGameSession))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    getDeck: {
        path: '/game/:name/deck',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get game session by custom game name'
            Games.findOne({ name: req.params.name })
                .then(game => {
                    res.send(handleResponse(action, game.deck))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    getLobby: {
        path: '/lobby',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get all the games'
            Games.find().populate('creatorId')
                .then(lobby => {
                    let availableGames = lobby.filter(game => {
                        return !game.active
                    })
                    res.send(handleResponse(action, availableGames))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    startGame: {
        path: '/startgame',
        reqType: 'post',
        method(req, res, next) {
            let action = 'Start the game'
            let gameId = req.body.id
            Games.findById(gameId).populate('playersInGameSession', 'name age cards injuries').then(game => {
                if (!game.active) {
                    // Activate the game (when ready)
                    game.active = true
                    game.save()
                    return res.send(handleResponse(action, { game: game }))

                }
                res.send(handleResponse(action, { message: "The game has already started" }))
            }).catch(error => {
                return next(handleResponse(action, null, error))
            })
        }
    },
    switchCurrentTurn: {
        path: '/game/:id/turn',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update turn to next player'
            Games.findByIdAndUpdate(req.params.id, {
                $set: {
                    currentTurn: req.body.currentTurn,
                    activeTurn: req.body.activeTurn,
                    turnPhase: req.body.phase
                },
            }, { new: true })
                .then(game => {
                    game.save()
                    res.send(handleResponse(action, {
                        id: game._id,
                        currentTurn: game.currentTurn,
                        activeTurn: game.activeTurn,
                        phase: game.turnPhase
                    }))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    switchActiveTurn: {
        path: '/game/:id/activeturn',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update active turn to targeted player'
            Users.findByIdAndUpdate(req.params.id, {
                $set: {
                    activeTurn: req.body.activeTurn,
                    turnPhase: req.body.phase
                }
            }).then(user => {
                user.save()
                res.send(handleResponse(action, user.activeTurn))
            }).catch(error => {
                return next(handleResponse(action, null, error))
            })
        }
    },
    switchPhase: {
        path: '/game/:id/phase',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Update to next phase'
            Games.findByIdAndUpdate(req.params.id, {
                $set: {
                    turnPhase: req.body.phase
                }
            }).then(game => {
                res.send(handleResponse(action, game.turnPhase))
            }).catch(error => {
                return next(handleResponse(action, null, error))
            })
        }
    },
    handleCard: {
        path: '/game/:id/play',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Handle game logic of last card played'
            let message = []

            Games.findById(req.params.id)
                .populate("activeCard")
                .populate("lastTurn", "name")
                .then(game => {
                    let card = req.body.card
                    let playerName = req.body.userName
                    let target = req.body.target || null

                    let lastAttack = game.activeCard
                    let lastAttacker = game.lastTurn


                    setLastCard(game, card)

                    if (card.type === 'Attack' && target) {
                        message.push(`${playerName} attacked ${target.name} with ${card.name}!!!`)
                        setActiveCard(game, card)
                        setActiveTurn(game, target)
                        nextPhase(game)
                    } else if (card.type === 'Counter') {
                        if (target) {
                            message.push(`${playerName} redirected ${lastAttacker.name}'s ${lastAttack.name} to ${target.name} with ${card.name}!`)
                            setActiveTurn(game, target)
                        }
                        else {
                            message.push(`${playerName} stopped ${lastAttack.name}'s ${lastAttack.name} with ${card.name}!`)
                            nextTurn(game, message)
                        }
                    }

                    Users.findByIdAndUpdate(req.body.userId, {
                        $pull: {
                            cards: card._id
                        }
                    }, { new: true })
                        .then(user => {
                            game.save()
                            res.send(handleResponse(action, message))
                        })
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    },
    handleInjury: {
        path: '/game/:id/takeInjury',
        reqType: 'put',
        method(req, res, next) {
            let action = 'Handle game logic of taking an injury'
            let message = []
            Games.findById(req.params.id)
                .populate("playersInGameSession", "name")
                .populate("lastActiveTurn", "name")
                .then(game => {
                    let userId = req.body.userId
                    let injury = req.body.card
                    let lastPlayer = game.lastActiveTurn
                    Users.findByIdAndUpdate(userId, {
                        $push: { injuries: injury },
                    }, { new: true }).populate("injuries")
                        .then(user => {
                            let alive = checkDeath(user)
                            message.push(`${user.name} took an injury, and is now suffering. `)
                            if (!alive) {
                                game.playersInGameSession.pull(user)
                                message.push(`${user.name} is knocked out!!! `)
                            }
                            if (game.playersInGameSession.length < 2) {
                                message.push(`The game is over! ${lastPlayer.name} wins!!!`)
                                game.active = false
                                game.winner = lastPlayer.name
                                // This function should update and end the game. 
                                //  |
                                //  |
                                //  V
                                // setWinner()
                            } else {
                                game = nextTurn(game, message)
                            }
                            game.save().then(() => {
                                res.send(handleResponse(action, message))
                            })
                        })
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    }
}

function nextPhase(game) {
    game.turnPhase++
}

function nextTurn(game, message) {
    let currentTurn = game.currentTurn
    let activeTurn = game.activeTurn
    let players = game.playersInGameSession

    game.lastActiveTurn = activeTurn
    game.lastTurn = currentTurn

    for (var i = 0; i < players.length; i++) {
        var playerId = players[i];
        if (playerId._id == currentTurn.toString()) {
            currentTurn = players[i + 1] || players[0]
        }
    }
    game.currentTurn = currentTurn
    game.activeTurn = currentTurn
    game.activeCard = null
    message.push(game.currentTurn.name + "\'s turn")
    game.turnPhase = 1
    console.log(game.currentTurn)
    return game
}
function checkDeath(user) {
    let damage = 0
    let alive = true
    for (var i = 0; i < user.injuries.length; i++) {
        var injury = user.injuries[i]
        damage += injury.damage
    }
    if (damage >= 3) {
        alive = false
        // user.save()
    }
    return alive
}

function setLastCard(game, card) {
    game.lastCard = card
}

function setActiveCard(game, card) {
    game.activeCard = card
}

function setActiveTurn(game, target) {
    game.lastActiveTurn = game.activeTurn || null
    game.activeTurn = target
}


function handleResponse(action, data, error) {
    var response = {
        action: action,
        data: data
    }
    if (error) {
        response.error = error
        console.error(error)
    }
    return response
}


// router.get('/game/:id', function(req, res) {
//     Games.find({gameId: req.params.id}).then(game => {
//         return res.send({data: game})
//     }).catch(err => {
//         return res.send({ error: err })
//     })
// })

// module.exports = router