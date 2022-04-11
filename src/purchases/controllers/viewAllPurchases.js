class viewAllPurchases {
    constructor() {}

    handle(req, res, next) {
        res.json({ status: 'added' })
    }
}

module.exports = new viewAllPurchases().handle
