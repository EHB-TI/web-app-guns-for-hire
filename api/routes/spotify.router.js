'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const axios = require('axios')
const jwtService = require('../helpers/jwt.service')
const User = require('../models/user')

router.get('/currently-playing', async (req, res) => {
  // get user from jwt
  const accessToken = req.headers['authorization'].replace('Bearer ', '')
  const jwtUser = jwtService.verifyToken(accessToken)
  const user = await User.findOne({ email: jwtUser.email })

  // get spotify refreshToken
  const refreshToken = user.spotify.refreshToken
  //  request accessToken

  const data = new URLSearchParams()
  data.append('grant_type', 'refresh_token')
  data.append('refresh_token', refreshToken)

  const resp = await axios.post('https://accounts.spotify.com/api/token', data, {
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  const spotifyToken = resp.data.access_token

  const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${spotifyToken}` },
  })

  if (response.data === '') {
    res.status(400).json(errorResponse(res.statusCode, 'No song is playing'))
  }

  const song = {
    imageUrl: response.data.item.album.images[0].url,
    name: response.data.item.name,
    uri: response.data.item.uri,
  }

  const uUser = await User.updateOne({ email: jwtUser.email }, { currentlyPlayingTrack: song })

  res.status(200).json(successResponse(res.statusCode, uUser))
})

module.exports = router
