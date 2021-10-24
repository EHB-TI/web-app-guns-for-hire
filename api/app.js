const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')
dotenv.config()
const port = process.env.PORT || 3000
const url = process.env.URL || 'http://localhost'
const localDb = 'mongodb://localhost/my_database'

const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
console.log(`⌛ Connecting to database...`)
mongoose
  .connect(process.env.DB_CONNECT || localDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`🔌 Connected to database`)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    // app.use(cors(corsOptions)) TODO: UNCOMMENT IN PRODUCTION
    app.use(helmet())

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.listen(port, () => {
      console.log(`⚡ Server running at ${url}:${port}`)
    })
  })
  .catch((err) => console.log(err))
