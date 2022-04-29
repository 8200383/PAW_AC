const onPurchases = () => {
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
}
