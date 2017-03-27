import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let schema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  created: { type: Number, required: true, default: Date.now() },
  playersInGameSession: [{ type: ObjectId, ref: models.user.name }],
  active: { type: Boolean, required: true, default: false },
  winner: { type: String, default: ''},
  maxPlayers: { type: Number, required: true },
  // Phase 0: No turn
  // Phase 1: Draw a card
  // Phase 2: Choose an attack if you have one. *If not, draw another card or a new hand. 
  // Phase 2.5: (front-end) Choose a target if applicable
  // Phase 3: Target chooses a counter or takes an Injury
  // Phase 3.5: (front-end) Target chooses who the counter affects
  // Phase 4: *Post-injury logic (Injury effects, Knockouts, some special cards)
  // * Stretch goal
  turnPhase: { type: Number, default: 0 },
  //RELATION
  deck: [{ type: ObjectId, ref: models.fight.name }],
  injuryDeck: [{ type: ObjectId, ref: models.injury.name }],
  creatorId: { type: ObjectId, ref: models.user.name },
  currentTurn: { type: ObjectId, ref: models.user.name },
  activeTurn: { type: ObjectId, ref: models.user.name },
  lastTurn: { type: ObjectId, ref: models.user.name },
  lastActiveTurn: { type: ObjectId, ref: models.user.name },
  activeCard: { type: ObjectId, ref: models.fight.name },
  lastCard: { type: ObjectId, ref: models.fight.name }
})

// handleCard(card, ?target)
// if(card.type == 'Attack')
//  setActiveTurn(target)
//  setActiveCard(card)
// else if(card.type == 'Counter')
//  if(target)
//    setActiveTurn(target)
//  else
//    nextTurn()
// 
//  ...res.send(game)


module.exports = mongoose.model('Game', schema)