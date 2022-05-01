const onAuth = async () => {
    const account = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
    }

    await fetch('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
    })
        .then((raw) => raw.json())
        .then((res) => {
                if (res['error']) {
                    document.getElementById('error').innerHTML = res['error']
                    document.getElementById('error').classList.remove('hidden')
                    localStorage.clear()
                    return
                }

                document.getElementById('error').classList.add('hidden')
                localStorage.setItem('token', res['token'])
                localStorage.setItem('email', account.email)

                retrieveAccountInfo(account.email)
                showHideAuth()
            },
        )
}

const retrieveAccountInfo = async (email) => {
    await fetch(`http://localhost:3000/api/account/${email}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((raw) => raw.json())
        .then((res) => {
            document.getElementById('email-account').innerHTML = res['email']
            document.getElementById('role').innerHTML = res['role']
        })
}

const logout = () => {
    localStorage.clear()
    location.reload()
}

const isLoggedIn = () => {
    return localStorage.getItem('token') !== null
}

const showHideAuth = () => {
    if (!isLoggedIn()) {
        document.getElementById('dashboard').classList.add('hidden')
        document.getElementById('auth').classList.remove('hidden')
    } else {
        document.getElementById('dashboard').classList.remove('hidden')
        document.getElementById('auth').classList.add('hidden')
    }
}

const onLoad = () => {
    document.getElementById('auth-btn').addEventListener('click', onAuth)

    if (isLoggedIn()) {
        retrieveAccountInfo(localStorage.getItem('email'))
    }

    showHideAuth()
}

document.addEventListener('DOMContentLoaded', onLoad)