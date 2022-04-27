const navigation = [
    { name: 'Customers', href: '/customers' },
    { name: 'Employees', href: '/employees' },
    { name: 'Purchases', href: '/purchases' },
    { name: 'Books', href: '/books' },
]

const index = async (req, res, next) => {
    return res.render('index', {
        page: 'Dashboard',
        action: 'Not Available',
        navigation: navigation,
    })
}

const customers = async (req, res, next) => {
    return res.render('index', {
        page: 'Customers',
        action: 'Create Customer',
        navigation: navigation,
    })
}

const employees = async (req, res, next) => {
    return res.render('index', {
        page: 'Employees',
        action: 'Create Employee',
        navigation: navigation,
    })
}

const purchases = async (req, res, next) => {
    return res.render('index', {
        page: 'Purchases',
        action: 'Create Purchase',
        navigation: navigation,
    })
}

const books = async (req, res, next) => {
    return res.render('index', {
        page: 'Books',
        action: 'Create Book',
        navigation: navigation,
    })
}

module.exports = {
    index,
    customers,
    employees,
    purchases,
    books,
}