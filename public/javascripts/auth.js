const auth = async () => {
    const account = {
        'email': document.getElementById('email-address').value,
        'password': document.getElementById('password').value,
    }

    console.log(account)

    const rawResponse = await fetch('http://localhost:3000/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
    })
        .then((raw) => raw.json())
        .then((res) => {
            console.log(res)
            if (!res.ok) {
                document.getElementById('error').innerHTML = res['error']
                document.getElementById('error').classList.remove('hidden')
            } else {

            }
        })
}

document.getElementById('loginButton').addEventListener('click', auth)