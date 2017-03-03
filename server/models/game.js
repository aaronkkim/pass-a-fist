import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let schema = new Schema({
  name: { type: String, required: true },
  gameId: { type: String, required: true },
  created: { type: Number, required: true, default: Date.now() },
  playersInGameSession: { type: Object },
  //RELATION
  creatorId: { type: ObjectId, ref: models.user.name }
})



module.exports = mongoose.model('Game', schema)