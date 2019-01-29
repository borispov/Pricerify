const isURL = require('./isURL')
const identifyMarket = require('./identifyMarket')
const priceScreenshot = require('./priceScreenshot')

// class ScrapeService {

//   constructor() {
//     this.currentPrice = this.currentPrice.bind(this)
//     this.isDomainSupported = this.isDomainSupported.bind(this)
//   }

//   isDomainSupported(URL){
//     // return true
//     return identifyMarket(URL)
//   }

//   async currentPrice(URL) {
    
//     let isValidUrl = await isURL(URL)
//     let theMarket = this.isDomainSupported(URL)
//     try {
//       if ( !isValidUrl ) throw new Error('invalid url request')
//       if ( !theMarket ) throw new Error('This domain is not supported by Deal-Stalk')
//       return priceScreenshot(URL, theMarket)    
//     } catch(err) {
//         return err
//     }
//   }
// }

// Export The Class
// module.exports = ScrapeService

//
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

module.exports = currentPrice