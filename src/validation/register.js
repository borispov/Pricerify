const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
  let errors = {}
  
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  console.log(data)
  if(!Validator.isEmail(data.email)){
    errors.email = 'Email is invalid'
  }
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email field is must'
  }
  if(!Validator.isLength(data.password, {min: 6, max: 30})){
    errors.password = 'Must include 6 character at least, and maximum 30'
  }
  if(Validator.isEmpty(data.password)){
    errors.password = 'password is a must'
  }

  console.log(errors)
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
