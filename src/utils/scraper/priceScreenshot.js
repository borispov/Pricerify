const puppeteer = require('puppeteer')
const markets = require('./markets/index')

const stripCurrency = price => price.slice(1)

function filterSel(currentMarket) {
  let market = {}

  let name = currentMarket instanceof Array 
    ? currentMarket.join('').toLowerCase()
    : currentMarket.toLowerCase()
  switch (name) {
    case 'amazon':
      market = {
        PRICE_ID: markets.AMAZON_PRODUCT_PRICE,
        PRODUCT_TITLE: markets.AMAZON_PRODUCT_TITLE,
        PRODUCT_IMAGE: markets.AMAZON_PRODUCT_IMAGE
      }
      return market
  
    case 'aliexpress':
      market = {
        PRICE_ID: markets.ALI_PRODUCT_TITLE,
        PRODUCT_TITLE: markets.ALI_PRODUCT_TITLE,
        PRODUCT_IMAGE: markets.ALI_PRODUCT_IMAGE
      }
    // Yet To Be Implemented. Maybe in the future.
    case 'ebay':
      market = {
        PRICE_ID: markets.EBAY_PRODUCT_TITLE,
        PRODUCT_TITLE: markets.EBAY_PRODUCT_TITLE,
        PRODUCT_IMAGE: markets.EBAY_PRODUCT_IMAGE
      }
    default:
      return market
  }
}

module.exports = async function (URL, market) {

  console.log(URL)
  if (!URL) {
    throw new Error ('Argument is not a valid URL')
  }

  const browser = await puppeteer.launch({
    args: ['--enable-features=NetworkService'],
    ignoreHTTPSErrors: true
  })

  let marketSelectors = filterSel(market)
  
  const { PRICE_ID, PRODUCT_TITLE, PRODUCT_IMAGE } = marketSelectors
  const page = await browser.newPage()
  await page.setJavaScriptEnabled(false)
  await page.setRequestInterception(true)
    
  page.on('request', (req) => {
    if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
      req.abort()
    } else {
        req.continue()
    }
  })

  await page.goto(URL, {
    timeout: 300000
  })

  let getPrice = await page.$(`#${PRICE_ID}`) !== null
    ? (
        console.log('found'),  
        await page.evaluate((sel) => document.getElementById(sel).innerHTML, PRICE_ID)
      )
    : (
        console.log('not found'),
        await page.evaluate((sel) => document.getElementById(sel).innerHTML, 'priceblock_dealprice')
      )
      
  const getImg = await page.evaluate((img) => document.getElementById(img).src, PRODUCT_IMAGE)
  const getTitle = await page.evaluate((sel) => document.getElementById(sel).innerHTML, PRODUCT_TITLE)

  if ( isNaN(getPrice[0]) ) {
    const strippedPrice = stripCurrency(getPrice)
    const currency = getPrice[0]
    return {
      currency, 
      price: strippedPrice,
      title: getTitle.trim(),
      img: getImg.trim(),
      url: URL
    }
    return strippedPrice
  }

  await browser.close()

}