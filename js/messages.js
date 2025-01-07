import { confirmationBox, generateContainer } from './functions.js'
import { sendMessageRequest, messagesRequest } from './apiRequests.js'
import { notification } from './notification.js'

const showMessagesBtn = document.getElementById('message-btn')
const main = document.getElementsByTagName('main')[0]

const generateMessageBox = (title, recipientUserId, announcementId, announcementType) => {
  const container = generateContainer(title)
  const messageContainer = container.container
  messageContainer.classList.add('msg-container')
  const headerDiv = container.headerDiv
  const bodyDiv = container.bodyDiv
  bodyDiv.classList.add('msg-body')

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
      sendMessageRequest({ recipientUserId, message, announcementId, announcementType })
        .then(() => {
          main.removeChild(messageContainer)
        })

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

  return messageContainer
}


const generateMessagesList = (data) => {
  const div = document.createElement('div')
  div.classList.add('messages-list')
  data.forEach(topic => {
    const ul = document.createElement('ul')
    const announcement = document.createElement('li')
    const date = document.createElement('li')
    date.textContent = topic._id.date
    announcement.textContent = `Ilmoitus: ${topic._id.announcement.mark} ${topic._id.announcement.model} ${topic._id.announcement.mileage} km ${topic._id.announcement.price} €`
    announcement.classList.add('msg-announcement')
    ul.appendChild(announcement)
    ul.appendChild(date)
    topic.messages.forEach(row => {
      const li = document.createElement('li')
      const sender = document.createElement('span')
      sender.classList.add('msg-sender')
      sender.textContent = `${row.senderUser}: `
      const msg = document.createElement('span')
      msg.textContent = row.message
      li.appendChild(sender)
      li.appendChild(msg)
      ul.appendChild(li)
    })
    const button = document.createElement('button')
    button.addEventListener('click', () => {
      const messageBox = generateMessageBox('Vastaa viestiin', topic.messages[0].recipientUserId, topic._id.announcement, 'sell')
      main.appendChild(messageBox)
    })
    button.textContent = 'Vastaa'
    ul.appendChild(button)
    div.appendChild(ul)
  })

  return div
}

if (showMessagesBtn) {
  showMessagesBtn.addEventListener('click', async () => {
    messagesRequest()
      .then(result => {
        if (result !== undefined && result.status !== 204) {
          const messagesContainer = generateContainer('Viestit')
          const receivedMsgDiv = document.createElement('div')

          const innerMessageContainer = document.createElement('div')
          innerMessageContainer.appendChild(receivedMsgDiv)
          messagesContainer.bodyDiv.appendChild(innerMessageContainer)

          const receivedList = generateMessagesList(result)
          receivedMsgDiv.appendChild(receivedList)

          const main = document.getElementsByTagName('main')[0]
          main.prepend(messagesContainer.container)
        }
        else {
          notification({ error: { name: 'Info', message: 'Ei viestejä' }, doWeRedirectLater: false })
        }
      })
      .catch(error => console.log("error :", error))
  })
}

export { generateMessageBox }