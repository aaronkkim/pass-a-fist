import { models } from '../config/constants'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
let bcrypt = require('bcryptjs')
const SALT_FACTOR = 15

let schema = new Schema({
  name: { type: String, required: true,  },
  email: { type: String, required: true, unique: true, dropDups: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  created: { type: Number, required: true, default: Date.now() },
  activeGame: { type: ObjectId, ref: 'Game' },
  badgeUrl: { type: String },
  //RELATION
  cards: [{ type: ObjectId, ref: 'Card' }],
  injuries: [{ type: ObjectId, ref: 'Injury' }]
})

// cool weird mongoose hooks/event listeners
schema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    } else {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    }
  });
});

schema.methods.validatePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err || !isMatch) {
        return reject(err);
      }
      return resolve(isMatch);
    });
  })
};


module.exports = mongoose.model('User', schema)