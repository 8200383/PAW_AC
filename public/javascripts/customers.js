const loadCustomers = () => {
    fetch('http://localhost:3000/api/customers')
        .then(res => res.json())
        .then(raw => raw['customers'])
        .then(customers => {
            const columns = extractColumns(customers[0])
            renderTable(columns, customers)
        })
        .catch(err => console.error(err))
}

const loadCustomersForm = () => {
    fetch('http://localhost:3000/forms/customers.ejs')
        .then(response => response.text())
        .then(text => onLoadCustomersForm(text))
        .catch(err => console.error(err))
}

const onLoadCustomersForm = (text) => {
    document.getElementById('form-container').innerHTML = text

    const btn = document.getElementById('form-action')
    btn.innerHTML = 'Save Customer'
    btn.addEventListener('click', onCustomersSave)
}

const onCustomersSave = () => {
    console.log('saved')
}

const onCustomers = () => {
    document.getElementById('title').innerText = 'Customers'
    document.getElementById('action').innerText = 'Create customer'
    document.getElementById('slide-over-title').innerText = 'Create customer'

    loadCustomers()
    loadCustomersForm()
}

document.addEventListener('DOMContentLoaded', onCustomers) // Just here to be the first to be loaded