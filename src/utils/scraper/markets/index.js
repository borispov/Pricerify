const amazonProducts = require('./amazon')
const aliexpressProducts = require('./aliexpress')

module.exports = {
  ...amazonProducts,
  ...aliexpressProducts
}