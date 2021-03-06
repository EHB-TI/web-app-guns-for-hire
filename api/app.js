'use strict'
// app imports
const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')
var xss = require('xss-clean')
var hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')

// app config
dotenv.config()
const port = process.env.APP_PORT || 3000
const url = process.env.APP_URL || 'http://localhost'
const environment = process.env.APP_ENV || 'development'
const localDb = 'mongodb://localhost/my_database'

console.log('Environment', environment)

console.log(`⌛ Connecting to database...`)
mongoose
  .connect(process.env.DB_CONNECT || localDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`🔌 Connected to database`)

    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
    if (environment === 'production') app.set('trust proxy', 1)

    // make app -> api
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan('dev'))

    app.use(cors())
    if (environment === 'production') {
      // security
      app.use(helmet())
      app.use(xss())
      app.use(hpp())
      app.use(
        mongoSanitize({
          onSanitize: ({ req, key }) => {
            console.warn(`This request[${key}] is sanitized`, req)
          },
        })
      )
      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      })
      app.use(limiter)
    }

    // routes
    app.use(require('./routes/api.router'))

    // run app
    app.listen(port, () => {
      console.log(`⚡ Server running at ${url}:${port}`)
    })
  })
  .catch((err) => console.log(err))
