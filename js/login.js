import { tokenDecode } from './functions.js'
import { loginForm, loginDiv, loggedUsername, logOutDiv } from './htmlElements.js'

const login = () => {
    loginForm.reset()
    loginDiv.setAttribute('hidden', '')
    logOutDiv.removeAttribute('hidden')
    loggedUsername.textContent = `Kirjautunut sisään: ${tokenDecode().username}`

    console.log('Kirjauduttu sisään onnistuneesti')
}

const logout = () => {
    localStorage.removeItem('token')
    loginDiv.removeAttribute('hidden')
    loggedUsername.textContent = ''
    logOutDiv.setAttribute('hidden', '')

    console.log('Kirjauduttu ulos onnistuneesti')
}

export { login, logout }