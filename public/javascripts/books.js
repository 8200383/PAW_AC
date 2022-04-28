const onBooks = () => {
    document.getElementById('title').innerText = 'Books'
    document.getElementById('action').innerText = 'Create book'

    fetch('http://localhost:3000/api/books')
        .then(res => res.json())
        .then(raw => raw['books'])
        .then((books) => {

            const columns = extractColumns(books[0])
            renderTable(columns, books)
        })
        .catch(err => console.error(err))
}