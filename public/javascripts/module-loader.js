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
        await Auth()
            .retrieveAccountInfo(localStorage.getItem('email'))
            .then(() => {
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
                document.getElementById('email-account').innerHTML =
                    res['email']
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
        'block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
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

        setError()
    }

    /**
     * Handle Slideover Events such as clicks
     */
    const handleClickEvents = () => {
        document
            .getElementById('form-btn-close')
            .addEventListener('click', toggleSlideover)
    }

    const setError = (error) => {
        const slideover = document.getElementById('slideover-error')
        slideover.innerHTML = error ?? ''
    }

    /**
     * Get form container as json object
     * @return string
     */
    const getJsonForm = () => {
        const element = {}

        const container =
            document.getElementById('form-container').firstElementChild
                .childNodes

        container.forEach((field) => {
            if (field.lastElementChild.value !== '') {
                element[field.lastElementChild.id] =
                    field.lastElementChild.value
            } else if (
                field.lastElementChild.value === '' &&
                field.lastElementChild.required
            ) {
                element[field.lastElementChild.id] = null
            }
        })

        return JSON.stringify(element)
    }

    /**
     * Create form in DOM
     *
     * @param {string} label
     * @param {{}[]} fields
     * @param {boolean} hideSaveButton
     * @param {function} saveButtonCallback
     */
    const renderForm = (label, fields, hideSaveButton, saveButtonCallback) => {
        const formLabel = document.getElementById('slideover-label')
        formLabel.innerHTML = label

        const saveButton = document.getElementById('form-submit-btn')

        if (hideSaveButton) {
            saveButton.classList.add('hidden')
        } else {
            saveButton.classList.remove('hidden')
        }

        saveButton.onclick = saveButtonCallback

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
            input.id = field.id ?? null
            input.className = inputStyles
            input.value = field.value ?? null
            input.required = field.required ?? false
            input.disabled = field.disabled ?? false

            section.appendChild(flex)
            section.appendChild(input)

            dummyContainer.appendChild(section)
        })

        if (container.hasChildNodes()) {
            container.removeChild(container.lastChild)
        }

        container.appendChild(dummyContainer)
    }

    /**
     * Set create button action
     * @param {function} cb
     */
    const setCreateBtnAction = (label, cb) => {
        const action = document.getElementById('module-btn-action')

        action.onclick = cb
        action.innerHTML = label
    }

    return {
        handleClickEvents,
        toggleSlideover,
        setError,
        getJsonForm,
        renderForm,
        setCreateBtnAction,
    }
}

/* ---
    Tables - Helpers functions to handle tables in DOM
--- */

