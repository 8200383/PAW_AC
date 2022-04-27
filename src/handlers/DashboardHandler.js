const index = async (req, res, next) => {
    return res.render('index', {
        navigation: [
            { name: 'Customers', href: '/customers' },
            { name: 'Employees', href: '/employees' },
            { name: 'Purchases', href: '/purchases' },
            { name: 'Books', href: '/books' },
        ],
    })
}

module.exports = {
    index,
}