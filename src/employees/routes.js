const router = require('express').Router()

const CreateEmployee = require('./controllers/CreateEmployee.js')
const ViewAllEmployees = require('./controllers/ViewAllEmployees.js')

const ViewEmployee = require('./controllers/ViewEmployee.js')
const DeleteEmployee = require('./controllers/DeleteEmployee.js')
const UpdateEmployee = require('./controllers/UpdateEmployee.js')

router.route('/employees')
    .get(ViewAllEmployees)
    .post(CreateEmployee)

router.route('/employee/:id')
    .get(ViewEmployee)
    .delete(DeleteEmployee)
    .patch(UpdateEmployee)

module.exports = router