const router = require('express').Router()

const { PurchasesHandler } = require('../handlers')

router
    .route('/purchases')
    .post(PurchasesHandler.createPurchase)
    .get(PurchasesHandler.getAllPurchases)

router
    .route('/purchases/:reader_card_num')
    .get(PurchasesHandler.getPurchaseByCostumer)

module.exports = router
