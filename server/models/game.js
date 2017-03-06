import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let schema = new Schema({
  name: { type: String, required: true, unique: true, dropDeps: true },
  created: { type: Number, required: true, default: Date.now() },
  playersInGameSession: [{ type: ObjectId, ref: models.user.name }],
  //RELATION
  creatorId: { type: ObjectId, ref: models.user.name },
  active: { type: Boolean, required: true, default: false },
  maxPlayers: { type: Number, required: true },
})



module.exports = mongoose.model('Game', schema)