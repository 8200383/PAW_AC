'use strict'

const JsonSchemaValidator = require('ajv')
const createHttpError = require('http-errors')

/**
 * Schema validation function
 *
 * @param {Request} req
 * @param {Object} schema
 * @param {string} kind
 * @returns {{isValid: boolean, error: string}}
 */
const validateSchema = (req, schema, kind) => {
    const ajv = new JsonSchemaValidator({
        allErrors: true,
        coerceTypes: kind === 'params', // only strings allows in params
    })

    const validator = ajv.compile(schema)

    return {
        isValid: validator(req[`${kind}`]),
        error: ajv.errorsText(validator.errors),
    }
}

/**
 * Schema validator middleware
 *
 * @param {Object} schema
 * @param {string} kind
 * @returns {Function}
 */
const schemaValidatorMiddleware = (schema, kind) => {
    return (req, res, next) => {
        const { isValid, error } = validateSchema(req, schema, kind)

        if (!isValid) {
            return next(createHttpError(400, error))
        }

        return next()
    }
}

module.exports = schemaValidatorMiddleware
