const { Request, Response } = require('express')
const { Employee } = require('../schemas')

/**
 * Create employee
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const createEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body)
        res.status(200).json({
            message: 'Employee added',
            employee: employee,
        })
    } catch (e) {
        return next(e)
    }
}

/**
 * Get all employees
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find({})

        const output = employees.map((employeee) => {
            return {
                employee_no: employeee.employee_no,
                name: employeee.name,
                nif: employeee.nif ?? ' ',
                cell_phone: employeee.cell_phone ?? ' ',
                postal_code: employeee.postal_code ?? ' ',
            }
        })

        return res.status(200).json({ employees: output })
    } catch (e) {
        return next(e)
    }
}

/**
 * Remove employee
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const removeEmployee = async (req, res, next) => {
    try {
        await Employee.deleteOne({ employee_no: req.params['id'] })
        res.status(200).json({ message: 'Employee removed' })
    } catch (e) {
        return next(e)
    }
}

/**
 * Get employee
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({ employee_no: req.params['id'] })
        res.status(200).json({ employee })
    } catch (e) {
        return next(e)
    }
}

/**
 * change employee
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
const changeEmployee = async (req, res, next) => {
    try {
        await Employee.updateOne(
            { employee_no: req.params['id'] },
            { $set: req.body },
            { runValidators: true },
        )
        res.status(200).json({ message: 'Employee changed' })
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    removeEmployee,
    getEmployee,
    changeEmployee,
}