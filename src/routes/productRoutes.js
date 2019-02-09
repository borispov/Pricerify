const express = require('express')
const router = express.Router()

const { ProductModel, UserModel } = require('../models/index')
const { currentPrice, priceDecreased } = require('../utils/scraper/scrape')

// get single product from User Database.
router.get('/api/v1/getUserProduct/:id', (req, res) => {

  const _id = req.params.id
  const response = ProductModel.find({_id}, (err, product) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(product)
  })
  return response

})


// get all products from DB
router.get('/api/v1/getUserProduct/', async (req, res) => {

  const { user } = req.body

  const response = ProductModel.findAll({user}, (err, products) => {
    return err ? res.sendStatus(404).json(err) : res.sendStatus(200).json(products)
  })
  return response

})


// follow a product
// use case: add the product to my notifcation list, notify me about changes.
router.post('/api/v1/followProduct/:prod', async (req, res) => {

  const { user } = req.body
  const { prod } = req.params || req.body
  // TODO: Fix this behavior. only add item if it's unique, if item already exists, send appropriate response.

  if (prod && user) {
    const userData = await UserModel.findOne({email: user}).catch(err => console.log(err))
    if (userData.followedProducts.includes(prod)) res.sendStatus(404).json('Product is already inside followed products list')
    userData.followedProducts = userData.followedProducts.concat(prod)
    console.log(userData.followedProducts)
    userData.save()
    res.send('Successfully appended product to the followed products list')
  }
})

router.post('/api/v1/updatePrice/', async (req, res) => {
  
  const { URL, _id } = req.body
  const data = await currentPrice(URL)

  const newPrice = data.price
  let oldPrice
  ProductModel.findOneAndUpdate(
    { _id },
    {$push: { "prices": { "price": newPrice } }},
    (err, doc) => {
      if (err) res.sendStatus(400).json(err)
      console.log(doc)
      oldPrice = doc.prices.slice(-2)[0].price
      console.log(oldPrice)
      res.sendStatus(200).json(doc)
    }
  )

  // console.log(newPrice, oldPrice)
  // // add Price Comparison and Notifier here.
  // console.log(
  //   priceDecreased(oldPrice)(newPrice)
  // )

})


// Access The Scraper, to scrape one single product and return it's specific details. (Image, URL Path, Price, Title)
router.get('/api/v1/getProd/', async (req, res) => {
  if(!req.body.URL) throw new Error('no url provided')

  const url = req.body.URL.toString()

  let result = await currentPrice(url)
  res.send(result)
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
      // user.followedProducts.concat(prod._id)
      console.log(prod)
      const newProd = new ProductModel({
        productName: prod.title,
        image: prod.img,
        url: prod.path,
        prices: prod.price
      }).save().then(product => res.json(product)).catch(err => console.error(err))
    })
    
    // add product to DB and append the product's id to user's followed products
})


module.exports = router
