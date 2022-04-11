const router = require('express').Router()

const viewAllPurchases = require('./controllers/viewAllPurchases.js')
const createPurchase = require('./controllers/createPurchase.js')

const viewPurchase = require('./controllers/viewPurchase.js')
const updatePurchase = require('./controllers/updatePurchase.js')

router.route('/purchases').get(viewAllPurchases).post(createPurchase)
router.route('/purchase/:id').get(viewPurchase).patch(updatePurchase)

module.exports = router
