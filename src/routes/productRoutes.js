const express = require('express')
const router = express.Router()

const { ProductModel } = require('../models/index')
const currentPrice = require('../utils/scraper/scrape')

// get single product from User Database.
router.get('/api/v1/getUserProduct/:id', (req, res) => {
  const id = req.query.id
  const response = ProductModel.find({id}, (err, product) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(product)
  })
  return response
})

// get 
router.get('/api/v1/getProd/', async (req, res) => {
  const url = req.body.URL.toString()
  let result = await currentPrice(url)
  res.send(result)
})

// get all products from DB
router.get('/api/v1/getUserProduct/', (req, res) => {
  const { user } = req.body

  const response = ProductModel.findAl({user}, (err, products) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(products)
  })
  return response
})

// post a product.
// try to register a product in user's DB.
router.post('/api/v1/addProduct', (req, res) => {

})


module.exports = router