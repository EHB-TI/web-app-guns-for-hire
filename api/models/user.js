'use strict'
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  spotify: {
    id: { type: String, required: true },
    refreshToken: { type: String, required: true },
    currentlyPlayingTrack: {},
  },
})

module.exports = mongoose.model('User', userSchema)
