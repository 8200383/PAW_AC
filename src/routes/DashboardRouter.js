const router = require('express').Router()

const { DashboardHandler } = require('../handlers')

router.route('/').get(DashboardHandler.index)
router.route('/login').get(DashboardHandler.login)
module.exports = router