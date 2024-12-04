import { loginRequest, registrationRequest } from './js/apiRequests.js'
import * as htmlElements from './js/htmlElements.js'
import { logout } from './js/login.js'

const registrationEvent = (event) => {
    try {
        event.preventDefault()
        const username = htmlElements.username.value
        const password = htmlElements.password.value
        if (username === '' || password === '') {
            throw new Error('Käyttäjänimi tai/ja salasana puuttuu')
        }
        registrationRequest({ username, password })
    }
    catch (error) {
        console.log(error.message)
    }
}

const loginEvent = (event) => {
    try {
        event.preventDefault()
        const username = htmlElements.username.value
        const password = htmlElements.password.value
        if (username === '') {
            throw new Error('Käyttäjänimi puuttuu')
        }
        if (password.length < 8) {

            throw new Error('Salasana liian lyhyt')
        }
        loginRequest({ username, password })
    }
    catch (error) {
        console.log(error.message)
    }
}



htmlElements.logoutBtn.addEventListener('click', logout)
htmlElements.registrationBtn.addEventListener('click', registrationEvent)
htmlElements.loginBtn.addEventListener('click', loginEvent)