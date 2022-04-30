const router = require('express').Router()

const { DashboardHandler } = require('../handlers')

router.route('/').get(DashboardHandler.index)

module.exports = router