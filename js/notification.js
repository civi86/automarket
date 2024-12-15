const notificationDiv = document.createElement('div')
const body = document.getElementsByTagName('body')[0]

const notification = ({error, doWeRedirectLater = false, stayOn = false}) => {
  console.log(error)

  if (error.name === 'Error') {
    notificationDiv.style.backgroundColor = 'rgba(165, 0, 0, 0.85)'
  }
  else if (error.name === 'Info') {
    notificationDiv.style.backgroundColor = 'rgba(0, 165, 3, 0.85)'
  }
  else {
    notificationDiv.style.backgroundColor = 'rgba(139,69,19,0.85)' //hörhör
  }
  notificationDiv.classList.add('notification')
  notificationDiv.textContent = error.message
  body.prepend(notificationDiv)

  if (!(doWeRedirectLater || stayOn)) {
    // Remove notification after 5 seconds
    setTimeout(() => { body.removeChild(notificationDiv) }, 5000)
  }
}

export { notification }