const router = require('express').Router()

const PurchaseController = require('./controllers/PurchaseController')
const purchaseSchema = require('./validators/purchaseSchema')

const { schemaValidatorMiddleware } = require('../application/middlewares')

router.route('/purchases')
    .post(schemaValidatorMiddleware(purchaseSchema, 'body'), PurchaseController.create)
    .get(PurchaseController.getAll)

router.route('/purchase/:id')
    .get(PurchaseController.get)
    .patch(PurchaseController.update)

module.exports = router
