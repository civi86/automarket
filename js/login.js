import { tokenDecode } from './functions.js'
import { loginForm, loginDiv, logoutBtn, loggedUsername } from './htmlElements.js'

const login = () => {
    loginForm.reset()
    loginDiv.setAttribute('hidden', '')
    logoutBtn.removeAttribute('hidden')
    //loggedUsername.textContent = `Kirjautunut sisään: ${tokenDecode().username}`
    //loggedUsername.removeAttribute('hidden')

    console.log('Kirjauduttu sisään onnistuneesti')
}

const logout = () => {
    localStorage.removeItem('token')
    loginDiv.removeAttribute('hidden')
    logoutBtn.setAttribute('hidden', '')
    loggedUsername.textContent = ''
    loggedUsername.setAttribute('hidden', '')

    console.log('Kirjauduttu ulos onnistuneesti')
}

export { login, logout }