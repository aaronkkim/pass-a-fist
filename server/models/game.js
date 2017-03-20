import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let schema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  created: { type: Number, required: true, default: Date.now() },
  playersInGameSession: [{ type: ObjectId, ref: models.user.name }],
  active: { type: Boolean, required: true, default: false },
  maxPlayers: { type: Number, required: true },
  //RELATION
  deck: [{ type: ObjectId, ref: models.fight.name }],
  creatorId: { type: ObjectId, ref: models.user.name },
  currentTurn: { type: ObjectId, ref: models.user.name },
  activeTurn: { type: ObjectId, ref: models.user.name },
  lastActiveTurn: { type: ObjectId, ref: models.user.name },
})



module.exports = mongoose.model('Game', schema)