const express = require('express')

const { AuthHandler } = require('../handlers')

const router = express.Router()

router.route('/auth').post(AuthHandler.auth)

module.exports = router