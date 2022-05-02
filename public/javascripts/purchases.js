/*const loadPurchases = () => {
    document.getElementById('title').innerText = 'Purchases'
    document.getElementById('action').innerText = 'Create purchase'
    document.getElementById('slide-over-title').innerText = 'Create purchase'

    fetch('http://localhost:3000/api/purchases')
        .then((res) => res.json())
        .then((raw) => raw['purchases'])
        .then((purchases) => {
            if (purchases.length != 0) {
                const columns = extractColumns(purchases[0])
                renderTable(columns, purchases)
                remodelPurchasesTable(purchases)
            }
        })
        .catch((err) => {
            console.log(err)
        })
} */
/*
const remodelPurchasesTable = (purchases) => {
    const container = document.getElementById('container')
    const tbody = container.firstChild.firstChild.nextSibling
    const tableRows = tbody.childNodes
    var purchaseCounter = 0

    tableRows.forEach((tr) => {
        var isbn = purchases[purchaseCounter++].isbn.split(',')
        var newTable = document.createElement('table')

        isbn.forEach((isbn) => {
            var newTr = document.createElement('tr')
            var isbnTd = document.createElement('td')
            var quantityTd = document.createElement('td')
            var isbnDiv = tr.firstChild.firstChild.cloneNode(true)
            var quantityDiv = tr.firstChild.firstChild.cloneNode(true)

            newTable.appendChild(newTr)
            newTr.appendChild(isbnTd)
            newTr.appendChild(quantityTd)
            isbnTd.appendChild(isbnDiv)
            quantityTd.appendChild(quantityDiv)
            tr.firstChild.appendChild(newTable)
            isbnDiv.innerHTML = isbn
            quantityDiv.innerHTML = 2 //brute force
        })
        tr.firstChild.firstChild.remove()
    })
} */
/*
const loadPurchasesForm = () => {
    fetch('http://localhost:3000/forms/purchases.ejs')
        .then((response) => response.text())
        .then((text) => onLoadPurchasesForm(text))
        .catch((err) => console.error(err))
}

const onLoadPurchasesForm = (text) => {
    document.getElementById('form-container').innerHTML = text

    const btn = document.getElementById('form-action')
    btn.innerHTML = 'Save Purchase'
    btn.addEventListener('click', onPurchaseSave)
}

const onPurchaseSave = () => {
    console.log('saved')
}
 */