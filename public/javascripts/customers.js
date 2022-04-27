const URL = 'http://localhost:3000/api/customers'

const classNames = (...strings) => {
    return strings.join(' ')
}

const columnStyles = classNames(
    'px-6 py-3',
    'border-b border-gray-200 bg-gray-50',
    'text-left text-xs font-medium text-gray-500',
    'uppercase tracking-wider',
)

const rowStyles = classNames(
    'px-6 py-3',
    'whitespace-nowrap text-sm text-gray-800',
)

/**
 * Create an element on html
 * @param {string} where
 * @param {string} before
 * @param {string} tag
 * @param {string} className
 * @param {string} children
 */
const createElement = (where, before, tag, className, children) => {
    const newDiv = document.createElement(tag)
    newDiv.className = className

    const newContent = document.createTextNode(children)
    newDiv.appendChild(newContent)

    const currentDiv = document.getElementById(where)
    const lastDiv = document.getElementById(before)
    currentDiv.insertBefore(newDiv, lastDiv)
}

const extractColumns = (row) => {
    Object.keys(row)
        .map((column) => column.replaceAll('_', ' '))
        .forEach((column) => {
            createElement('columns', 'lastColumn', 'th', columnStyles, column)
        })
}

const onReady = () => {
    fetch(URL)
        .then(res => res.json())
        .then(raw => raw['customers'])
        .then(customers => {
            extractColumns(customers[0])

            customers.forEach((customer) => {
                createElement('rows', 'actions', 'td', rowStyles, customer['reader_card_num'])
                createElement('rows', 'actions', 'td', rowStyles, customer['name'])
                createElement('rows', 'actions', 'td', rowStyles, customer['birth_date'])
                createElement('rows', 'actions', 'td', rowStyles, customer['cell_phone'])
                createElement('rows', 'actions', 'td', rowStyles, customer['country'])
            })
        })
        .catch(err => console.error(err))
}

document.addEventListener('DOMContentLoaded', onReady, false)
