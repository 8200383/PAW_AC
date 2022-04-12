const router = require('express').Router()

const Purchase = require('./controllers/Purchase')

router.route('/purchases')
    .get(viewAllPurchases)
    .post(createPurchase)

router.route('/purchase/:id')
    .get(viewPurchase)
    .patch(updatePurchase)

module.exports = router
