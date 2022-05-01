const express = require('express')

const { AuthHandler } = require('../handlers')

const router = express.Router()

router.route('/api/auth').post(AuthHandler.auth)
router.route('/api/account/:email').get(AuthHandler.getAccountInfo)


module.exports = router