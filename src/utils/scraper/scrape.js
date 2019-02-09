const isURL = require('./isURL')
const identifyMarket = require('./identifyMarket')
const priceScreenshot = require('./priceScreenshot')

const priceDecreased = p1 => p2 => p2 < p1
// const shortenAmazon = url => url.split('/')

const isDomainSupported = URL => identifyMarket(URL)

const currentPrice = async URL => {
  let isValidUrl = await isURL(URL)
  let theMarket = isDomainSupported(URL)
  try {
    if ( !isValidUrl ) throw new Error('invalid url request')
    if ( !theMarket ) throw new Error('This domain is not supported by Deal-Stalk')
    return priceScreenshot(URL, theMarket)    
  } catch(err) {
    return err
  }
}

module.exports = { 
  priceDecreased,
  currentPrice
}