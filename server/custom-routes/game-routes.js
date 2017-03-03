let Games = require('../models/game')

export default {
  gameSession: {
    path: '/game/:id',
    reqType: 'get',
    method(req, res, next){
      let action = 'Get game session by custom game id'
      Games.findOne({gameId: req.params.id})
        .then(game => {
          res.send(handleResponse(action, game))
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