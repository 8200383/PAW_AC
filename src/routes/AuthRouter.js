const express = require('express')
const passport = require('passport')

const { AuthHandler } = require('../handlers')

const router = express.Router()

router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    AuthHandler.signUp,
)

router.post('/login', AuthHandler.signIn)

module.exports = router