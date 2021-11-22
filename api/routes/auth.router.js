'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const passport = require('passport')
const initializePassport = require('../config/passport.setup')

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
    res.redirect('/')
  }
)

router.get(
  "/twitch/callback", 
  passport.authenticate("twitch", { failureRedirect: "/linktwitch" }), 
  function(req, res) {
  // Successful authentication, redirect home.
  //get user from jout

  console.log(req.user);
  //add to user
  
  res.redirect("/");
});

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
