const router = require('express').Router()

const { PurchaseController } = require('./controllers')

router
    .route('/purchases')
    .post(PurchaseController.createPurchase)
    .get(PurchaseController.getAllPurchases)

router
    .route('/purchases/:reader_card_num')
    .get(PurchaseController.getPurchaseByCostumer)

module.exports = router
