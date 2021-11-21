'use strict'
const SpotifyStrategy = require('passport-spotify').Strategy
const User = require('../models/user')

const initialize = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })

  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: 'http://localhost:' + process.env.APP_PORT + '/auth/spotify/callback',
      },
      function (accessToken, refreshToken, expires_in, profile, done) {
        const user = new User({
          name: profile.displayName,
          spotify: {
            id: profile.id,
            refreshToken,
          },
        })
        let newUser, error
        try {
          newUser = user.save()
        } catch (err) {
          error = err
        }
        done(error, newUser)
      }
    )
  )
}

module.exports = initialize
