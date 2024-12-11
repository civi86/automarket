import { loginRequest } from '../apiRequests.js'
import { notification } from "../notification.js"

const loginSubmitBtn = document.getElementById('loginSubmit')
const usernameElement = document.getElementById('username')
const passwordElement = document.getElementById('password')

const loginEvent = (event) => {
  try {
    event.preventDefault()
    const username = usernameElement.value
    const password = passwordElement.value
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
        notification({ name: 'Info', message: 'Kirjauduttu sisään onnistuneesti' }, true)
        setTimeout(() => { window.location = '../sivut/julkaisut.html' }, 5000)
      })
      .catch(error => console.log(error))

  }
  catch (error) {
    notification(error)
  }
}

loginSubmitBtn.addEventListener('click', loginEvent)