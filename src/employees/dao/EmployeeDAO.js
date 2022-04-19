const { Employee } = require('../../employees/models')
const { APIError } = require('../../application/helpers')

/**
 * Add employee
 * @param {Object} body
 * @returns {Promise<void>}
 */
const addEmployee = async (body) => {
    try {
        const employee = new Employee(body)
        await employee.validate()
        await employee.save()
    } catch (e) {
        throw new APIError(e, 500)
    }
}

module.exports = {
    addEmployee,
}