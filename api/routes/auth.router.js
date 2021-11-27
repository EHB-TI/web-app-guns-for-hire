'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const jwtService = require('../helpers/jwt.service')
const User = require('../models/user')
const spotifyWebApi = require('spotify-web-api-node')

const spotifyCredentials = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/home/',
}

router.post('/spotify', (req, res) => {
  let spotifyApi = new spotifyWebApi(spotifyCredentials)
  const code = req.body.code

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      spotifyApi.setAccessToken(data.body.access_token)
      spotifyApi
        .getMe()
        .then(async (me) => {
          const dbUser = await User.findOne({ email: me.body.email })
          if (dbUser !== null) {
            const token = jwtService.generateAccessToken(dbUser)
            res.status(200).json(successResponse(res.statusCode, { accessToken: token }))
          } else {
            const user = new User({
              name: me.body.display_name,
              email: me.body.email,
              spotify: {
                id: me.body.id,
                refreshToken: data.body.refresh_token,
              },
            })
            let newUser, error
            try {
              newUser = user.save()
            } catch (err) {
              error = err
            }
            const token = jwtService.generateAccessToken(newUser)
            res.status(200).json(successResponse(res.statusCode, { accessToken: token }))
          }
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.post('/token/verify', (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ', '')
  try {
    const jwtObj = jwtService.verifyToken(token)
    console.log(jwtObj.exp)
    const expDate = new Date(jwtObj.exp * 1000)
    const now = new Date(Date.now())
    console.log('now', now.toUTCString())
    console.log('exp', expDate.toUTCString())
    if (expDate < now) {
    } else {
      res.status(200).json(successResponse(res.statusCode, { expired: false }))
    }
  } catch (errors) {
    res.status(200).json(successResponse(res.statusCode, { expired: true, errors }))
  }
})

router.get('/me', jwtService.authenticateToken, async (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ', '')
  try {
    const jwtObj = jwtService.verifyToken(token)
    const dbUser = await User.findOne({ email: jwtObj.email })
    res.status(200).json(successResponse(res.statusCode, { user: dbUser }))
  } catch (err) {
    res.status(406).json(errorResponse(res.statusCode, { err }))
  }
})

module.exports = router
