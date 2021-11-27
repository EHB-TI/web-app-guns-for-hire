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

router.post('/twitch/callback',async function (req, res) {
  // Successful authentication, redirect home.
  // get user from jwt
  const code = req.body.code
  const tmpToken = req.headers['authorization'].replace('Bearer ', '')
  const tmpUser = jwtService.decodeToken(tmpToken)

  axios.get(`https://id.twitch.tv/oauth2/validate`, {headers: { Authorization: 'Bearer ' + code }})
      .then((response) => {
        //{
        //"client_id": "wbmytr93xzw8zbg0p1izqyzzc5mbiz",
        //" ": "twitchdev",
        //"scopes": [
        //  "channel:read:subscriptions"
        //],
        //"user_id": "141981764",
        //"expires_in": 5520838
      //}
        /*curl -X GET 'https://api.twitch.tv/helix/users?login=twitchdev' \
-H 'Authorization: Bearer 2gbdx6oar67tqtcmt49t3wpcgycthx' \
-H 'Client-Id: wbmytr93xzw8zbg0p1izqyzzc5mbiz'

{
  "data": [
    {
      "broadcaster_type": "partner",
      "created_at": "2021-07-30T20:32:28Z",
      "description": "Supporting third-party developers building Twitch integrations from chatbots to game integrations.",
      "display_name": "TwitchDev",
      "id": "141981764",
      "login": "twitchdev",
      "offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/3f13ab61-ec78-4fe6-8481-8682cb3b0ac2-channel_offline_image-1920x1080.png",
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-300x300.png",
      "type": "",
      "view_count": 6652509
    }
  ]
}*/
        const foundUser = await User.updateOne(
          { email: tmpUser.email },
          {
            twitch: {
              id: req.client_id,
              diplayName: req.user.displayName,
              refreshToken: req.user.refreshToken,
            },
          }
        )
      })
      .catch((err) => {
        console.log(err)
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
