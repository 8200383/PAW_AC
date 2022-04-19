const router = require('express').Router()

const { CustomerController } = require('./controllers')

router.route('/customers')
    .get()

router.route('/api/customers')
    .post(CustomerController.createCustomer)
    .get(CustomerController.getAllCustomers)

router.route('/api/customer/:reader_card_num')
    .get(CustomerController.getCustomer)
    .patch(CustomerController.patchCustomerController)
    .delete()

module.exports = router