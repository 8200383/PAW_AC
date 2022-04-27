const router = require('express').Router()
const { DashboardHandler } = require('../handlers')
const { authMiddleware } = require('../middlewares')

router.route('/')
    .get(DashboardHandler.index)

router.route('/protected').get(
    authMiddleware,
    (req, res) => {
        return res.json({ 'status': 'ok' })
    },
)

module.exports = router