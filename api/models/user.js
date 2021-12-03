'use strict'
const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImageUrl: { type: String, required: true },
  spotify: {
    id: { type: String, required: true },
    refreshToken: { type: String, required: true },
    currentlyPlayingTrack: {},
  },
  twitch: {
    id: { type: String, required: true, unique: true, default: crypto.randomUUID() },
    displayName: { type: String, required: false },
    refreshToken: { type: String, required: false },
  },
  role: { type: String, enum: ['watcher', 'streamer'], default: 'watcher' },
})

module.exports = mongoose.model('User', userSchema)
