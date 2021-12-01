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
router.get('/findAllStreamers', jwtService.authenticateToken, async(req, res) => {
    const token = req.headers['authorization'].replace('Bearer ', '')
    try {
        const jwtObj = jwtService.verifyToken(token)
        const users = await User.find({"twitch.displayName":{$exists: true}})
        res.status(200).json(
        successResponse(res.statusCode, {
            found:true,
            users: users.map(x=> x.twitch.displayName),
        })
      )
    } catch (errors) {
      res.status(400).json(errorResponse(res.statusCode, { errors }))
    }
})
//one streamer
router.post('/findStreamer', jwtService.authenticateToken, async(req, res) => {
    const token = req.headers['authorization'].replace('Bearer ', '')
    try {
        const jwtObj = jwtService.verifyToken(token)
        const streamer = await User.find({"twitch.displayName": req.body.streamer})
        res.status(200).json(
          successResponse(res.statusCode, {
              found:true,
              user: streamer[0].spotify.id,
          })
        )
    } catch (errors) {
      res.status(400).json(errorResponse(res.statusCode, { errors }))
    }
})
//go to page streamer
router.get('/findStreamer', jwtService.authenticateToken, (req, res) => {
    
})