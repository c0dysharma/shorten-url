import express from 'express'
import mongoose from 'mongoose';
import morgan from 'morgan'

import config from './config.js'
import crudRoutes from './router/crud.js'

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use('/', crudRoutes)


async function start() {
  try {
    await mongoose.connect(`mongodb://127.0.0.1/shorten-url`)
    console.log('Databse Connected');
    app.listen(config.port, config.ip, () => {
      console.log(`Listening on: ${config.ip}:${config.port}`)
    })
  } catch (error) {
    console.error('Server Startup error->', error)
    process.exit(1)
  }
}
start()