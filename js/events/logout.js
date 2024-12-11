import { notification } from '../notification.js'
const logoutBtn = document.getElementById('log-out')
console.log(logoutBtn)

const logoutEvent = () => {
  console.log('Logout')
  localStorage.removeItem('token')
  notification({ name: 'Info', message: 'Kirjauduttu ulos onnistuneesti' }, true)
  setTimeout(() => { window.location = '../index.html' }, 5000)
}

logoutBtn.addEventListener('click', logoutEvent)