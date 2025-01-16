import { sendMessageRequest } from './apiRequests.js'

const tokenDecode = () => {
  const tokenFromLocalStorage = localStorage.getItem('token')

  if (tokenFromLocalStorage !== 'undefined' && tokenFromLocalStorage !== null) {
    const arrayOfToken = tokenFromLocalStorage.split('.')
    const decodedToken = JSON.parse(atob(arrayOfToken[1]))
    return decodedToken
  }
  return null
}

const loadingIndicator = () => {
  const div = document.createElement('div')
  div.classList.add('loading')
  return div
}

const filterData = (data, allowedKeys) => {
  const list = data.map(item => {
    return Object.fromEntries(
      Object.entries(item).filter(
        ([key]) => key in allowedKeys
      )
    )
  })

  return list
}

const filterKeys = (data, allowedKeys) => {
  // const filteredData = allowedKeys.filter(key => key in data).map((key) => [
  //   key,
  //   data[key],
  // ])
  const filteredData = new Map(allowedKeys.filter(key => key in data).map(key => [key, data[key]]))

  return filteredData
}

const generateContainer = (containerTitle) => {
  const container = document.createElement('div')
  container.classList.add('container-box')
  const headerDiv = document.createElement('div')
  headerDiv.classList.add('container-header')
  const h3 = document.createElement('h3')
  h3.classList.add('center')
  h3.textContent = containerTitle
  headerDiv.appendChild(h3)
  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'X'
  closeBtn.id = 'close-container-btn'

  headerDiv.appendChild(closeBtn)

  const closePromise = new Promise((resolve, reject) => {
    closeBtn.addEventListener('click', () => {
      container.parentElement.removeChild(container)
      resolve()
    })
  })
  container.appendChild(headerDiv)
  const bodyDiv = document.createElement('div')
  bodyDiv.classList.add('center')

  container.appendChild(bodyDiv)
  return { container, headerDiv, bodyDiv, closePromise }
}

const confirmationBox = (message) => {
  const containerDiv = document.createElement('div')
  containerDiv.id = 'confirm-container'

  const confirmationDiv = document.createElement('div')
  const confirmationText = document.createElement('p')
  const yesBtn = document.createElement('button')

  yesBtn.textContent = 'Kyllä'
  const noBtn = document.createElement('button')
  noBtn.textContent = 'Ei'
  confirmationText.textContent = message
  confirmationDiv.id = 'confirm-box'
  confirmationDiv.appendChild(confirmationText)
  confirmationDiv.appendChild(yesBtn)
  confirmationDiv.appendChild(noBtn)
  containerDiv.appendChild(confirmationDiv)
  const confirmationPromise = new Promise((resolve, reject) => {
    yesBtn.addEventListener('click', (event) => {
      resolve()
    })
    noBtn.addEventListener('click', (event) => {
      reject()
    })
  })

  return { containerDiv, confirmationPromise }
}

const generateMessageBox = ({ title, recipientUserId, announcementId, topicId = null, main }) => {
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
      sendMessageRequest({ recipientUserId, message, announcementId, topicId })
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

const generateSelectMenu = (array, setSelectedValue) => {
  const select = document.createElement('select')
  array.forEach(row => {
    const option = document.createElement('option')
    option.text = row.charAt(0).toUpperCase() + row.slice(1)
    option.value = row
    if (row === setSelectedValue) {
      option.setAttribute('selected', '')
    }
    select.add(option)

  })
  return select
}

const isDomObject = (entity) => {
  return typeof entity === 'object' && entity.nodeType !== undefined
}



export { tokenDecode, loadingIndicator, confirmationBox, generateContainer, generateMessageBox, generateSelectMenu, isDomObject, filterData, filterKeys }