const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const app = express()


// middleware
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
const routes = require('./routes/')
app.use('/', routes)

// error handling
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error: error.message });
});


module.exports = app