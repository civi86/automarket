import { loginRequest, registrationRequest } from './js/apiRequests.js'
import * as htmlElements from './js/htmlElements.js'
import { logout, login } from './js/login.js'

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
        
        registrationRequest({ username, password })
            .then(() => {
                window.location = 'julkaisut.html'
            })
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
        loginRequest({ username, password })
            .then(result => {
                localStorage.setItem('token', result.token)
                console.log('Token saved to localstorage')
                
                window.location = 'sivut/julkaisut.html'
                login()
            })
                
            .catch(error => console.log(error))
        
    }
    catch (error) {
        console.log(error)
    }
}

const registrationReDirect = () => {
    window.location = 'sivut/rekisterointi.html'
}

htmlElements.logoutBtn.addEventListener('click', logout)
htmlElements.registrationBtn.addEventListener('click', registrationReDirect)
htmlElements.loginBtn.addEventListener('click', loginEvent)

htmlElements.registrationSubmit.addEventListener('click', registrationEvent)