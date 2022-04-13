const router = require('express').Router()

const { CustomerController } = require('./controllers')

router.route('/customers')
    .get(CustomerController.index)

router.route('/api/customers')
    .post(CustomerController.createCustomer)
    .get(CustomerController.getAllCustomers)

router.route('/api/customer/:id')
    .get(CustomerController.getCustomer)
    .patch(CustomerController.updateCustomer)
    .delete(CustomerController.deleteCustomer)

module.exports = router