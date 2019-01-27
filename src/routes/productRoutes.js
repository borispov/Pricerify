const express = require('express')
const router = express.Router()
const { ProductModel } = require('../models/index')


// get single product
router.get('/api/v1/getProduct/:id', (req, res) => {
  const id = req.query.id

  const response = ProductModel.find({id}, (err, product) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(product)
  })
  return response
})

// get all products
router.get('/api/v1/getProduct/', (req, res) => {
  const { user } = req.body

  const response = ProductModel.findAl({user}, (err, products) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(products)
  })
  return response
})

// post a product
router.post('/api/v1/addProduct', (req, res) => {

})


module.exports = router