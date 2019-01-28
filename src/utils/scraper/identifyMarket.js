const webStores = [
  'amazon',
  'aliexpress',
  'ebay'
]

const validMarket = URL => domain => domain === URL

const identifyMarket = URL => webStores.find(x => URL.includes(x))

const identifyMarket2 = URL => webStores.filter(validMarket(URL))

module.exports = identifyMarket