const navigation = [
    { name: 'Customers', module: 'onCustomers()' },
    { name: 'Employees', module: 'onEmployees()' },
    { name: 'Purchases', module: 'onPurchases()' },
    { name: 'Books', module: 'onBooks()' },
]

const index = async (req, res) => {
    return res.render('index', { navigation })
}

const login = async (req, res, next) => {
    return res.render('login', {
        navigation: [
            { name: 'Customers', module: 'customers' },
            { name: 'Employees', module: 'employees' },
            { name: 'Purchases', module: 'purchases' },
            { name: 'Books', module: 'books' },
        ],
    })
}

module.exports = {
    index,
    login,
}