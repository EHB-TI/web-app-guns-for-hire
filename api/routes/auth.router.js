'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const jwtService = require('../helpers/jwt.service')
const User = require('../models/user')
const spotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')

const spotifyCredentials = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URL,
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
          const dbUser = await User.findOne({
            email: me.body.email
          })
          console.log(dbUser);
          if (dbUser !== null) {
            console.log("here");
            const token = jwtService.generateAccessToken(dbUser)
            res.status(200).json(successResponse(res.statusCode, {
              accessToken: token
            }))
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
            res.status(200).json(successResponse(res.statusCode, {
              accessToken: token
            }))
          }
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.post('/twitch', jwtService.authenticateToken, async function (req, res) {
  const code = req.body.code
  const resp = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.TWITCH_REDIRECT_URL}`
  )
  console.log(resp.data)

  const response = await axios.get("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: 'Bearer ' + resp.data.access_token,
      "Client-Id": process.env.TWITCH_CLIENT_ID
    }
  })
  console.log(response.data.data[0].display_name);
  const twitchUser = response.data.data[0];
  const token = req.headers['authorization'].replace('Bearer ', '')
  try {
    const jwtObj = jwtService.verifyToken(token)
    const foundUser = await User.updateOne({
      email: jwtObj.email
    }, {
      role:'streamer',
      twitch: {
        id: twitchUser.id,
        diplayName: twitchUser.display_name,
        refreshToken: resp.data.refresh_token,
      },
    })

    res.status(200).json(successResponse(res.statusCode, {
      linked: true
    }))
  } catch (errors) {}

})

router.post('/token/verify', jwtService.authenticateToken, (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ', '')
  try {
    const jwtObj = jwtService.verifyToken(token)
    console.log(jwtObj.exp)
    const expDate = new Date(jwtObj.exp * 1000)
    const now = new Date(Date.now())
    console.log('now', now.toUTCString())
    console.log('exp', expDate.toUTCString())
    if (expDate < now) {} else {
      res.status(200).json(successResponse(res.statusCode, {
        expired: false
      }))
    }
  } catch (errors) {
    res.status(200).json(successResponse(res.statusCode, {
      expired: true,
      errors
    }))
  }
})

router.get('/me', jwtService.authenticateToken, async (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ', '')
  try {
    const jwtObj = jwtService.verifyToken(token)
    const dbUser = await User.findOne({
      email: jwtObj.email
    })
    res.status(200).json(successResponse(res.statusCode, {
      user: dbUser
    }))
  } catch (err) {
    res.status(406).json(errorResponse(res.statusCode, {
      err
    }))
  }
})

module.exports = router