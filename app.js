if (!process.env.NODE_ENV) {
  require('dotenv').config()
}
const express = require("express")
const app = express();
const routers = require('./routers/index')
const cors = require('cors')

const { errorHandler } = require('./middlewares')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routers)
app.use(errorHandler)

module.exports = app