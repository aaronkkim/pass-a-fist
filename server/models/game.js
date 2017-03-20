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
  // Phase 0: No turn
  // Phase 1: Draw a card
  // Phase 2: Choose an attack (if you have one)
  // Phase 3: Choose a target*
  // Phase 4: Target chooses a counter or takes an Injury
  // Phase 5: Target chooses who the counter affects*
  // Phase 6: Post-injury logic (Knockouts, CPR)*
  turnPhase: { type: Number, default: 0 },
  //RELATION
  deck: [{ type: ObjectId, ref: models.fight.name }],
  creatorId: { type: ObjectId, ref: models.user.name },
  currentTurn: { type: ObjectId, ref: models.user.name },
  lastTurn: { type: ObjectId, ref: models.user.name },
  activeTurn: { type: ObjectId, ref: models.user.name },
  lastActiveTurn: { type: ObjectId, ref: models.user.name },
})



module.exports = mongoose.model('Game', schema)