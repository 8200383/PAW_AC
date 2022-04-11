class createPurchase {
    constructor() {}

    handle(req, res, next) {
        res.json({ status: 'added' })
    }
}

module.exports = new createPurchase().handle
