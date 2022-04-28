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

const onCustomers = () => {
    document.getElementById('title').innerText = 'Customers'
    document.getElementById('action').innerText = 'Create customer'

    fetch('http://localhost:3000/api/customers')
        .then(res => res.json())
        .then(raw => raw['customers'])
        .then(customers => {

            const columns = Object.keys(customers[0])
                .map((column) => column.replaceAll('_', ' '))

            renderTable(columns, customers)

        })
        .catch(err => console.error(err))
}