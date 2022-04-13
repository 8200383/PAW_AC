const ajvInstance = require('./ajvInstance')

const schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: ['web', 'inStore'],
        },
        employeeNum: {
            // por definir
            type: 'string',
        },
        readerCardNum: {
            // por definir
            type: 'string',
        },
        isbn: {
            //por definir
            type: 'array',
            items: {
                type: 'string', // por definir
            },
        },
        spentBalance: {
            type: 'number',
            minimum: 0,
        },
        shippingMethod: {
            type: 'string',
            enum: ['express', 'default'], // por definir
        },
        shippingValue: {
            type: 'number',
            minimum: 0,
        },
        PaymentMethod: {
            type: 'string',
            enum: ['mastercard', 'visa'], //por definir
        },
        subtotal: {
            type: 'number',
            minimum: 0,
        },
        vat: {
            type: 'number',
            minimum: 0,
        },
    },
    allOf: [
        {
            if: {
                properties: { type: { const: 'inStore' } },
            },
            then: {
                required: ['employeeNum'],
            },
        },
    ],
    required: ['type'],
    additionalProperties: false,
}

module.exports = ajvInstance.compile(schema)
