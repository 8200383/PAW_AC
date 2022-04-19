const { Request, Response } = require('express')
const { EmployeeDAO } = require('../../employees/dao')
const { APIError } = require('../../application/helpers')
/**
 * Create employee
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const createEmployee = async (req, res, next) => {
    try {
        await EmployeeDAO.addEmployee(req.body)
        res.status(200).json({ message: 'Employee added' })
    } catch (e) {
        next(new APIError(e, e.statusCode))
    }
}

module.exports = {
    createEmployee,
}