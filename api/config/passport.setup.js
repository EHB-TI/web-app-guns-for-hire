'use strict'
const SpotifyStrategy = require('passport-spotify').Strategy
const twitchStrategy = require("passport-twitch-strategy").Strategy;

const User = require('../models/user')


const initialize = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })

  passport.use(new twitchStrategy({
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: `${
        process.env.APP_ENV === 'production'
          ? process.env.APP_URL
          : process.env.APP_URL + ':' + process.env.APP_PORT
      }/auth/twitch/callback`,
      scope: "user_read"
    },
    function(accessToken, refreshToken, profile, done) {
      const user = {refreshToken, profile}
      done(false, user)
    }
  ));
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: `${
          process.env.APP_ENV === 'production'
            ? process.env.APP_URL
            : process.env.APP_URL + ':' + process.env.APP_PORT
        }/auth/spotify/callback`,
      },
      async function (accessToken, refreshToken, expires_in, profile, done) {
        const dbUser = await User.findOne({ email: profile.emails[0].value })
        if (dbUser !== null) {
          done(false, dbUser)
        } else {
          const user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
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
      }
    )
  )
}

module.exports = initialize
