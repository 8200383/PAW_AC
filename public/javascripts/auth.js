const onAuth = async () => {
    const account = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
    }

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
                if (res['error']) {
                    document.getElementById('error').innerHTML = res['error']
                    document.getElementById('error').classList.remove('hidden')
                    localStorage.clear()
                    return
                }

                document.getElementById('error').classList.add('hidden')
                localStorage.setItem('token', res['token'])
                showHideAuth()
            },
        )
}

const showHideAuth = () => {
    if (localStorage.getItem('token') == null) {
        document.getElementById('dashboard').classList.add('hidden')
        document.getElementById('auth').classList.remove('hidden')
    } else {
        document.getElementById('dashboard').classList.remove('hidden')
        document.getElementById('auth').classList.add('hidden')
    }
}

const onLoad = () => {
    document.getElementById('auth-btn').addEventListener('click', onAuth)

    showHideAuth()
}

document.addEventListener('DOMContentLoaded', onLoad)