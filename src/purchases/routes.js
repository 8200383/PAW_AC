const router = require('express').Router()

const PurchaseController = require('./controllers/PurchaseController')
const validatePurchaseDto = require('./middlewares/validatePurchaseDto')
const purchaseSchema = require('./schemas/purchaseSchema')

router
    .route('/purchases')
    .post(validatePurchaseDto(purchaseSchema), PurchaseController.create)
    .get(PurchaseController.getAll)

router
    .route('/purchase/:id')
    .get(PurchaseController.get)
    .patch(PurchaseController.update)

module.exports = router
