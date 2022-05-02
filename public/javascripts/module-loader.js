/* ---
    Module Loader is a Javascript file containing helpers functions to load modules,
    business logic for the BookStore API, styles and DOM helper functions
--- */

/* ---
    Logic that appends when the DOM is fully load
--- */

const onDocumentLoad = async () => {
    handleSlideOverClickEvents()
    handleAuthClickEvents()

    if (isLoggedIn()) {
        await loadModule('customers').then(async () => {
            console.log('[!] Customers Module Loaded')

            await retrieveAccountInfo(localStorage.getItem('email')).then(() => {
                console.log('[!] Account Information Loaded')
            })

            hideAuthPage()
        })
    } else {
        showAuthPage()
    }
}

document.addEventListener('DOMContentLoaded', onDocumentLoad)

/* ---
    Auth - Helpers functions to handle authentication
--- */

const handleAuthClickEvents = () => {
    document.getElementById('auth-btn').addEventListener('click', onAuth)
}

const isLoggedIn = () => {
    return localStorage.getItem('token') !== null && localStorage.getItem('email') !== null
}

const logout = () => {
    localStorage.clear()
    location.reload()
}

const onAuth = async () => {
    const account = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
    }

    await fetch('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
    })
        .then((raw) => raw.json())
        .then((res) => {
                if (res['error']) {
                    document.getElementById('error').innerHTML = res['error']
                    document.getElementById('error').classList.remove('hidden')
                    localStorage.clear()
                    return
                }

                document.getElementById('error').classList.add('hidden')
                localStorage.setItem('token', res['token'])
                localStorage.setItem('email', account.email)

                retrieveAccountInfo(account.email)
                hideAuthPage()
            },
        )
}

const retrieveAccountInfo = async (email) => {
    await fetch(`http://localhost:3000/api/account/${email}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((raw) => raw.json())
        .then((res) => {
            document.getElementById('email-account').innerHTML = res['email']
            document.getElementById('role').innerHTML = res['role']
        })
}

const hideAuthPage = () => {
    document.getElementById('dashboard').classList.remove('hidden')
    document.getElementById('auth').classList.add('hidden')
}

const showAuthPage = () => {
    document.getElementById('dashboard').classList.add('hidden')
    document.getElementById('auth').classList.remove('hidden')
}

/* ---
    DOM - Helpers functions to manipulate DOM
--- */

/**
 * Helper function to join class names
 * @param strings
 * @return {string}
 */
const classNames = (...strings) => {
    return strings.join(' ')
}

/* ---
    SlideOver - Helpers functions to handle slide overs
--- */

/**
 * Show / Hide a component in DOM
 * @param {string} id
 */
const showHideComponent = (id) => {
    if (document.getElementById(id).classList.contains('hidden')) {
        document.getElementById(id).classList.remove('hidden')
    } else {
        document.getElementById(id).classList.add('hidden')
    }
}

/**
 * Show / Hide form slide over
 */
const showHideSlideOver = () => {
    const components = ['form-slideover', 'form-shadow', 'form-lock']

    components.forEach((component) => {
        showHideComponent(component)
    })
}

/**
 * Handle SlideOver Events such as clicks
 */
const handleSlideOverClickEvents = () => {
    document.getElementById('form-btn-close').addEventListener('click', showHideSlideOver)
    document.getElementById('module-btn-action').addEventListener('click', showHideSlideOver)
}

/* ---
    Tables - Helpers functions to handle tables in DOM
--- */

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
 * Create a table
 * @param {Array<string>} columns
 * @param {Array<Object>}rows
 */
const createTable = (columns, rows) => {
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

/**
 * Extract columns from a row
 * @param {Object} firstRow
 * @return {string[]}
 */
const extractColumns = (firstRow) => {
    return Object.keys(firstRow).map((column) => column.replaceAll('_', ' '))
}

/* ---
    Logic to load a module
--- */

/**
 * Load module
 *
 * @param {string} module
 * @return {Promise}
 */
const loadModule = (module) => {
    return new Promise((resolve, reject) => {
        switch (module) {
            case 'customers':
                return resolve(new CustomersModule())
            case 'employees':
                return resolve(new EmployeesModule())
            case 'purchases':
                return resolve(new PurchasesModule())
            case 'books':
                return resolve(new BooksModule())
            default:
                return reject('Module not found!')
        }
    })
}

/**
 * Set labels and events listeners to a module
 * @param {string} moduleLabel
 * @param {string} slideOverLabel
 * @param {function} cb
 */
const initModule = (moduleLabel, slideOverLabel, cb) => {
    document.getElementById('module-label').innerHTML = moduleLabel
    document.getElementById('module-btn-action').innerHTML = slideOverLabel
    document.getElementById('slideover-label').innerHTML = slideOverLabel
    document.getElementById('form-submit-btn').addEventListener('click', cb)
}

/* ---
    Modules Declaration
--- */

const API_URL = 'http://localhost:3000/api'

class CustomersModule {
    constructor() {
        initModule('Customers', 'New Customer', this.onFormSubmission)
        this.onModuleLoad()
    }

    onModuleLoad = () => {
        fetch(API_URL + '/customers')
            .then(res => res.json())
            .then(raw => raw['customers'])
            .then(customers => {
                const columns = extractColumns(customers[0])
                createTable(columns, customers)
            })
    }

    onFormSubmission = () => {
        console.log('sub')
    }
}

class EmployeesModule {
    constructor() {
        initModule('Employees', 'New Employee', this.onFormSubmission)
        this.onModuleLoad()
    }

    onModuleLoad = () => {
        fetch(API_URL + '/employees')
            .then(res => res.json())
            .then(raw => raw['employees'])
            .then((employees) => {
                const columns = extractColumns(employees[0])
                createTable(columns, employees)
            })
    }

    onFormSubmission = () => {
    }
}

class PurchasesModule {
    constructor() {
        initModule('Purchases', 'New Purchase', this.onFormSubmission)
        this.onModuleLoad()
    }

    onModuleLoad = () => {
        throw new Error('[!] Purchases Module not implemented')
    }

    onFormSubmission = () => {
    }
}

class BooksModule {
    constructor() {
        initModule('Books', 'New Book', this.onFormSubmission)
        this.onModuleLoad()
    }

    onModuleLoad = () => {
        fetch(API_URL + '/books')
            .then(res => res.json())
            .then(raw => raw['books'])
            .then((books) => {
                const columns = extractColumns(books[0])
                createTable(columns, books)
            })
    }

    onFormSubmission = () => {
    }
}

