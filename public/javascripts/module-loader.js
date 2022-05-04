/* ---
    Module Loader is a Javascript file containing helpers functions to load modules,
    business logic for the BookStore API, styles and DOM helper functions
--- */

const API_URL = 'http://localhost:3000/api'

const modules = [
    { label: 'Customers', onClick: () => Customers().init() },
    { label: 'Employees', onClick: () => Employees().init() },
    { label: 'Books', onClick: () => Books().init() },
    { label: 'Purchases', onClick: () => Purchases().init() },
]

/* ---
    Logic that appends when the DOM is fully load
--- */

const onDocumentLoad = async () => {
    Auth().toggleAuthPage()
    Auth().handleClickEvents()

    Slideover().handleClickEvents()
    Sidebar().appendModules(modules, 'desktop-sidebar')
    Sidebar().appendModules(modules, 'mobile-sidebar')

    if (Auth().isLoggedIn()) {
        await Auth().retrieveAccountInfo(localStorage.getItem('email')).then(() => {
            console.log('[!] Account Information Loaded')
        })

        Customers().init()
    }
}

document.addEventListener('DOMContentLoaded', onDocumentLoad)

/* ---
    Auth - Helpers functions to handle authentication
--- */

const Auth = () => {

    const handleClickEvents = () => {
        document.getElementById('auth-btn').addEventListener('click', onAuth)
        document.getElementById('logout-btn').addEventListener('click', logout)
    }

    const isLoggedIn = () => {
        return (
            localStorage.getItem('token') !== null &&
            localStorage.getItem('email') !== null
        )
    }

    const logout = () => {
        localStorage.clear()
        location.reload()
    }

    const onAuth = async () => {
        const account = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }

        await fetch('http://localhost:3000/api/auth', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
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
                toggleAuthPage()
            })
    }

    const retrieveAccountInfo = async (email) => {
        await fetch(API_URL + `/account/${email}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((raw) => raw.json())
            .then((res) => {
                document.getElementById('email-account').innerHTML = res['email']
                document.getElementById('role').innerHTML = res['role']
            })
    }

    const toggleAuthPage = () => {
        if (!isLoggedIn()) {
            document.getElementById('dashboard').classList.add('hidden')
            document.getElementById('auth').classList.remove('hidden')
            return
        }

        document.getElementById('dashboard').classList.remove('hidden')
        document.getElementById('auth').classList.add('hidden')
    }

    return {
        handleClickEvents,
        isLoggedIn,
        logout,
        retrieveAccountInfo,
        toggleAuthPage,
    }
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
    Slideover - Helpers functions to handle slide overs
--- */

const Slideover = () => {

    const labelStyles = classNames('text-sm font-medium text-gray-700')

    const requiredStyles = classNames('text-xs text-red-600 font-semibold')

    const inputStyles = classNames(
        'mt-1 focus:ring-indigo-500 focus:border-indigo-500',
        'block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
    )

    /**
     * Show / Hide a component in DOM
     * @param {string} id
     */
    const toggleComponent = (id) => {
        if (document.getElementById(id).classList.contains('hidden')) {
            document.getElementById(id).classList.remove('hidden')
        } else {
            document.getElementById(id).classList.add('hidden')
        }
    }

    /**
     * Show / Hide form slideover
     */
    const toggleSlideover = () => {
        const components = ['form-slideover', 'form-shadow', 'form-lock']

        components.forEach((component) => {
            toggleComponent(component)
        })
    }

    /**
     * Handle SlideOver Events such as clicks
     */
    const handleClickEvents = () => {
        document
            .getElementById('form-btn-close')
            .addEventListener('click', toggleSlideover)
        document
            .getElementById('module-btn-action')
            .addEventListener('click', toggleSlideover)
    }

    const setError = (error) => {
        const slideover = document.getElementById('slideover-error')
        slideover.innerHTML = error ?? ''

        toggleComponent('slideover-error')
    }

    /**
     * Get form container as json object
     * @return string
     */
    const getJsonForm = () => {
        const element = {}

        const container = document.getElementById('form-container').firstElementChild.childNodes
        container.forEach((field) => {
            if (field.lastElementChild.value !== '') {
                element[field.lastElementChild.id] = field.lastElementChild.value
            }
        })

        return JSON.stringify(element)
    }

    /**
     * Create form in DOM
     *
     * @param {Array<{label: string, id: string, required: boolean}>} fields
     */
    const createForm = (fields) => {
        const container = document.getElementById('form-container')

        const dummyContainer = document.createElement('div')

        fields.map((field) => {
            const section = document.createElement('section')
            section.className = 'mb-4'

            const label = document.createElement('label')
            label.htmlFor = field.label.toLowerCase()
            label.className = labelStyles
            label.innerHTML = field.label

            const required = document.createElement('span')
            required.className = requiredStyles
            required.innerHTML = 'Required'

            const flex = document.createElement('div')
            flex.className = 'flex justify-between'
            flex.appendChild(label)
            field.required ? flex.appendChild(required) : null

            const input = document.createElement('input')
            input.type = 'text'
            input.id = field.id
            input.className = inputStyles
            input.required = field.required

            section.appendChild(flex)
            section.appendChild(input)

            dummyContainer.appendChild(section)
        })

        if (container.hasChildNodes()) {
            container.removeChild(container.lastChild)
        }

        container.appendChild(dummyContainer)
    }

    return {
        handleClickEvents,
        toggleSlideover,
        setError,
        getJsonForm,
        createForm,
    }
}

/* ---
    Tables - Helpers functions to handle tables in DOM
--- */

const Table = () => {
    const rowStyles = classNames('px-6 py-3 whitespace-nowrap text-sm text-gray-800')

    const columnActionsStyles = classNames('flex space-x-0.5 justify-end px-4')

    const rowActionsStyles = classNames('py-3 px-1 whitespace-nowrap text-sm font-medium')

    const tbodyStyles = classNames('bg-white divide-y divide-gray-100')

    const trStyles = classNames('border-t border-gray-200')

    const thStyles = classNames(
        'px-6 py-3 border-b border-gray-200 bg-gray-50',
        'text-left text-xs font-medium text-gray-500',
        'uppercase tracking-wider',
    )

    /**
     * Add actions to the table
     * @param {{label: string, color: string, cb: function}[]} actions
     * @return {HTMLTableCellElement}
     */
    const addActions = (actions) => {
        const td = document.createElement('td')
        td.className = columnActionsStyles

        actions.forEach((action) => {
            const div = document.createElement('button')
            div.className = classNames(rowActionsStyles, action.color)
            div.innerHTML = action.label
            div.onclick = action.cb

            td.appendChild(div)
        })

        return td
    }

    /**
     * Add columns to the table
     * @param {string[]} columns
     * @return {HTMLTableRowElement}
     */
    const addColumns = (columns) => {
        const tr = document.createElement('tr')
        tr.className = trStyles

        columns.forEach((column) => {
            const th = document.createElement('th')
            th.className = thStyles
            th.innerHTML = column

            tr.appendChild(th)
        })

        // Create Actions Column
        const th = document.createElement('th')
        th.className = classNames(thStyles, 'flex justify-end')
        th.innerHTML = 'Actions'
        tr.appendChild(th)

        return tr
    }

    /**
     * Add rows to the table
     * @param {{}[]} rows
     * @return {HTMLTableRowElement[]}
     */
    const addRows = (rows) => {
        return rows.map((row) => {
            const tr = document.createElement('tr')

            Object.values(row).forEach((field) => {
                const td = document.createElement('td')
                td.className = rowStyles
                td.innerHTML = field

                tr.appendChild(td)
            })

            return tr
        })
    }

    /**
     * Renders a table with custom callback functions
     * @param {HTMLTableRowElement} columnsCallback
     * @param {HTMLTableRowElement[]} rowsCallback
     * @param {{label: string, color: string, cb: function}[]} actions
     */
    const customRender = (columnsCallback, rowsCallback, actions) => {
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        tbody.className = tbodyStyles

        thead.appendChild(columnsCallback)

        rowsCallback
            .map((row) => {
                const buttons = addActions(actions)

                buttons.childNodes.forEach((child) => {
                    child.id = row.firstElementChild.innerHTML
                })

                row.appendChild(buttons)

                return row
            })
            .forEach((row) => {
                tbody.appendChild(row)
            })

        const table = document.createElement('table')
        table.className = 'min-w-full'
        table.appendChild(thead)
        table.appendChild(tbody)

        const container = document.getElementById('container')
        if (container.hasChildNodes()) {
            container.removeChild(container.lastChild)
        }

        container.appendChild(table)
    }

    /**
     * Renders the table
     * @param {string[]} columns
     * @param {Object[]} rows
     * @param {{label: string, color: string, cb: function}[]} actions
     */
    const render = (columns, rows, actions) => {
        return customRender(addColumns(columns), addRows(rows), actions)
    }

    return {
        customRender,
        render,
    }
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
    EmptyState - Helpers functions to handle empty state
--- */

const EmptyState = () => {

    const render = (msg) => {
        const p = document.createElement('p')
        p.className = 'text-xl font-medium text-gray-600'
        p.innerHTML = msg

        const div = document.createElement('div')
        div.className = 'px-4 pb-4 sm:px-6 lg:px-8'

        div.appendChild(p)

        const container = document.getElementById('container')
        if (container.hasChildNodes()) {
            container.removeChild(container.lastChild)
        }

        container.appendChild(div)
    }

    return {
        render,
    }
}

/* ---
    Sidebar
--- */

const Sidebar = () => {
    const sidebarStyles = classNames(
        'w-full flex items-center px-3 py-2',
        'text-sm font-medium text-gray-700',
        'rounded-md hover:text-gray-900 hover:bg-gray-50')

    const appendModules = (modules, id) => {
        const element = document.getElementById(id)

        modules.forEach((module) => {
            const btn = document.createElement('button')
            btn.className = sidebarStyles
            btn.onclick = module.onClick
            btn.innerHTML = module.label

            element.appendChild(btn)
        })
    }

    return {
        appendModules,
    }
}

/* ---
    Logic to load a module
--- */

const Module = () => {
    /**
     * Set labels and events listeners to a module
     * @param {string} moduleLabel
     * @param {string} slideoverLabel
     * @param {function} cb
     */
    const init = (moduleLabel, slideoverLabel, cb) => {
        document.getElementById('module-label').innerHTML = moduleLabel
        document.getElementById('module-btn-action').innerHTML = slideoverLabel
        document.getElementById('slideover-label').innerHTML = slideoverLabel
        document.getElementById('form-submit-btn').onclick = cb
    }

    return {
        init,
    }
}

/* ---
    Modules Declaration
--- */

const Customers = () => {
    const init = () => {
        Module().init('Customers', 'New Customer', onFormSubmission)

        fetchCustomers()
        renderForm()
    }

    const renderForm = () => {
        const fields = [
            { label: 'Reader Card Number', id: 'reader_card_num', required: true },
            { label: 'Name', id: 'name', required: true },
            { label: 'Phone', id: 'cell_phone', required: false },
            { label: 'Birth Date', id: 'birth_date', required: false },
            { label: 'Gender', id: 'gender', required: false },
            { label: 'Country', id: 'country', required: false },
            { label: 'Postal Code', id: 'postal_code', required: false },
            { label: 'Billing Address', id: 'billing_address', required: false },
            { label: 'Residence Address', id: 'residence_address', required: false },
            { label: 'NIF', id: 'nif', required: false },
            { label: 'Profession', id: 'profession', required: false },
        ]

        Slideover().createForm(fields)
    }

    const actions = [
        {
            label: 'View',
            color: 'text-indigo-600',
            cb: (event) => onView(event),
        },
        {
            label: 'Edit',
            color: 'text-yellow-600',
            cb: (event) => onEdit(event),
        },
        {
            label: 'Delete',
            color: 'text-red-600',
            cb: (event) => onDelete(event),
        },
    ]

    const fetchCustomers = () => {
        fetch(API_URL + '/customers')
            .then((res) => res.json())
            .then((raw) => raw['customers'])
            .then((rows) => {
                if (rows.length === 0) {
                    EmptyState().render('There is no customers yet!')
                    return
                }

                const columns = extractColumns(rows[0])
                Table().render(columns, rows, actions)
            })
    }

    const onFormSubmission = async () => {
        console.log('sub')

        await fetch(API_URL + '/customers', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: Slideover().getJsonForm(),
        })
            .then((raw) => raw.json())
            .then((res) => {
                if (res['error']) {
                    Slideover().setError(res['error'])
                    return
                }

                Slideover().toggleSlideover()
                Slideover().setError(null)
            })
    }

    const onView = (event) => {
        const id = event.target.id

        fetch(API_URL + '/customer/' + id)
            .then((res) => res.json())
            .then((raw) => raw['customer'])
            .then((customer) => {
                console.log(customer)
            })
    }

    const onEdit = (event) => {
        console.log(event.target.id)
    }

    const onDelete = (event) => {
        const id = event.target.id

        fetch(API_URL + '/customer/' + id, {
            method: 'DELETE',
        }).then(() => {
            event.target.parentElement.parentElement.remove()
        })
    }

    return {
        init,
    }
}

const Employees = () => {
    const init = () => {
        Module().init('Employees', 'New Employee', onFormSubmission)

        renderForm()
        fetchEmployees()
    }

    const renderForm = () => {
        const fields = [
            { label: 'Employee No', id: 'employee_no', required: true },
            { label: 'Name', id: 'name', required: true },
            { label: 'NIF', id: 'nif', required: false },
            { label: 'Phone', id: 'cell_phone', required: false },
            { label: 'Gender', id: 'gender', required: false },
            { label: 'Nationality', id: 'nationality', required: false },
            { label: 'Postal Code', id: 'postal_code', required: false },
            { label: 'Address', id: 'address', required: false },
        ]

        Slideover().createForm(fields)
    }

    const actions = [
        { label: 'View', color: 'text-indigo-600', cb: () => console.log('clicked') },
        { label: 'Edit', color: 'text-yellow-600', cb: () => console.log('clicked') },
        { label: 'View', color: 'text-indigo-600', cb: () => console.log('clicked') },
    ]

    const fetchEmployees = () => {
        fetch(API_URL + '/employees')
            .then((res) => res.json())
            .then((raw) => raw['employees'])
            .then((rows) => {
                const columns = extractColumns(rows[0])
                Table().render(columns, rows, actions)
            })
    }

    const onFormSubmission = () => {
    }

    return {
        init,
    }
}

const Books = () => {
    const init = () => {
        Module().init('Books', 'New Book', onFormSubmission)

        renderForm()
        onModuleLoad()
    }

    const renderForm = () => {
        const fields = [
            { label: 'ISBN', id: 'isbn', required: true },
            { label: 'Stock New', id: 'stock_new', required: true },
            { label: 'Stock Second Hand', id: 'stock_used', required: true },
        ]

        Slideover().createForm(fields)
    }

    const onModuleLoad = () => {
        const actions = [
            { label: 'View', color: 'text-indigo-600', cb: () => console.log('clicked') },
            { label: 'Edit', color: 'text-yellow-600', cb: () => console.log('clicked') },
            { label: 'Delete', color: 'text-red-600', cb: () => console.log('clicked') },
        ]

        fetch(API_URL + '/books')
            .then((res) => res.json())
            .then((raw) => raw['books'])
            .then((rows) => {
                const columns = extractColumns(rows[0])
                Table().render(columns, rows, actions)
            })
    }

    const onFormSubmission = () => {
    }

    return {
        init,
    }
}

/* ---
    Purchase - Add new book
--- */


const Purchases = () => {
    const init = () => {
        Module().init('Purchases', 'New Purchase', onFormSubmission)

        renderForm()
        fetchPurchases()
    }

    const renderForm = () => {
        fetch('http://localhost:3000/forms/purchases.ejs')
            .then((response) => response.text())
            .then((text) => {
                document.getElementById('form-container').innerHTML = text
            })
    }

    const fetchPurchases = () => {
        const actions = [
            { label: 'View', color: 'text-indigo-600', cb: () => console.log('clicked') },
            { label: 'Edit', color: 'text-yellow-600', cb: () => console.log('clicked') },
            { label: 'Delete', color: 'text-red-600', cb: () => console.log('clicked') },
        ]

        fetch(API_URL + '/purchases')
            .then((res) => res.json())
            .then((raw) => raw['purchases'])
            .then((rows) => {
                const columns = extractColumns(rows[0])
                Table().render(columns, rows, actions)
            })
            .then(() => handlePurchaseClickEvents())
    }

    const onFormSubmission = () => {
    }

    return {
        init,
    }
}

const handlePurchaseClickEvents = () => {
    resetForm()
    addIsbn()
}

const removeIsbn = (button) => {
    button.addEventListener('click', () => {
        if (button.parentElement.parentElement.parentElement.childElementCount === 1) {
            document.getElementById('form-submit-btn').disabled = true
            document
                .getElementById('form-submit-btn')
                .setAttribute(
                    'class',
                    'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                )
        }
        button.parentElement.parentElement.remove()
    })
}

const addIsbn = () => {
    document.getElementById('add-isbn').addEventListener('click', () => {
        appendIsbnForm()
        document.getElementById('form-submit-btn').disabled = false
        document
            .getElementById('form-submit-btn')
            .setAttribute(
                'class',
                'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
            )
    })
}

const resetForm = () => {
    document
        .getElementById('module-btn-action')
        .addEventListener('click', () => {
            document.getElementById(
                'form-container',
            ).firstElementChild.firstElementChild.innerHTML = ''
            document.getElementById('add-isbn').click()
        })
}

const trashSvg = () => {
    return `
        <svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'
             stroke-width='2'>
            <path stroke-linecap='round' stroke-linejoin='round'
                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
        </svg>
    `
}

const appendIsbnForm = () => {
    let parentDiv =
        document.getElementById('form-container').firstElementChild
            .firstElementChild

    let newDiv = document.createElement('div')
    newDiv.setAttribute('class', 'flex items-center space-x-4 mt-4')

    parentDiv.append(newDiv)

    //isbn div
    let isbnDiv = document.createElement('div')
    isbnDiv.setAttribute('class', 'h-auto grow')

    let isbnLabel = document.createElement('label')
    isbnLabel.setAttribute('class', 'block text-sm font-medium text-gray-700')
    isbnLabel.setAttribute('for', 'isbn')
    isbnLabel.innerHTML = 'ISBN'

    let isbnInput = document.createElement('input')
    isbnInput.setAttribute(
        'class',
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
    )
    isbnInput.setAttribute('type', 'text')
    isbnInput.setAttribute('name', 'isbn')

    isbnDiv.append(isbnLabel)
    isbnDiv.append(isbnInput)
    newDiv.append(isbnDiv)

    //type div
    let typeDiv = document.createElement('div')
    typeDiv.setAttribute('class', 'h-auto w-22 flex-none')

    let typeLabel = document.createElement('label')
    typeLabel.setAttribute('class', 'block text-sm font-medium text-gray-700')
    typeLabel.setAttribute('for', 'book-type')
    typeLabel.innerHTML = 'Type'

    let typeSelect = document.createElement('select')
    typeSelect.setAttribute(
        'class',
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
    )
    typeSelect.setAttribute('name', 'book-type')

    let typeOptionNew = document.createElement('option')
    typeOptionNew.setAttribute('value', 'stock_new')
    typeOptionNew.innerHTML = 'New'

    let typeOptionUsed = document.createElement('option')
    typeOptionUsed.setAttribute('value', 'stock_used')
    typeOptionUsed.innerHTML = 'Used'

    typeDiv.append(typeLabel)
    typeDiv.append(typeSelect)
    typeSelect.append(typeOptionNew)
    typeSelect.append(typeOptionUsed)
    newDiv.append(typeDiv)

    //qnt div
    let qntDiv = document.createElement('div')
    qntDiv.setAttribute('class', 'h-auto w-16 flex-none')

    let qntLabel = document.createElement('label')
    qntLabel.setAttribute('class', 'block text-sm font-medium text-gray-700')
    qntLabel.setAttribute('for', 'quantity')
    qntLabel.innerHTML = 'Qnt'

    let qntInput = document.createElement('input')
    qntInput.setAttribute(
        'class',
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
    )
    qntInput.setAttribute('name', 'quantity')
    qntInput.setAttribute('type', 'number')
    qntInput.setAttribute('autocomplete', 'given-name')

    qntDiv.append(qntLabel)
    qntDiv.append(qntInput)
    newDiv.append(qntDiv)

    //remove div
    let removeDiv = document.createElement('div')
    let removeLabel = document.createElement('label')
    removeLabel.setAttribute('class', 'block text-sm font-medium text-white')
    removeLabel.setAttribute('for', 'remove-isbn')
    removeLabel.innerHTML = 'text'

    let removeButton = document.createElement('button')
    removeButton.setAttribute(
        'class',
        'inline-flex items-center rounded-md border border-transparent bg-red-600 px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    )
    removeButton.setAttribute('type', 'button')
    removeButton.setAttribute('name', 'remove-isbn')

    removeDiv.append(removeLabel)
    removeDiv.append(removeButton)
    removeButton.innerHTML = trashSvg()
    newDiv.append(removeDiv)
    removeIsbn(removeButton)
}
