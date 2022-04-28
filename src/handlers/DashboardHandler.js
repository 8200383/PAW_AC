const navigation = [
    { name: 'Customers', module: 'onCustomers()' },
    { name: 'Employees', module: 'onEmployees()' },
    { name: 'Purchases', module: 'onPurchases()' },
    { name: 'Books', module: 'onBooks()' },
]

const index = async (req, res) => {
    return res.render('index', { navigation })
}

module.exports = {
    index,
}