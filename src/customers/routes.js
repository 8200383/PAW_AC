const router = require('express').Router()

const { CustomerController } = require('./controllers')

router.route('/customers')
    .get()

router.route('/api/customers')
    .post(CustomerController.createCustomer)
    .get(CustomerController.getAllCustomers)

router.route('/api/customer/:id')
    .get()
    .patch()
    .delete()

module.exports = router