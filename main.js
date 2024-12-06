import { loginRequest, registrationRequest } from './js/apiRequests.js'
import * as htmlElements from './js/htmlElements.js'
import { logout } from './js/login.js'

const registrationEvent = (event) => {
    try {
        event.preventDefault()
        const username = htmlElements.regUsername.value
        const password = htmlElements.regPassword.value
        //const email = htmlElements.regEmail.value
        //const phoneNumber = htmlElements.regPhoneNumber.value

        if (username === '' || password === '') {
            throw new Error('Käyttäjänimi tai/ja salasana puuttuu')
        } 
        if (password.length < 8) {
            throw new Error('Salasana liian lyhyt')
        }
        window.location = 'julkaisut.html'

        registrationRequest({ username, password })
        console.log(username, password)
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
        window.location = 'sivut/julkaisut.html'
        loginRequest({ username, password })
    }
    catch (error) {
        console.log(error.message)
    }
}

const registrationReDirect = () => {
    window.location = 'sivut/rekisterointi.html'
}

htmlElements.logoutBtn.addEventListener('click', logout)
htmlElements.registrationBtn.addEventListener('click', registrationReDirect)
htmlElements.loginBtn.addEventListener('click', loginEvent)

htmlElements.registrationSubmit.addEventListener('click', registrationEvent)