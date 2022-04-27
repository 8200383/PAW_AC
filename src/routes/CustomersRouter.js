const router = require('express').Router()

const { CustomersHandler } = require('../handlers')

router.route('/api/customers')
    .get(CustomersHandler.getAllCustomers)
    .post(CustomersHandler.createCustomer)

router.route('/api/customer/:reader_card_num')
    .get(CustomersHandler.getCustomer)
    .patch(CustomersHandler.patchCustomer)
    .delete(CustomersHandler.deleteCustomer)

module.exports = router