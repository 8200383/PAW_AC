const router = require('express').Router()

router.route('/customers')
    .post()
    .get()

router.route('/customer/:id')
    .get()
    .patch()
    .delete()

module.exports = router