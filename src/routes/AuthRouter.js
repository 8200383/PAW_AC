const express = require('express')

const { AuthHandler } = require('../handlers')

const router = express.Router()

router.post('/signup', AuthHandler.signUp)
router.post('/signin', AuthHandler.signIn)

module.exports = router