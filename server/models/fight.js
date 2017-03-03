import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId



let schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true},
  index: { type: Number, required: true},
  // targetType: { type: String, required: true },
  imgUrl: { type: String, required: true},
  // userId:{type: ObjectId, ref: models.user.name}
})


module.exports = mongoose.model('Fight', schema)