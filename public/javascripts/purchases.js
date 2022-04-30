const onPurchases = () => {
    document.getElementById('title').innerText = 'Purchases'
    document.getElementById('action').innerText = 'Create purchase'

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
}

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
}

window.addEventListener('load', () => {
    document.getElementById('action').addEventListener('click', () => {
        document.getElementById('purchaseForm').style.visibility = 'visible'
        document.getElementById('addIsbn').click()
    })
})

window.addEventListener('load', () => {
    document.getElementById('addIsbn').addEventListener('click', () => {
        const isbnDiv =
            document.getElementById('purchaseForm').children[1]
        const gridDiv = document.createElement('div')
        gridDiv.setAttribute('class', 'grid xl:grid-cols-3 xl:gap-6')

        const floatingIsbnDiv = document.createElement('div')
        floatingIsbnDiv.setAttribute('class', 'relative z-0 w-full mb-6 group')

        const floatingQauntityDiv = document.createElement('div')
        floatingQauntityDiv.setAttribute(
            'class',
            'relative z-0 w-full mb-6 group'
        )

        //inputs
        const inputIsbn = document.createElement('input')
        inputIsbn.setAttribute('type', 'text')
        inputIsbn.setAttribute('required', 'true')
        inputIsbn.setAttribute('name', 'floating_isbn')
        inputIsbn.setAttribute(
            'class',
            'block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
        )
        inputIsbn.setAttribute('placeholder', ' ')

        const inputQuantity = document.createElement('input')
        inputQuantity.setAttribute('type', 'text')
        inputQuantity.setAttribute('required', 'true')
        inputQuantity.setAttribute('name', 'floating_quantity')
        inputQuantity.setAttribute(
            'class',
            'block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
        )
        inputQuantity.setAttribute('placeholder', ' ')

        //labels
        const labelIsbn = document.createElement('label')
        labelIsbn.setAttribute('for', 'floating_isbn')
        labelIsbn.innerHTML = 'ISBN'
        labelIsbn.setAttribute(
            'class',
            'peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        )

        const labelQuantity = document.createElement('label')
        labelQuantity.setAttribute('for', 'floating_quantity')
        labelQuantity.innerHTML = 'Quantity'
        labelQuantity.setAttribute(
            'class',
            'peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        )

        //remove button
        const removeButton = document.createElement('button')
        removeButton.setAttribute('type', 'button')
        removeButton.setAttribute('name', 'removeDiv')
        removeButton.setAttribute(
            'class',
            'w-fit h-fit bg-transparent hover:bg-red-500 text-red-700 text-sm p-2 font-semibold hover:text-white border border-red-500 hover:border-transparent rounded'
        )
        removeButton.innerHTML = 'Remove'

        isbnDiv.append(gridDiv)
        //isbn
        gridDiv.append(floatingIsbnDiv)
        floatingIsbnDiv.append(inputIsbn)
        floatingIsbnDiv.append(labelIsbn)
        //quantity
        gridDiv.append(floatingQauntityDiv)
        floatingQauntityDiv.append(inputQuantity)
        floatingQauntityDiv.append(labelQuantity)
        //removeButton
        gridDiv.append(removeButton)

        removeButton.addEventListener('click', ()=>{
            removeButton.parentElement.remove()
        })
    })
})

window.addEventListener('load', () => {
    document.getElementById('closeButton').addEventListener('click', () => {
        document.getElementById('purchaseForm').style.visibility = 'hidden'
        document.getElementById('purchaseForm').children[1].innerHTML = ''
    })
 })

