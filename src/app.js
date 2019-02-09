const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const app = express()
const passport = require('passport')

app.disable('x-powered-by')
// middleware

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize())
require('./passport')(passport)

// routes
const { userRoutes, productRoutes } = require('./routes/index')
app.use('/', userRoutes, productRoutes)

app.all('*', (req, res) =>{
  res.end('Trying to use undefined route, please stick to the API routes.')
})

// error handling
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error: error.message });
});

module.exports = app
