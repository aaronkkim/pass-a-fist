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
      Games.findOne({ name: req.params.name }).populate('creatorId')
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
          Users.findByIdAndUpdate(req.body.user._id, { $set: { activeGameId: game._id } }, { new: true }).then(user => {
            res.send(handleResponse(action, { activeGameId: user.activeGameId, game: game }))
          })
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
      Games.findById(gameId).populate('playersInGameSession').then(game => {
        if (!game.active) {
          // Activate the game (when ready)
          //game.active = true
          //game.save()
          return res.send(handleResponse(action, { canStart: true, game: game }))
        }
        res.send(handleResponse(action, { canStart: false, message: "The game has already started" }))
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
        Users.findById(userId).then(user => {
          user.activeGameId = {}
          user.save()
          res.send(handleResponse(action, {}))
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
      Games.findOne({ name: req.params.name }).populate('playersInGameSession')
        .then(game => {
          res.send(handleResponse(action, game.playersInGameSession))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  // updateCards: {
  //   path: '/game/:name/players/:id',
  //   reqType: 'put',
  //   method(req, res, next) {
  //     let action = 'Update player hand';
  //     var cards = req.params.id.cards;
  //     Players.findByIdAndUpdate(req.params.id, {
  //       $set: {
  //         cards: cards
  //       }
  //     })
  //   }
  // },
  getLobby: {
    path: '/lobby',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Get all the games'
      Games.find().populate('creatorId')
        .then(lobby => {
          res.send(handleResponse(action, lobby))
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


// router.get('/game/:id', function(req, res) {
//     Games.find({gameId: req.params.id}).then(game => {
//         return res.send({data: game})
//     }).catch(err => {
//         return res.send({ error: err })
//     })
// })

// module.exports = router