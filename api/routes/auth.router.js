'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const passport = require('passport')
const initializePassport = require('../config/passport.setup')
const jwtService = require('../helpers/jwt.service')
const User = require('../models/user')

initializePassport(passport)

router.use(passport.initialize())

router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-read-currently-playing'],
    showDialog: true,
  })
)

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function (req, res) {
    const token = jwtService.generateAccessToken(req.user)
    res.status(200).json(successResponse(res.statusCode, { accessToken: token }))
  }
)

router.get(
  '/twitch/callback',
  jwtService.authenticateToken,
  passport.authenticate('twitch', { failureRedirect: '/linktwitch' }),
  async function (req, res) {
    // Successful authentication, redirect home.
    // get user from jwt
    const tmpToken = req.headers['authorization'].replace('Bearer ', '')
    const tmpUser = jwtService.decodeToken(tmpToken)
    const foundUser = await User.updateOne(
      { email: tmpUser.email },
      {
        twitch: {
          id: req.user.id,
          diplayName: req.user.displayName,
          refreshToken: req.user.refreshToken,
        },
      }
    )
    res.status(200).json(successResponse(res.statusCode, { user: foundUser }))
  }
)

router.get('/logout', jwtService.authenticateToken, function (req, res) {
  req.logout()
  res.status(200).json(successResponse(res.statusCode, 'You are logged out successfully'))
})

module.exports = router
