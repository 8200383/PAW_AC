const onEmployees = () => {
    document.getElementById('title').innerText = 'Employees'
    document.getElementById('action').innerText = 'Create employees'
    document.getElementById('slide-over-title').innerText = 'Create employees'

    fetch('http://localhost:3000/api/employees')
        .then(res => res.json())
        .then(raw => raw['employees'])
        .then((employees) => {

            const columns = extractColumns(employees[0])
            renderTable(columns, employees)
        })
        .catch(err => console.error(err))
}