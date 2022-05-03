const router = require('express').Router()

const { PurchasesHandler } = require('../handlers')

router
    .route('/api/purchases')
    .post(PurchasesHandler.createPurchase)
    .get(PurchasesHandler.getAllPurchases)

router
    .route('/api/purchases/:reader_card_num')
    .get(PurchasesHandler.getPurchaseByCostumer)

module.exports = router
