const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  password: {type: String, required: true},
  email: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  followedProducts: [String]
})

const User = mongoose.model('users', UserSchema)

module.exports = User
