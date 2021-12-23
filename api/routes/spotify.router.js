'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const axios = require('axios')
const jwtService = require('../helpers/jwt.service')
const User = require('../models/user')
const restfulRoute = require('../helpers/restful-route')

router
  .route('/currently-playing')
  .get(async (req, res) => {
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

    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      })

      if (response.data === '') {
        console.log('no data')
        res.status(400).json(errorResponse(res.statusCode, 'No song is playing'))
      } else {
        const originalUri = response.data.item.external_urls.spotify
        const id = originalUri.substring(originalUri.lastIndexOf('/') - 5, originalUri.length)
        console.log(id)
        const song = {
          uri: `https://open.spotify.com/embed/${id}`,
        }

        const uUser = await User.updateOne(
          { email: jwtUser.email },
          { currentlyPlayingTrack: song }
        )

        res.status(200).json(successResponse(res.statusCode, uUser))
      }
    } catch (error) {
      console.log(error)
      res.status(400).json(errorResponse(res.statusCode, 'No song is playing'))
    }
  })
  .delete(async (req, res) => {
    try {
      const accessToken = req.headers['authorization'].replace('Bearer ', '')
      const jwtUser = jwtService.verifyToken(accessToken)
      const user = await User.findOne({ email: jwtUser.email })
      const result = await User.updateOne({ email: user.email }, { currentlyPlayingTrack: {} })
      res.status(200).json(successResponse(res.statusCode, result))
    } catch (error) {
      res.status(400).json(errorResponse(res.statusCode, { error }))
    }
  })
  .all(restfulRoute)

module.exports = router
