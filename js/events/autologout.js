import { tokenDecode } from '../functions.js'
import { logoutEvent } from './logout.js'

const autoLogout = () => {
  const decodedToken = tokenDecode()
  if (decodedToken) {
    const timestamp = Date.now()
    console.log(decodedToken.exp * 1000)
    console.log(timestamp)
    const logoutTime = decodedToken.exp * 1000 - timestamp;
    console.log(logoutTime)
    console.log(`Time now: ${new Date(timestamp).toString()}\nLogout time: ${new Date(logoutTime).toString()}`)

    const timeout = setTimeout(logoutEvent, logoutTime);
  }
  else {
    logoutEvent()
  }
}

autoLogout()

//export { autoLogout }