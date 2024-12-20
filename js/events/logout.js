import { notification } from '../notification.js'
const logoutBtn = document.getElementById('log-out')

const logoutEvent = () => {
  console.log('Logout')
  localStorage.removeItem('token')
  notification({ error: { name: 'Info', message: 'Kirjauduttu ulos onnistuneesti' }, doWeRedirectLater: true })
  setTimeout(() => { window.location = '/index.html' }, 5000)
}

logoutBtn.addEventListener('click', logoutEvent)

export { logoutEvent }