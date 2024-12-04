import { login } from './login.js'

const backEndUrl = 'https://automarketbackend.onrender.com/api'

const registrationRequest = async (data) => {
    const request = new Request(backEndUrl + '/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),

    })
    const response = await fetch(request)
    if (response.ok) {
        const result = await response.json()
        console.log(result)
    }
    else {
        console.log(response)
    }

}

const loginRequest = async (data) => {
    const request = new Request(backEndUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    })
    const response = await fetch(request)
    if (response.ok) {
        const result = await response.json()

        localStorage.setItem('token', result.token)
        login()
    }
    else {
        console.log(response)
    }
}




export { registrationRequest, loginRequest }