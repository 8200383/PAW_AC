const router = require('express').Router()
const { DashboardHandler } = require('../handlers')
const { authMiddleware } = require('../middlewares')

router.route('/').get(DashboardHandler.index)
router.route('/customers').get(DashboardHandler.customers)
router.route('/employees').get(DashboardHandler.employees)
router.route('/purchases').get(DashboardHandler.purchases)
router.route('/books').get(DashboardHandler.books)

router.route('/protected').get(
    authMiddleware,
    (req, res) => {
        return res.json({ 'status': 'ok' })
    },
)

module.exports = router