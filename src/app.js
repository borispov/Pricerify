const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const app = express()


// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routes
const routes = require('./routes/index')
app.use('/', routes.productRoutes)

app.all('*', (req, res) =>{
  res.end('Trying to use undefined route, please stick to the API routes.')
})

// error handling
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error: error.message });
});

module.exports = app