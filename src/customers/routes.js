const router = require('express').Router()

router.route('/customers')
    .post()
    /**
     * @swagger
     * /:
     *   get:
     *     description:  Endpoint for everything
     */
    .get()

router.route('/customer/:id')
    .get()

module.exports = router