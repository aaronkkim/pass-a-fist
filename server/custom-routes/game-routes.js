let Games = require('../models/game')
let Users = require('../models/user')

export default {
  gameSession: {
    path: '/game/:name',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Get game session by custom game name'
      Games.findOne({ name: req.params.name })
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
      Games.findOneAndUpdate(
        { name: req.body.name },
        { $addToSet: { playersInGameSession: req.body.user } },
        { safe: true, upsert: true, new: false })
        .then(game => {
          Users.findByIdAndUpdate(req.body.user._id, {$set: {activeGameId: game._id}}, {new: true}).then(user => {
            res.send(handleResponse(action, {activeGameId: user.activeGameId, game: game}))
          })
        }).catch(error => {
          return next(handleResponse(action, null, error))
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
