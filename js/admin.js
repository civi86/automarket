import { usersListRequest, deleteUserRequest } from './apiRequests.js'
import { tokenDecode, loadingIndicator } from './functions.js'
import { notification } from './notification.js'

const usersTable = document.createElement('table')

const container = document.createElement('div')
container.id = 'admin-container'

const innerContainer = document.createElement('div')
innerContainer.id = 'inner-admin-container'

const closeBtn = document.createElement('button')
closeBtn.textContent = 'X'
closeBtn.id = 'close-container-btn'

const showUsersListBtn = document.getElementById('show-users-list')
const body = document.getElementsByTagName('body')[0]

// First check if there is token and user role is admin in token
if (!localStorage.getItem('token') || tokenDecode().role !== 'admin') {
  body.innerHTML = ''
  notification({ name: 'Error', message: 'Ei oikeuksia!', doWeRedirectLater: true })
  setTimeout(() => { window.location = '../index.html' }, 5000)
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
      resolve() })
    noBtn.addEventListener('click', (event) => { 
      reject() })
  })

  return { containerDiv, confirmationPromise }
}

const deleteUserEvent = async (event, userId) => {
  const rowElement = event.target.parentElement.parentElement
  const box = confirmationBox('Poistetaanko käyttäjä?')
  const div = box.containerDiv
  container.prepend(div)
  
  box.confirmationPromise
    .then(() => {
      deleteUserRequest(userId)
        .then(response => {
          if (response) {
            usersTable.deleteRow(rowElement.rowIndex)
            container.removeChild(div)
            notification({ name: 'Info', message: 'Käyttäjä poistettu onnistuneesti', doWeRedirectLater: false })
          }
        })
    })
    .catch(() => { container.removeChild(div) })
}

const headerDiv = (header) => {
  const div = document.createElement('div')
  div.id = 'admin-container-header'
  const h3 = document.createElement('h3')
  h3.textContent = header
  div.appendChild(h3)
  return div
}

const generateTableHeader = (table, cellContents) => {
  const header = table.createTHead()
  const row = header.insertRow(0)
  for (const content of cellContents) {
    const cell = row.insertCell()
    cell.textContent = content
  }
}

const generateTableBody = (table, contents) => {
  const body = table.createTBody()
  contents.map((content) => {
    const contentRow = { id: content.id, username: content.username, role: content.role, registrationDate: content.registrationDate, delete: null }
    const row = body.insertRow()
    for (const [key, content] of Object.entries(contentRow)) {
      if (key === 'delete') {
        const button = document.createElement('button')
        button.textContent = 'delete'
        button.addEventListener('click', (event) => { 
          deleteUserEvent(event, contentRow['id']) })
        const cell = row.insertCell()
        cell.appendChild(button)
        continue
      }
      const cell = row.insertCell()
      cell.textContent = content
    }
  })
}

const showUsersListEvent = async (event) => {
  event.stopPropagation()
  container.innerHTML = ''
  const indicatorDiv = loadingIndicator()
  innerContainer.appendChild(indicatorDiv)

  container.appendChild(innerContainer)
  const div = headerDiv('Käyttäjälista')
  div.appendChild(closeBtn)
  container.prepend(div)
  usersTable.innerHTML = ''
  generateTableHeader(usersTable, ['ID', 'username', 'role', 'registrationDate', 'delete'])

  body.prepend(container)

  const users = await usersListRequest()
  if (users) {
    innerContainer.appendChild(usersTable)
    innerContainer.removeChild(indicatorDiv)
    generateTableBody(usersTable, users)
  }
}

closeBtn.addEventListener('click', () => { body.removeChild(container) })
showUsersListBtn.addEventListener('click', (event) => { showUsersListEvent(event) })
