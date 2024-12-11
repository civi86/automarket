const notificationDiv = document.createElement('div')
const body = document.getElementsByTagName('body')[0]

const notification = (error, doWeRedirectLater = false) => {
  console.log(error)

  if (error.name === 'Error') {
    notificationDiv.style.backgroundColor = 'red'
  }
  else if (error.name === 'Info') {
    notificationDiv.style.backgroundColor = 'green'
  }
  else {
    notificationDiv.style.backgroundColor = 'brown' //hörhör
  }
  notificationDiv.classList.add('notification')
  notificationDiv.textContent = error.message
  body.prepend(notificationDiv)
  if (!doWeRedirectLater) {
    setTimeout(() => { body.removeChild(notificationDiv) }, 5000)
  }
}

export { notification }