import { registrationRequest } from '../apiRequests.js'
import { notification } from '../notification.js'

const registerSubmitBtn = document.getElementById('reg-registration')
const regUsername = document.getElementById('reg-username')
const regPassword = document.getElementById('reg-password')
const regEmail = document.getElementById('reg-email')
const regPhoneNumber = document.getElementById('reg-number')

const registrationEvent = (event) => {
  try {
    event.preventDefault()
    const username = regUsername.value
    const password = regPassword.value
    //const email = regEmail.value
    //const phoneNumber = regPhoneNumber.value

    if (username === '' || password === '') {
      throw new Error('Käyttäjänimi tai/ja salasana puuttuu')
    }
    if (password.length < 8) {
      throw new Error('Salasana liian lyhyt')
    }

    registrationRequest({ username, password })
      .then(() => {
        notification({ name: 'Info', message: 'Kirjauduttu sisään onnistuneesti' }, true)
        setTimeout(() => { window.location = 'julkaisut.html' }, 5000)
      })
  }
  catch (error) {
    console.log(error)
    notification(error)
  }
}

registerSubmitBtn.addEventListener('click', registrationEvent)