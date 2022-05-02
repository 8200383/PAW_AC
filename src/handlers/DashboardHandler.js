const navigation = [
    { name: 'Customers', module: 'customers' },
    { name: 'Employees', module: 'employees' },
    { name: 'Purchases', module: 'purchases' },
    { name: 'Books', module: 'books' },
]

const index = async (req, res) => {
    return res.render('index', { navigation })
}

module.exports = {
    index,
}