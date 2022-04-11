class viewPurchase {
    constructor() {}

    handle(req, res, next) {
        res.json({ status: 'added' })
    }
}

module.exports = new viewPurchase().handle
