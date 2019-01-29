const express = require('express')
const router = express.Router()

const { ProductModel, UserModel } = require('../models/index')
const currentPrice = require('../utils/scraper/scrape')

// get single product from User Database.
router.get('/api/v1/getUserProduct/:id', (req, res) => {
  const id = req.query.id
  const response = ProductModel.find({id}, (err, product) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(product)
  })
  return response
})

// follow 
router.get('/api/v1/followProduct/:prod', async (req, res) => {
  const { user, prod } = req.body
  const { prod } = req.params

  const prodId = prod._id
  
  if (prod && user) {
    const newProduct = new ProductModel()
    newProduct.productName = prod.title,
    newProduct.image = prod.image,
    newProduct.url = prod.url,
    newProduct.prices.concat({prices: prod.price})

    UserModel.findOne({user}, (err, usr) => {
      if (err) return err
      usr.followedProducts.concat(newProduct._id)
    })

  } else {
    res.sendStatus(404).json('incorrect data sent')
  }
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