const express = require('express')
const session = require('express-session')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')

const SALT_R = 9
const User = require('../models/User')

router.post('/api/v1/register', async (req, res) => {
  console.log('Go Reg me a Usah!')
  const { errors, isValid } = validateRegisterInput(req.body)
  const { email, password } = req.body

  if (!isValid) return res.status(400).json(errors)

  console.log('response seems valid.. procceeding on!')

  User.findOne({ email: email })
    .then(user => {
      console.log(!user)
      if (user) res.status(400).json({email: 'Email already exists!'})
      else {
        const newUser = new User({
          email,
          password,
        })
        bcrypt.genSalt(SALT_R, async (err, salt) => {
          if (err) console.error('Error bCrypting: ', err)
          else {
            bcrypt.hash(newUser.password, salt, async (err,hash) => {
              if (err) {
                console.error('err hashing...', err)
              }
              else {
                newUser.password = hash
                const user = await newUser.save().then(user => user)
                res.json(user)
              }
            })
          }
        })
      }
    })    

})



router.post('/api/v1/login', ( req, res ) => {
  console.log('- Lets Log It In! Shall we?')
  const { errors, isValid } = validateLoginInput(req.body)

  if (!isValid) return res.status(400).json(errors)

  const { email, password } = req.body

  User.findOne({email})
    .then(user => {
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors)
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            const payload = {
              id: user.id,
              email: user.email
            }
            jwt.sign(payload, 'secret', {expiresIn: 3600}, (err, token) => {
              err ? console.error('error', err) : res.json({
                success: true,
                token: `Bearer ${token}`
              })
            })
          } else {
              console.log('not a match?')
              errors.password = 'Incorrect Password';
              return res.status(400).json(errors);
          }
        })
    })
})


module.exports = router