const Table = () => {
    const rowStyles = classNames(
        'px-6 py-3 whitespace-nowrap text-sm text-gray-800 text-center'
    )

    const columnActionsStyles = classNames('flex space-x-0.5 justify-end px-4')

    const rowActionsStyles = classNames(
        'py-3 px-1 whitespace-nowrap text-sm font-medium'
    )

    const tbodyStyles = classNames('bg-white divide-y divide-gray-100')

    const trStyles = classNames('border-t border-gray-200')

    const thStyles = classNames(
        'px-6 py-3 border-b border-gray-200 bg-gray-50',
        'text-left text-xs font-medium text-gray-500',
        'uppercase tracking-wider text-center'
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
     * Add rows to the table but the columns with objects are children
     * @param {{}[]} rows
     * @return {HTMLTableRowElement[]}
     */
    const addRowsWithChildren = (rows) => {
        return rows.map((row) => {
            const tr = document.createElement('tr')

            const html = Object.values(row).map((field) => {
                const td = document.createElement('td')
                td.className = classNames(
                    rowStyles,
                    Array.isArray(field) ? 'flex flex-col space-x-2' : null
                )

                if (Array.isArray(field)) {
                    const data = field
                    const table = document.createElement('table')
                    const thead = document.createElement('thead')
                    const tbody = document.createElement('tbody')

                    const tr = document.createElement('tr')
                    tr.className = trStyles
                    Object.keys(data[0])
                        .filter(([key]) => {
                            const dontShow = '_id'
                            return !dontShow.includes(key)
                        })
                        .map((key) => {
                            const th = document.createElement('th')
                            th.className = thStyles
                            th.innerHTML = key
                            tr.append(th)
                            thead.append(tr)
                        })

                    data.forEach((row) => {
                        const tr = document.createElement('tr')
                        Object.entries(row)
                            .filter(([key]) => {
                                const dontShow = '_id'
                                return !dontShow.includes(key)
                            })
                            .map((value) => {
                                const td = document.createElement('td')
                                td.className = rowStyles
                                td.innerHTML = value[1]
                                tr.append(td)
                            })
                        tbody.append(tr)
                    })

                    table.append(tbody)
                    table.append(thead)
                    td.append(table)
                } else {
                    td.innerHTML = field
                }

                return td
            })

            tr.append(...html)
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
        addColumns,
        addRows,
        addRowsWithChildren,
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
        'rounded-md hover:text-gray-900 hover:bg-gray-50'
    )

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
     */
    const init = (moduleLabel, slideoverLabel) => {
        document.getElementById('module-label').innerHTML = moduleLabel
        document.getElementById('slideover-label').innerHTML = slideoverLabel
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
        Module().init('Customers', 'New Customer')

        Slideover().setCreateBtnAction('New Customer', onCreateCustomer)

        fetchCustomers()
    }

    const onCreateCustomer = () => {
        const fields = [
            {
                label: 'Reader Card Number',
                id: 'reader_card_num',
                required: true,
            },
            { label: 'Name', id: 'name', required: true },
            { label: 'Phone', id: 'cell_phone' },
            { label: 'Birth Date', id: 'birth_date' },
            { label: 'Gender', id: 'gender' },
            { label: 'Country', id: 'country' },
            { label: 'Postal Code', id: 'postal_code' },
            { label: 'Billing Address', id: 'billing_address' },
            { label: 'Residence Address', id: 'residence_address' },
            { label: 'NIF', id: 'nif' },
            { label: 'Profession', id: 'profession' },
        ]

        Slideover().renderForm('New Customer', fields, false, onFormSubmission)
        Slideover().toggleSlideover()
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
            })
    }

    const onView = async (event) => {
        const id = event.target.id

        await fetch(API_URL + '/customer/' + id)
            .then((res) => res.json())
            .then((raw) => raw['customer'])
            .then((customer) => {
                const entries = Object.entries(customer)
                    .filter(([key]) => {
                        const dontShow = [
                            '_id',
                            '__v',
                            'created_at',
                            'updated_at',
                            'update_at',
                        ]

                        return !dontShow.includes(key)
                    })
                    .map(([key, value]) => {
                        return { label: key, value: value, disabled: true }
                    })

                Slideover().toggleSlideover()
                Slideover().renderForm(
                    'Customer',
                    entries,
                    true,
                    onFormSubmission
                )
            })
    }

    const onEdit = async (event) => {
        const id = event.target.id
        await fetch(API_URL + '/customer/' + id)
            .then((res) => res.json())
            .then((raw) => raw['customer'])
            .then((customer) => {
                const entries = Object.entries(customer)
                    .filter(([key]) => {
                        const dontShow = [
                            '_id',
                            '__v',
                            'created_at',
                            'updated_at',
                            'update_at',
                        ]

                        return !dontShow.includes(key)
                    })
                    .map(([key, value]) => {
                        return { label: key, id: key, value: value }
                    })

                Slideover().renderForm('Edit Customer', entries, false, () =>
                    console.log('edit customer')
                )
                Slideover().toggleSlideover()
            })
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
        Module().init('Employees', 'New Employee')

        Slideover().setCreateBtnAction('New Employee', onCreateEmployee)

        fetchEmployees()
    }

    const onCreateEmployee = () => {
        const fields = [
            { label: 'Employee No', id: 'employee_no', required: true },
            { label: 'Name', id: 'name', required: true },
            { label: 'NIF', id: 'nif' },
            { label: 'Phone', id: 'cell_phone' },
            { label: 'Gender', id: 'gender' },
            { label: 'Nationality', id: 'nationality' },
            { label: 'Postal Code', id: 'postal_code' },
            { label: 'Address', id: 'address' },
        ]

        Slideover().renderForm('New Employee', fields, false, onFormSubmission)
        Slideover().toggleSlideover()
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

    const fetchEmployees = () => {
        fetch(API_URL + '/employees')
            .then((res) => res.json())
            .then((raw) => raw['employees'])
            .then((rows) => {
                if (rows.length === 0) {
                    EmptyState().render('There is no employees yet!')
                    return
                }

                const columns = extractColumns(rows[0])
                Table().render(columns, rows, actions)
            })
    }

    const onView = async (event) => {
        const id = event.target.id

        await fetch(API_URL + '/employee/' + id)
            .then((res) => res.json())
            .then((raw) => raw['employee'])
            .then((employee) => {
                const entries = Object.entries(employee)
                    .filter(([key]) => {
                        const dontShow = [
                            '_id',
                            '__v',
                            'created_at',
                            'update_at',
                            'updated_at',
                        ]

                        return !dontShow.includes(key)
                    })
                    .map(([key, value]) => {
                        return { label: key, value: value, disabled: true }
                    })

                Slideover().toggleSlideover()
                Slideover().renderForm('Customer', entries, true, null)
            })
    }

    const onEdit = async (event) => {
        const id = event.target.id
        await fetch(API_URL + '/employee/' + id)
            .then((res) => res.json())
            .then((raw) => raw['employee'])
            .then((employee) => {
                const entries = Object.entries(employee)
                    .filter(([key]) => {
                        const dontShow = [
                            '_id',
                            '__v',
                            'created_at',
                            'updated_at',
                            'update_at',
                        ]

                        return !dontShow.includes(key)
                    })
                    .map(([key, value]) => {
                        return { label: key, id: key, value: value }
                    })

                Slideover().renderForm('Edit Employee', entries, false, () =>
                    console.log('edit employee')
                )
                Slideover().toggleSlideover()
            })
    }

    const onDelete = (event) => {
        const id = event.target.id

        fetch(API_URL + '/employee/' + id, {
            method: 'DELETE',
        }).then(() => {
            event.target.parentElement.parentElement.remove()
        })
    }

    const onFormSubmission = async () => {
        await fetch(API_URL + '/employees', {
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
            })
    }

    return {
        init,
    }
}

const Books = () => {
    const init = () => {
        Module().init('Books', 'New Book')
        Slideover().setCreateBtnAction('New Book', onCreateBook)
        onModuleLoad()
    }

    const onModuleLoad = () => {
        const actions = [
            {
                label: 'View',
                color: 'text-indigo-400',
                cb: (event) => onView(event),
            },
            {
                label: 'Edit',
                color: 'text-yellow-500',
                cb: (event) => onEdit(event),
            },
            {
                label: 'Remove',
                color: 'text-red-400',
                cb: (event) => onRemove(event),
            },
        ]

        fetch(API_URL + '/books')
            .then((res) => res.json())
            .then((raw) => raw['books'])
            .then((rows) => {
                if (rows.length === 0) {
                    EmptyState().render('There is no books yet!')
                    return
                }

                const columns = extractColumns(rows[0])
                Table().render(columns, rows, actions)
            })
    }

    const onCreateBook = () => {
        const fields = [
            { label: 'ISBN', id: 'isbn', required: true },
            { label: 'Stock New', id: 'stock_new', required: true },
            { label: 'Stock Second Hand', id: 'stock_used', required: true },
            { label: 'Price New', id: 'price_new', required: true },
            { label: 'Price Second Hand', id: 'price_used', required: true },
        ]

        Slideover().renderForm('New Book', fields, false, onFormSubCreate)
        Slideover().toggleSlideover()
    }

    const onFormSubCreate = async () => {
        await fetch(API_URL + '/books', {
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
            })
            .then(() => onModuleLoad())
    }

    const onEdit = async (event) => {
        const id = event.target.id

        await fetch(API_URL + '/book/' + id)
            .then((res) => res.json())
            .then((raw) => raw['book'])
            .then((book) => {
                const entries = Object.entries(book)
                    .filter(([key]) => {
                        const dontShow = [
                            '_id',
                            '__v',
                            'created_at',
                            'updated_at',
                            'update_at',
                        ]

                        return !dontShow.includes(key)
                    })
                    .map(([key, value]) => {
                        if (
                            key == 'isbn' ||
                            key == 'title' ||
                            key == 'authors' ||
                            key == 'published_date' ||
                            key == 'language' ||
                            key == 'pages'
                        ) {
                            return {
                                label: key,
                                id: key,
                                value: value,
                                disabled: true,
                            }
                        }
                        return { label: key, id: key, value: value }
                    })

                Slideover().toggleSlideover()
                Slideover().renderForm('Book', entries, false, () =>
                    onFormSubEdit()
                )
            })
    }

    const onFormSubEdit = async () => {
        await fetch(API_URL + '/books', {
            method: 'PATCH',
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
            })
            .then(() => onModuleLoad())
    }

    const onView = async (event) => {
        const id = event.target.id

        await fetch(API_URL + '/book/' + id)
            .then((res) => res.json())
            .then((raw) => raw['book'])
            .then((book) => {
                const entries = Object.entries(book)
                    .filter(([key]) => {
                        const dontShow = [
                            '_id',
                            '__v',
                            'created_at',
                            'updated_at',
                            'update_at',
                            'image',
                        ]

                        return !dontShow.includes(key)
                    })
                    .map(([key, value]) => {
                        return {
                            label: key,
                            id: key,
                            value: value,
                            disabled: true,
                        }
                    })

                Slideover().toggleSlideover()
                Slideover().renderForm('Book', entries, true, null)
                renderImagesInsideForm(book)
            })
    }

    const renderImagesInsideForm = (book) => {
        const dummyContainer =
            document.getElementById('form-container').firstElementChild

        const img = document.createElement('img')

        if (book.image == '') {
            img.src =
                'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
        } else {
            img.src = book.image
        }

        img.setAttribute('class', 'mb-4')
        img.width = '130'
        img.height = '90'
        dummyContainer.prepend(img)
    }

    const onRemove = async (event) => {
        const id = event.target.id

        await fetch(API_URL + '/book/' + id, {
            method: 'DELETE',
        }).then(() => onModuleLoad())
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
        Module().init('Purchases', 'New Purchase')

        Slideover().setCreateBtnAction('New Purchase', onCreatePurchase)
        fetchPurchases()
    }

    const onCreatePurchase = () => {
        fetch('http://localhost:3000/forms/purchases.ejs')
            .then((response) => response.text())
            .then((text) => {
                document.getElementById('form-container').innerHTML = text
            })
            .then(() => Slideover().toggleSlideover())
            .then(() => {
                document
                    .getElementById('form-submit-btn')
                    .addEventListener('click', () => {
                        onFormSubmission()
                    }, {once: true})
            })
            .then(() => {
                handlePurchaseClickEvents()
                document.getElementById('add-isbn').click()
            })
    }

    const fetchPurchases = () => {
        fetch(API_URL + '/purchases')
            .then((res) => res.json())
            .then((raw) => raw['purchases'])
            .then((rows) => {
                if (rows.length === 0) {
                    EmptyState().render('There is no purchases yet!')
                    return
                }

                const columns = extractColumns(rows[0])
                Table().customRender(
                    Table().addColumns(columns),
                    Table().addRowsWithChildren(rows),
                    []
                )
            })
    }

    const handleBooks = () => {
        let isbn = []
        let type = []
        let qnt = []
        let books = []

        document.getElementsByName('isbn').forEach((input) => {
            isbn.push(input.value)
        })
        document.getElementsByName('book-type').forEach((input) => {
            type.push(input.value)
        })
        document.getElementsByName('quantity').forEach((input) => {
            qnt.push(input.value)
        })

        for (let i = 0; i < isbn.length; i++) {
            const object = {
                book: isbn[i],
                type: type[i],
                qnt: qnt[i],
            }
            books.push(object)
        }
        return books
    }

    const onFormSubmission = async () => {
        await fetch(API_URL + '/purchases', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer: document.getElementById('reader_card_num').value,
                books: handleBooks(),
                payment_method: document.getElementById('payment-method').value,
                spent_balance: document.getElementById('points').value,
            }),
        })
            .then((raw) => raw.json())
            .then((res) => {
                if (res['error']) {
                    Slideover().setError(res['error'])
                    return
                }

                Slideover().toggleSlideover()
            })
            .then(() => {
                fetchPurchases()
            })
    }

    const handlePurchaseClickEvents = () => {
        resetForm()
        addIsbn()
    }

    const removeIsbn = (button) => {
        button.addEventListener('click', () => {
            if (
                button.parentElement.parentElement.parentElement
                    .childElementCount === 1
            ) {
                document.getElementById('form-submit-btn').disabled = true
                document
                    .getElementById('form-submit-btn')
                    .setAttribute(
                        'class',
                        'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
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
                    'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                )
        })
    }

    const resetForm = () => {
        document
            .getElementById('module-btn-action')
            .addEventListener('click', () => {
                document.getElementById(
                    'form-container'
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
        isbnLabel.setAttribute(
            'class',
            'block text-sm font-medium text-gray-700'
        )
        isbnLabel.setAttribute('for', 'isbn')
        isbnLabel.innerHTML = 'ISBN'

        let isbnInput = document.createElement('input')
        isbnInput.setAttribute(
            'class',
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
        typeLabel.setAttribute(
            'class',
            'block text-sm font-medium text-gray-700'
        )
        typeLabel.setAttribute('for', 'book-type')
        typeLabel.innerHTML = 'Type'

        let typeSelect = document.createElement('select')
        typeSelect.setAttribute(
            'class',
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
        )
        typeSelect.setAttribute('name', 'book-type')

        let typeOptionNew = document.createElement('option')
        typeOptionNew.setAttribute('value', 'New')
        typeOptionNew.innerHTML = 'New'

        let typeOptionUsed = document.createElement('option')
        typeOptionUsed.setAttribute('value', 'Used')
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
        qntLabel.setAttribute(
            'class',
            'block text-sm font-medium text-gray-700'
        )
        qntLabel.setAttribute('for', 'quantity')
        qntLabel.innerHTML = 'Qnt'

        let qntInput = document.createElement('input')
        qntInput.setAttribute(
            'class',
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
        removeLabel.setAttribute(
            'class',
            'block text-sm font-medium text-white'
        )
        removeLabel.setAttribute('for', 'remove-isbn')
        removeLabel.innerHTML = 'text'

        let removeButton = document.createElement('button')
        removeButton.setAttribute(
            'class',
            'inline-flex items-center rounded-md border border-transparent bg-red-600 px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
        )
        removeButton.setAttribute('type', 'button')
        removeButton.setAttribute('name', 'remove-isbn')

        removeDiv.append(removeLabel)
        removeDiv.append(removeButton)
        removeButton.innerHTML = trashSvg()
        newDiv.append(removeDiv)
        removeIsbn(removeButton)
    }

    return {
        init,
    }
}
