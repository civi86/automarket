import { deleteItemRequest, itemActiveToggleRequest, itemEditRequest, itemRequest, userRequest } from '../js/apiRequests.js'
import { generateContainer, isDomObject, filterKeys, generateSelectMenu, confirmationBox } from './functions.js'
import { carMarksData } from '../data/carMarks.js'
import { notification } from './notification.js'

const announcementTypes = { sell: 'Myynti', buy: 'Osto' }

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

const generateTable = (data, headers) => {
  const table = document.createElement('table')

  const tableHeader = generateTableHeader(headers)
  const tableBody = generateTableBody(data)

  table.appendChild(tableHeader)
  table.appendChild(tableBody)

  return table
}

const generateEditForm = (data) => {
  const form = document.createElement('form')
  for (const [key, value] of data) {
    const label = document.createElement('label')
    label.textContent = key
    label.setAttribute('for', key)
    form.appendChild(label)
    if (key === 'mark' || key === 'fuelType' || key === 'gearBoxType') {
      let menu = null
      if (key === 'mark') {
        menu = generateSelectMenu(carMarksData, value)
      }
      if (key === 'fuelType') {
        menu = generateSelectMenu(['bensiini', 'diesel', 'hybridi', 'sähkö'], value)
      }
      else if (key === 'gearBoxType') {
        menu = generateSelectMenu(['manuaali', 'automaatti'], value)
      }
      menu.setAttribute('name', key)
      menu.setAttribute('selected', value)
      form.appendChild(menu)
    }
    else if (key === 'description') {
      const textArea = document.createElement('textarea')
      textArea.setAttribute('name', key)
      textArea.value = value
      form.appendChild(textArea)
    }
    else {
      const input = document.createElement('input')
      input.setAttribute('name', key)
      input.value = value
      input.setAttribute('type', typeof (value))
      form.appendChild(input)
    }
  }
  form.classList.add('edit-form')

  return form
}

const updateAnnouncements = () => {
  userRequest()
    .then(response => {
      parseAnnouncementData(response.announcements)
        .then(data => {
          const containerDiv = document.getElementById('announcement-container')
          containerDiv.innerHTML = ''
          if (data.length === 0) {
            containerDiv.textContent = 'Ei luotuja ilmoituksia'
          }
          else {
            const table = generateTable(data, ['Tyyppi', 'Otsikko', 'Päiväys', 'Myynnissä/aktiivinen', 'Muokkaa', 'Poista'])
            containerDiv.appendChild(table)
          }
        })
    })
}

const parseAnnouncementData = async (data) => {
  const main = document.getElementsByTagName('main')[0]
  const array = []
  data.forEach(item => {
    const type = announcementTypes[item.announcementType]
    const mileage = item.mileage === undefined
      ? ''
      : `${item.mileage} km`

    const title = `${item.mark} ${item.model} ${mileage} ${item.price} €`
    const date = new Date(item.createdDate)
    const dateString = `${date.toLocaleDateString("fi-FI")} ${date.toLocaleTimeString("fi-FI")}`
    const saleToggleBtn = document.createElement('button')
    saleToggleBtn.textContent = item.onActive === true ? 'Kyllä' : 'Ei'
    saleToggleBtn.addEventListener('click', () => {
      const confirmBox = confirmationBox('Vaihdetaanko tilaa?')
      main.appendChild(confirmBox.containerDiv)
      confirmBox.confirmationPromise
        .then(() => {
          itemActiveToggleRequest(item.id)
            .then(() => {
              updateAnnouncements()
              main.removeChild(confirmBox.containerDiv)
            })
        })
        .catch(() => main.removeChild(confirmBox.containerDiv))
    })

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Muokkaa'
    editBtn.addEventListener('click', () => {
      itemRequest(item.id)
        .then(result => {
          const filterList = ['mark', 'model', 'fuelType', 'mileage', 'year', 'price', 'gearBoxType', 'description']
          const editContainer = generateContainer('Muokkaa ilmoitusta')
          const filteredData = filterKeys(result, filterList)
          const form = generateEditForm(filteredData)

          const contentDiv = document.createElement('div')
          contentDiv.appendChild(form)
          const submitBtn = document.createElement('button')
          submitBtn.textContent = 'Lähetä'
          submitBtn.style.marginLeft = '25%'
          submitBtn.style.padding = '10px'
          submitBtn.addEventListener('click', () => {
            const confirmBox = confirmationBox('Lähetetäänkö?')
            contentDiv.appendChild(confirmBox.containerDiv)
            const confirmPromise = confirmBox.confirmationPromise
            confirmPromise
              .then(() => {
                const data = new FormData(form)
                data.append('id', result.id)
                data.append('announcementType', result.announcementType)

                itemEditRequest(Object.fromEntries(data))
                  .then(result => {
                    if (result && result.status === 204) {
                      notification({ error: { name: "Info", message: 'Ilmoituksen muokkaus onnistui' } })
                      updateAnnouncements()
                    }
                  })
                main.removeChild(editContainer.container)
              })
              .catch(() => { main.removeChild(editContainer.container) })
          })
          contentDiv.appendChild(submitBtn)
          editContainer.bodyDiv.appendChild(contentDiv)

          main.appendChild(editContainer.container)
        })
    })
    
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Poista'
    deleteBtn.addEventListener('click', () => {
      const confirmBox = confirmationBox('Poistetaanko?')
      main.appendChild(confirmBox.containerDiv)
      confirmBox.confirmationPromise
        .then(() => {
          deleteItemRequest(item.id)
            .then(() => {
              updateAnnouncements()
              main.removeChild(confirmBox.containerDiv)
            })
        })
        .catch(() => main.removeChild(confirmBox.containerDiv))
    })

    array.push([type, title, dateString, saleToggleBtn, editBtn, deleteBtn])
  })
  return array
}

const user = await userRequest()
const main = document.getElementsByTagName('main')[0]

const parsedAnnouncementData = await parseAnnouncementData(user.announcements)

const containerDiv = document.createElement('div')
containerDiv.id = 'announcement-container'
containerDiv.classList.add('center')

if (parsedAnnouncementData.length === 0) {
  containerDiv.textContent = 'Ei luotuja ilmoituksia'
}
else {
  const table = generateTable(parsedAnnouncementData, ['Tyyppi', 'Otsikko', 'Päiväys', 'Myynnissä/aktiivinen', 'Muokkaa', 'Poista'])
  containerDiv.appendChild(table)
}

main.appendChild(containerDiv)
