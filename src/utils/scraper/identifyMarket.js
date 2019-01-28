const webStores = [
  'amazon',
  'aliexpress',
  'ebay'
]

const validMarket = URL => domain => domain === URL

const identifyMarket = URL => webStores.filter(validMarket(URL))

module.exports = identifyMarket