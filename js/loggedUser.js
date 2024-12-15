import { tokenDecode } from './functions.js'

const showLoggedUser = () => {
  const loggedUser = document.getElementById('logged-username')
  const decodedToken = tokenDecode()
  if (decodedToken) {
    loggedUser.textContent =`Kirjautunut käyttäjä: ${decodedToken.username}`
  }
}

showLoggedUser()