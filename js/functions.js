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

const getFilteredArray = (rawDataObject, filterObject) => {
  const filteredData = Object.keys(filterObject).filter(key => key in rawDataObject).map((key) => [
    filterObject[key],
    rawDataObject[key],
  ])
  return filteredData
}

const getFilteredMap = (data, allowedKeys) => {
  const filteredData = new Map(allowedKeys.filter(key => key in data).map(key => [key, data[key]]))
  return filteredData
}

const isDomObject = (entity) => {
  return typeof entity === 'object' && entity.nodeType !== undefined
}

const formatDate = (rawDate) => {
  const date = new Date(rawDate)
  return `${date.toLocaleDateString("fi-FI")} ${date.toLocaleTimeString("fi-FI")}`
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
          const main = document.getElementsByTagName('main')[0]
          const preventBgClicks = document.getElementsByClassName('prevent-bg-clicks')[0]
          main.removeChild(preventBgClicks)
          main.removeChild(messageContainer)
        })
    })
    .catch(() => {
      const main = document.getElementsByTagName('main')[0]
      const preventBgClicks = document.getElementsByClassName('prevent-bg-clicks')[0]
      main.removeChild(preventBgClicks)
      main.removeChild(messageContainer)
    })

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

  container.closePromise
    .then(() => {
      const main = document.getElementsByTagName('main')[0]
      const preventBgClicks = document.getElementsByClassName('prevent-bg-clicks')[0]
      main.removeChild(preventBgClicks)
    })

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

const generateTableHeader = (headerArray) => {
  const header = document.createElement('thead')
  const row = header.insertRow()
  for (const item of headerArray) {
    const cell = row.insertCell()
    cell.textContent = item
  }
  return header
}

const generateTableBody = (bodyArrays) => {
  const body = document.createElement('tbody')
  for (const array of bodyArrays) {
    const tableRow = body.insertRow()
    for (const item of array) {
      const cell = tableRow.insertCell()
      if (isDomObject(item)) {
        cell.appendChild(item)
        continue
      }
      cell.textContent = item
    }
  }
  return body
}

const generateTable = ({data, headers = null}) => {
  const table = document.createElement('table')

  if (headers) {
    const tableHeader = generateTableHeader(headers)
    table.appendChild(tableHeader)
  }
  const tableBody = generateTableBody(data)

  table.appendChild(tableBody)

  return table
}

export {
  tokenDecode,
  loadingIndicator,
  confirmationBox,
  generateContainer,
  generateMessageBox,
  generateSelectMenu,
  generateTable,
  isDomObject,
  getFilteredMap,
  getFilteredArray,
  formatDate,
}