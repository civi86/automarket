import { confirmationBox, generateContainer, generateMessageBox } from './functions.js'
import { sendMessageRequest, messagesRequest, topicsRequest } from './apiRequests.js'
import { notification } from './notification.js'

const showMessagesBtn = document.getElementById('message-btn')
const main = document.getElementsByTagName('main')[0]

const generateMessagesList = (data) => {
  const div = document.createElement('div')
  div.classList.add('messages-list')
  const table = document.createElement('table')
  data.forEach(row => {
    const tableRow = table.insertRow()
    for (const key in row) {
      tableRow.insertCell().textContent = row[key]
    }
  })
  div.appendChild(table)

  return div
}

const generateTopicsList = (data) => {
  const div = document.createElement('div')
  const headerArray = ['Lähettäjä', 'Vastaanottaja', 'Tyyppi', 'Otsikko', 'Päiväys', 'Viestien määrä', 'Viestit']
  div.classList.add('topics-list')
  div.classList.add('center')
  const table = document.createElement('table')
  const header = table.createTHead();
  const row = header.insertRow()
  for (const item of headerArray) {
    const cell = row.insertCell()
    cell.textContent = item
  }

  data.forEach(topic => {
    const tableRow = table.insertRow()
    const senderCell = tableRow.insertCell()
    const recipientCell = tableRow.insertCell()
    const typeCell = tableRow.insertCell()
    const titleCell = tableRow.insertCell()
    const dateCell = tableRow.insertCell()
    const countCell = tableRow.insertCell()
    const btnCell = tableRow.insertCell()

    senderCell.textContent = topic.senderUser.username
    recipientCell.textContent = topic.recipientUser.username
    const announcementTypes = { sell: 'Myynti', buy: 'Osto' }
    typeCell.textContent = announcementTypes[topic.announcement.announcementType]
    titleCell.textContent = `${topic.announcement.mark} ${topic.announcement.model} ${topic.announcement.mileage} km ${topic.announcement.price} €`
    dateCell.textContent = topic.sendDate
    countCell.textContent = topic.messages.length

    const button = document.createElement('button')
    button.textContent = "Lue viestit"
    button.addEventListener('click', async (event) => {
      let currentIndex = 0
      messagesRequest({ id: topic.id, index: currentIndex })
        .then(result => {
          if (result !== undefined && result.status !== 204) {
            const messagesContainer = generateContainer('Viestit')
            const receivedMsgDiv = document.createElement('div')

            messagesContainer.bodyDiv.appendChild(receivedMsgDiv)

            let messageList = generateMessagesList(result)

            receivedMsgDiv.appendChild(messageList)

            const button = document.createElement('button')
            button.addEventListener('click', (event) => {
              const messageBox = generateMessageBox({ title: 'Vastaa viestiin', topicId: topic.id, main })
              main.appendChild(messageBox)
            })
            button.textContent = 'Vastaa'
            receivedMsgDiv.appendChild(button)
            if (topic.messages.length > 10) {
              const moreBtn = document.createElement('button')
              moreBtn.textContent = 'Seuraavat viestit'
              moreBtn.addEventListener('click', (event) => {
                currentIndex += 1
                messagesRequest({ id: topic.id, index: currentIndex })
                  .then(result => {
                    if (result !== undefined && result.status !== 204) {
                      console.log(currentIndex)
                      receivedMsgDiv.removeChild(messageList)
                      messageList = generateMessagesList(result)
                      receivedMsgDiv.prepend(messageList)
                    }
                  })
                
              })
              receivedMsgDiv.appendChild(moreBtn)
            }

            const main = document.getElementsByTagName('main')[0]
            main.prepend(messagesContainer.container)
          }
          else {
            notification({ error: { name: 'Info', message: 'Ei viestejä' }, doWeRedirectLater: false })
          }
        })
        .catch(error => console.log("error :", error))
    })

    btnCell.appendChild(button)

  })
  div.appendChild(table)
  return div
}

topicsRequest({ index: 0 })
  .then(result => {
    if (result !== undefined && result.status !== 204) {
      const topicList = generateTopicsList(result)
      main.appendChild(topicList)
    }
  })
