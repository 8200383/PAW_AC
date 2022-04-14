const router = require('express').Router()

const { PurchaseController } = require('./controllers')

router.route('/purchases')
    .post(PurchaseController.create)
    .get(PurchaseController.getAll)

router.route('/purchase/:id')
    .get(PurchaseController.get)
    .patch(PurchaseController.update)

module.exports = router
