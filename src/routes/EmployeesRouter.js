const router = require('express').Router()

const { EmployeesHandler } = require('../handlers')

router.route('/api/employees')
    .get(EmployeesHandler.getAllEmployees)
    .post(EmployeesHandler.createEmployee)

router.route('/api/employee/:id')
    .get(EmployeesHandler.getEmployee)
    .delete(EmployeesHandler.removeEmployee)
    .patch(EmployeesHandler.changeEmployee)

module.exports = router