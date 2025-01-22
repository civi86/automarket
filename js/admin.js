import { usersListRequest, deleteUserRequest, itemsListRequest, deleteItemRequest } from './apiRequests.js'
import { tokenDecode, loadingIndicator, confirmationBox, formatDate } from './functions.js'
import { notification } from './notification.js'

let contentIndex = 0

const table = document.createElement('table')

const container = document.createElement('div')
container.id = 'admin-container'

const innerContainer = document.createElement('div')
innerContainer.id = 'inner-admin-container'

const closeBtn = document.createElement('button')
closeBtn.textContent = 'X'
closeBtn.id = 'close-container-btn'

const buttonDiv = document.createElement('div')
const moreBtn = document.createElement('button')
moreBtn.textContent = "Load more"

buttonDiv.appendChild(moreBtn)


const showUsersListBtn = document.getElementById('show-users-list')
const showAnnouncementsListBtn = document.getElementById('show-announcements-list')
const body = document.getElementsByTagName('body')[0]

// First check if there is token and user role is admin in token
if (!localStorage.getItem('token') || tokenDecode().role !== 'admin') {
  body.innerHTML = ''
  notification({ error: { name: 'Error', message: 'Ei oikeuksia!' }, doWeRedirectLater: true })
  setTimeout(() => { window.location = '../index.html' }, 5000)
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
            notification({ error: { name: 'Info', message: 'Käyttäjä poistettu onnistuneesti' }, doWeRedirectLater: false })
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
            notification({ error: { name: 'Info', message: 'Ilmoitus poistettu onnistuneesti' }, doWeRedirectLater: false })
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
  let tableBody = null
  if (contentIndex === 0) {
    tableBody = table.createTBody()
  }
  else {
    tableBody = table.getElementsByTagName('tbody')[0]
  }

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
      if (key === 'createdDate' || key === 'registrationDate') {
        row[key] = formatDate(row[key])
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

const generateTable = (table, rawData, filterList, eventCallBack) => {
  const filteredData = filterData(rawData, filterList)
  if (contentIndex === 0) {
    table.innerHTML = ''
    generateTableHeader(table, filteredData, filterList)
  }
  generateTableBody(table, filteredData, filterList, eventCallBack)
}

const getUsersList = async () => {
  moreBtn.id = 'more-users'
  const indicatorDiv = loadingIndicator()
  innerContainer.appendChild(indicatorDiv)
  const users = await usersListRequest(contentIndex)
  if (users && users.status !== 204) {
    generateTable(table, users, { id: 'userId', username: 'Username', role: 'Role', registrationDate: 'Registration date', delete: 'Delete' }, deleteUserEvent)
    innerContainer.prepend(table)
  }
  if (contentIndex === 0 && users && users.status === 204) {
    innerContainer.innerHTML = ''
    const p = document.createElement('p')
    p.textContent = 'No announcements'
    innerContainer.appendChild(p)
  }
  else {
    innerContainer.removeChild(indicatorDiv)
  }
  if (contentIndex === 0 && users && users.length === 10) {
    innerContainer.appendChild(buttonDiv)
  }
  else if (contentIndex > 0 && users && users.length < 10) {
    innerContainer.removeChild(buttonDiv)
  }
}

const getAnnouncementsList = async () => {
  moreBtn.id = 'more-announcements'
  const indicatorDiv = loadingIndicator()
  innerContainer.appendChild(indicatorDiv)
  const response = await itemsListRequest(contentIndex)
  console.log(response)
  if (response && response.status !== 204) {
    const items = response.map(item => ({ ...item, user: item.user.username, userId: item.user.id }))
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
        year: 'Year',
        price: 'Price',
        onActive: 'Active/on sale',
        createdDate: 'Date',
        announcementType: "Type",
        user: 'Username',
        userId: 'UserId',
        delete: 'Delete',
      },
      deleteItemEvent
    )
    innerContainer.prepend(table)
    //innerContainer.removeChild(indicatorDiv)
  }
  if (contentIndex === 0 && response && response.status === 204) {
    innerContainer.innerHTML = ''
    const p = document.createElement('p')
    p.textContent = 'No announcements'
    innerContainer.appendChild(p)
  }
  else {
    innerContainer.removeChild(indicatorDiv)
  }
  if (contentIndex === 0 && response && response.length === 10) {
    innerContainer.appendChild(buttonDiv)
  }
  if (contentIndex > 0 && response && response.length < 10) {
    innerContainer.removeChild(buttonDiv)
  }
}

const showUsersListEvent = async (event) => {
  contentIndex = 0
  container.innerHTML = ''

  container.appendChild(innerContainer)
  const div = headerDiv('Käyttäjälista')
  div.appendChild(closeBtn)
  container.prepend(div)

  body.prepend(container)

  getUsersList()
}

const showAnnouncementsListEvent = async (event) => {
  contentIndex = 0
  container.innerHTML = ''

  container.appendChild(innerContainer)
  const div = headerDiv('Ilmoituslista')
  div.appendChild(closeBtn)
  container.prepend(div)

  body.prepend(container)

  getAnnouncementsList()

}

moreBtn.addEventListener('click', (event) => {
  contentIndex += 1
  if (event.target.id === 'more-users') {
    getUsersList()
  }
  else if (event.target.id === 'more-announcements') {
    getAnnouncementsList()
  }

})

closeBtn.addEventListener('click', () => {
  contentIndex = 0
  innerContainer.innerHTML = ''
  body.removeChild(container)
})

showUsersListBtn.addEventListener('click', (event) => { showUsersListEvent(event) })
showAnnouncementsListBtn.addEventListener('click', (event) => { showAnnouncementsListEvent(event) })
