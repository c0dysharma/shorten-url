const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan')

const config = require('./config')
const crudRoutes = require('./router/crud')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use('/', crudRoutes)


async function start() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/shorten-url');
    app.listen(config.port, () => {
      console.log(`Listening on PORT: ${config.port}`)
    })
  } catch (error) {
    console.error('Server Startup error->', error)
    process.exit(1)
  }
}
start()