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
  twitch:{
    id:{type: String , unique:true},
    diplayName:{type: String},
    refreshToken: { type: String},
  }
})

module.exports = mongoose.model('User', userSchema)
