const loadBooks = () => {
    fetch('http://localhost:3000/api/books')
        .then((res) => res.json())
        .then((raw) => raw['books'])
        .then((books) => {
            const columns = extractColumns(books[0])
            renderTable(columns, books)
        })
        .catch((err) => console.error(err))
}

const loadBooksForm = () => {
    fetch('http://localhost:3000/forms/books.ejs')
        .then((response) => response.text())
        .then((text) => onLoadBooksForm(text))
        .catch((err) => console.error(err))
}

const onLoadBooksForm = (text) => {
    document.getElementById('form-container').innerHTML = text

    const btn = document.getElementById('form-action')
    btn.innerHTML = 'Save Book'
    btn.addEventListener('click', onBookSave)
}

const onBookSave = () => {
    fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isbn: document.getElementById('isbn').value,
            stock_new: document.getElementById('stock-new').value,
            stock_used: document.getElementById('stock-used').value,
        }),
    })
        .then(loadBooks())
        .catch((err) => console.error(err))        
}

const onBooks = () => {
    document.getElementById('title').innerText = 'Books'
    document.getElementById('action').innerText = 'Create book'
    document.getElementById('slide-over-title').innerText = 'Create book'

    loadBooks()
    loadBooksForm()
}

document.addEventListener('DOMContentLoaded', onBooks)
