import { loginRequest } from '../apiRequests.js'
import { tokenDecode, loadingIndicator } from '../functions.js'
import { notification } from "../notification.js"

const loginSubmitBtn = document.getElementById('loginSubmit')
const usernameElement = document.getElementById('username')
const passwordElement = document.getElementById('password')

const loginEvent = (event) => {
  try {
    event.preventDefault()
    const indicatorDiv = loadingIndicator()
    indicatorDiv.style.left = '91.5%'
    indicatorDiv.style.top = 'unset'
    indicatorDiv.style.width = '20px'
    indicatorDiv.style.height = '20px'
    loginSubmitBtn.parentElement.prepend(indicatorDiv)
    
    const username = usernameElement.value
    const password = passwordElement.value
    if (username === '') {
      throw new Error('Käyttäjänimi puuttuu')
    }
    if (password === '') {

      throw new Error('Salasana puuttuu')
    }
    loginRequest({ username, password })
      .then(result => {
        localStorage.setItem('token', result.token)
        console.log('Token saved to localstorage')
        loginSubmitBtn.parentElement.removeChild(indicatorDiv)
        notification({ error: { name: 'Info', message: 'Kirjauduttu sisään onnistuneesti' }, doWeRedirectLater: true })
        if (tokenDecode().role === 'admin') {
          setTimeout(() => { window.location = '/sivut/admin.html' }, 5000)
        }
        else {
          setTimeout(() => { window.location = '/sivut/julkaisut.html' }, 5000)
        }
      })
      .catch(error => console.log(error))

  }
  catch (error) {
    notification({error})
  }
}

loginSubmitBtn.addEventListener('click', loginEvent)
