import { tokenDecode } from '../functions.js'
import { logoutEvent } from './logout.js'

const autoLogout = () => {
  const decodedToken = tokenDecode()
  if (decodedToken) {
    const div = document.getElementById('log-out-div')
    const counter = document.createElement('span')
    div.appendChild(counter)
    const timestamp = Date.now()
    const logoutTime = decodedToken.exp * 1000 - timestamp
    console.log(`Time now: ${new Date(timestamp).toString()}\nLogout time: ${new Date(decodedToken.exp * 1000).toString()}`)
    const timer = setInterval(() => {
      const time = decodedToken.exp * 1000 - Date.now()
      counter.textContent = `Aikaa uloskirjautmiseen: ${new Date(time).toISOString().substring(14, 19)}`
    }, 1000)
    const timeout = setTimeout(logoutEvent, logoutTime);
  }
  else {
    logoutEvent()
  }
}

autoLogout()

//export { autoLogout }