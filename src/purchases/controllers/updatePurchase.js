class updatePurchase {
    constructor() {}

    handle(req, res, next) {
        res.json({ status: 'added' })
    }
}

module.exports = new updatePurchase().handle
