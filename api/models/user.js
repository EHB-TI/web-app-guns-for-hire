'use strict'
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  spotify: {
    id: { type: String, required: true },
    refreshToken: { type: String, required: true },
    currentlyPlayingTrack: {},
  },
  twitch:{
    twitchId:{type: String},
    diplayName:{type: String},
    refreshToken: { type: String},
  },
  role: { type: String, enum: ['watcher', 'streamer'], default: 'watcher' },
})

module.exports = mongoose.model('User', userSchema)
