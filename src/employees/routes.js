const router = require('express').Router()

const { EmployeeController } = require('./controllers')

router.route('/employees')
    .get()
    .post(EmployeeController.createEmployee)

router.route('/employee/:id')
    .get()
    .delete()
    .patch()

module.exports = router