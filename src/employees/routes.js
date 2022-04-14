const router = require('express').Router()

const Crontroller = require('./controllers/ControllerEmployee.js')

router.route('/employees')
    .get(Crontroller.ViewAllEmployees)
    .post(Crontroller.CreateEmployee)

router.route('/employee/:id')
    .get(Crontroller.ViewEmployee)
    .delete(Crontroller.DeleteEmployee)
    .patch(Crontroller.UpdateEmployee)

module.exports = router