const router = require('express').Router()
const { DashboardHandler } = require('../handlers')
const passport = require('passport')

router.route('/')
    .get(DashboardHandler.index)

router.route('/protected').get(
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        return res.json({ 'status': 'ok' })
    },
)

module.exports = router