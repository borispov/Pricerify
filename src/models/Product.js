const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true
  },

  image: {
    type: String,
  },

  url: {
    type: String,
    required: true
  },

  prices: [{
    date: {type: Date, default: Date.now},
    price: Number
  }]

})

module.exports = mongoose.model('products', ProductSchema)