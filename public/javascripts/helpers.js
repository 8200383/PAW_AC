const classNames = (...strings) => {
    return strings.join(' ')
}

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

/**
 * Create columns from an array
 * @param {Array<string>} columns
 * @return {HTMLElementTagNameMap[string]}
 */
const createColumns = (columns) => {
    const tr = document.createElement('tr')
    tr.className = trStyles

    columns.forEach((column) => {
        const th = document.createElement('th')
        th.className = thStyles

        const node = document.createTextNode(column)
        th.appendChild(node)

        tr.appendChild(th)
    })

    return tr
}

/**
 * Create row from an array
 * @param {Object} row
 * @return {HTMLElementTagNameMap[string]}
 */
const createRow = (row) => {
    const tr = document.createElement('tr')

    Object.values(row).forEach((field) => {
        const td = document.createElement('td')
        td.className = 'pr-6'

        const div = document.createElement('div')
        div.className = rowStyles

        const node = document.createTextNode(field)
        div.appendChild(node)
        td.appendChild(div)
        tr.appendChild(td)
    })

    return tr
}

/**
 * Render Table in HTML
 *
 * @param {Array<string>} columns
 * @param {Array<Object>} rows
 */
const renderTable = (columns, rows) => {
    // Create Table
    const table = document.createElement('table')
    table.className = 'min-w-full'

    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')
    tbody.className = tbodyStyles

    // Append Cells
    thead.appendChild(createColumns(columns))
    rows.forEach((row) => tbody.appendChild(createRow(row)))

    table.appendChild(thead)
    table.appendChild(tbody)

    const container = document.getElementById('container')
    if (container.hasChildNodes()) {
        container.removeChild(container.lastChild)
    }

    container.appendChild(table)
}

const extractColumns = (firstRow) => {
    return Object.keys(firstRow).map((column) => column.replaceAll('_', ' '))
}

function hideDropdowns(id) {
    if (document.getElementById(id).classList.contains('hidden')) {
        document.getElementById(id).classList.remove('hidden')
    } else {
        document.getElementById(id).classList.add('hidden')
    }
}

function hideMobileSidebar() {
    hideDropdowns('mobileSidebar')
    hideDropdowns('mobileShadow')
    hideDropdowns('mobileLock')
}

function hideFormSidebar() {
    hideDropdowns('formSidebar')
    hideDropdowns('formShadow')
    hideDropdowns('formLock')
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

const tbodyStyles = classNames('bg-white divide-y divide-gray-100')

const trStyles = classNames('border-t border-gray-200')

const thStyles = classNames(
    'px-6 py-3 border-b border-gray-200 bg-gray-50',
    'text-left text-xs font-medium text-gray-500',
    'uppercase tracking-wider',
)

document.getElementById('FormButtonClose').addEventListener('click', hideFormSidebar)
document.getElementById('action').addEventListener('click', hideFormSidebar)