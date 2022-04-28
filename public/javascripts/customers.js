const onCustomers = () => {
    document.getElementById('title').innerText = 'Customers'
    document.getElementById('action').innerText = 'Create customer'

    fetch('http://localhost:3000/api/customers')
        .then(res => res.json())
        .then(raw => raw['customers'])
        .then(customers => {

            const columns = extractColumns(customers[0])

            renderTable(columns, customers)

        })
        .catch(err => console.error(err))
}