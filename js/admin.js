import { usersListRequest, deleteUserRequest, itemsListRequest, deleteItemRequest } from './apiRequests.js'
import { tokenDecode, loadingIndicator, confirmationBox } from './functions.js'
import { notification } from './notification.js'

const table = document.createElement('table')

const container = document.createElement('div')
container.id = 'admin-container'

const innerContainer = document.createElement('div')
innerContainer.id = 'inner-admin-container'

const closeBtn = document.createElement('button')
closeBtn.textContent = 'X'
closeBtn.id = 'close-container-btn'

const showUsersListBtn = document.getElementById('show-users-list')
const showAnnouncementsListBtn = document.getElementById('show-announcements-list')
const body = document.getElementsByTagName('body')[0]

// First check if there is token and user role is admin in token
if (!localStorage.getItem('token') || tokenDecode().role !== 'admin') {
  body.innerHTML = ''
  notification({ error: { name: 'Error', message: 'Ei oikeuksia!' }, doWeRedirectLater: true })
  setTimeout(() => { window.location = '../index.html' }, 5000)
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
            table.deleteRow(rowElement.rowIndex)
            container.removeChild(div)
            notification({ name: 'Info', message: 'Käyttäjä poistettu onnistuneesti', doWeRedirectLater: false })
          }
        })
    })
    .catch(() => { container.removeChild(div) })
}

const deleteItemEvent = async (event, itemId) => {
  const rowElement = event.target.parentElement.parentElement
  const box = confirmationBox('Poistetaanko ilmoitus?')
  const div = box.containerDiv
  container.prepend(div)

  box.confirmationPromise
    .then(() => {
      deleteItemRequest(itemId)
        .then(response => {
          if (response) {
            table.deleteRow(rowElement.rowIndex)
            container.removeChild(div)
            notification({ name: 'Info', message: 'Ilmoitus poistettu onnistuneesti', doWeRedirectLater: false })
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

const generateTableHeader = (table, data, filterList) => {
  const header = table.createTHead()
  const row = header.insertRow(0)
  Object.values(filterList).forEach(header => {
    const cell = row.insertCell()
    cell.textContent = header
  })
}

const generateTableBody = (table, data, filterList, eventCallBack) => {
  const tableBody = table.createTBody()
  data.forEach(row => {
    const tableRow = tableBody.insertRow()
    Object.keys(filterList).forEach(key => {
      if (key === 'thumbnailURLs') {
        const image = new Image(64)
        image.src = row['thumbnailURLs'][0]
        image.onerror = () => {
          image.src = '/../img/404.png';
        }
        const cell = tableRow.insertCell()
        cell.appendChild(image)
        return
      }
      if (key === 'delete') {
        const button = document.createElement('button')
        button.textContent = 'delete'
        button.addEventListener('click', (event) => {
          eventCallBack(event, row['id'])
        })
        const cell = tableRow.insertCell()
        cell.appendChild(button)
        return
      }
      const cell = tableRow.insertCell()
      cell.textContent = row[key]
    })
  })
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

const generateTable = (table, rawData, filterList, eventCallBack) => {
  table.innerHTML = ''
  const filteredData = filterData(rawData, filterList)
  generateTableHeader(table, filteredData, filterList)
  generateTableBody(table, filteredData, filterList, eventCallBack)
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

  body.prepend(container)

  const users = await usersListRequest()
  if (users) {
    generateTable(table, users, { id: 'userId', username: 'Username', role: 'Role', registrationDate: 'Registration date', delete: 'Delete' }, deleteUserEvent)
    innerContainer.appendChild(table)
    innerContainer.removeChild(indicatorDiv)
  }
}

const showAnnouncementsListEvent = async (event) => {
  event.stopPropagation()
  container.innerHTML = ''
  const indicatorDiv = loadingIndicator()
  innerContainer.appendChild(indicatorDiv)

  container.appendChild(innerContainer)
  const div = headerDiv('Ilmoituslista')
  div.appendChild(closeBtn)
  container.prepend(div)

  body.prepend(container)

  const items = await itemsListRequest()
  if (items) {
    generateTable(
      table,
      items,
      {
        thumbnailURLs: 'Photo',
        id: 'Id',
        mark: 'Mark',
        model: 'Model',
        fuelType: 'Fuel type',
        mileage: 'Mileage',
        price: 'Price',
        onSale: 'Is it for sale?',
        createdDate: 'Announcement creation date',
        user: 'User',
        delete: 'Delete'
      },
      deleteItemEvent
    )
    innerContainer.appendChild(table)
    innerContainer.removeChild(indicatorDiv)
  }
}

closeBtn.addEventListener('click', () => { body.removeChild(container) })
showUsersListBtn.addEventListener('click', (event) => { showUsersListEvent(event) })
showAnnouncementsListBtn.addEventListener('click', (event) => { showAnnouncementsListEvent(event) })
