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

// follow a product
// use case: add the product to my notifcation list, notify me about changes.
router.get('/api/v1/followProduct/:prod', async (req, res) => {
  const { user } = req.body
  const { prod } = req.params || req.body

  const prodId = prod._id
  
  if (prod && user) {
    ProductModel.findOne({_id: prodId})
      .then((response) => {
        UserModel.findOne({user}).then(usr => {
          usr.followedProducts.concat(newProduct._id).catch(err => console.error(err))
        }).catch(err => console.error(err))
      })
  } else {
    res.sendStatus(404).json('incorrect data sent')
  }
})

// get 
router.get('/api/v1/getProd/', async (req, res) => {
  if(!req.body.URL) throw new Error('no url provided')
  const url = req.body.URL.toString()
  let result = await currentPrice(url)
  res.send(result)
})

// get all products from DB
router.get('/api/v1/getUserProduct/', async (req, res) => {
  const { user } = req.body

  const response = ProductModel.findAll({user}, (err, products) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(products)
  })
  return response
})

// use case: "Add this product to my list"  -- internally, adds it to the DB
router.post('/api/v1/addProduct', (req, res) => {
  const errors = {}
  const { user, prod } = req.body
  // TODO: handle exception better.
  if (!user || !prod) throw new Error('No user or no product provided')

  UserModel.findOne({email: user})
    .then(user => {
      if (!user) {
        errors.email = 'User Not Found'
        return res.status(404).json(errors)
      }
      user.followedProducts.concat(prod._id)
      console.log(prod)
      const newProd = new ProductModel({
        productName: prod.title,
        image: prod.img,
        url: prod.path,
        prices: prod.prices
      }).save().then(_ => res.json('Successfully Added Item')).catch(err => console.error(err))
    })
    
    // add product to DB and append the product's id to user's followed products
   
})


module.exports = router
