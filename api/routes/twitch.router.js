'use strict'
const express = require('express')
const router = express.Router()
const errorResponse = require('../helpers/error-response')
const successResponse = require('../helpers/success-response')
const jwtService = require('../helpers/jwt.service')
const User = require('../models/user')
const { default: axios } = require('axios')

module.exports = router

//all streamers
router.post('/findAllStreamers', jwtService.authenticateToken, async(req, res) => {
   const users = await User.find({twitch:{$exists: true}})
   console.log(users);
})
//one streamer
router.post('/findStreamer', jwtService.authenticateToken, async(req, res) => {
    const users = await User.find({twitch:{displayName:req.body.displayName}})
    console.log(users);
 })
//go to page streamer
router.get('/findStreamer', jwtService.authenticateToken, (req, res) => {
    
})