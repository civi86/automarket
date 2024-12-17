import { confirmationBox } from './functions.js'
import { sendMessageRequest } from './apiRequests.js'

const receivedMessagesBtn = document.getElementById('received-msg-btn')
const sendedMessagesBtn = document.getElementById('sended-msg-btn')
const sendMessagesBtn = document.getElementById('send-msg-btn')

const generateMessageBox = (title, recipientUserId, announcementId) => {
  const messageContainer = document.createElement('div')
  messageContainer.classList.add('msg-container')

  const headerDiv = document.createElement('div')
  headerDiv.classList.add('msg-header')
  const h3 = document.createElement('h3')
  h3.classList.add('center')
  h3.textContent = title
  headerDiv.appendChild(h3);

  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'X'
  closeBtn.id = 'close-container-btn'

  headerDiv.appendChild(closeBtn)

  const bodyDiv = document.createElement('div')
  bodyDiv.classList.add('center')
  //bodyDiv.id = 'msg-body'
  const form = document.createElement('form')

  const messageArea = document.createElement('textarea')
  messageArea.setAttribute('name', 'message')
  messageArea.id = 'message-textarea'

  const messageLabel = document.createElement('Label')
  messageLabel.textContent = 'Viesti'
  messageLabel.setAttribute('for', 'message-textarea')

  const box = confirmationBox('Lähetetäänkö viesti?')
  const confirmationDiv = box.containerDiv
  box.confirmationPromise
    .then(() => {
      const message = messageArea.value
      sendMessageRequest({ recipientUserId, message, announcementId})
    })
    .catch(() => messageContainer.removeChild(confirmationDiv))

  const messageButton = document.createElement('button')
  messageButton.textContent = 'Lähetä'
  messageButton.addEventListener('click', (event) => {
    event.preventDefault()
    messageContainer.prepend(confirmationDiv)

  })



  form.appendChild(messageLabel)
  form.appendChild(messageArea)
  form.appendChild(messageButton)

  bodyDiv.appendChild(form)
  messageContainer.appendChild(headerDiv)
  messageContainer.appendChild(bodyDiv)
  closeBtn.addEventListener('click', () => { messageContainer.parentElement.removeChild(messageContainer) })

  return messageContainer
}

export { generateMessageBox }