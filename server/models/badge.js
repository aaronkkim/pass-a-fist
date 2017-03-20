import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let schema = new Schema({
  name: { type: String, required: true },
  imgUrl: { type: String, required: true}

})



module.exports = mongoose.model('Game', schema)