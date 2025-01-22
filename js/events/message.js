import { generateMessageBox } from '../functions.js'

const openSendMessageEvent = (recipientUserId, announcementId, itemDescription) => {
  const main = document.getElementsByTagName('main')[0]
  const div = generateMessageBox({title:'Lähetä viesti myyjälle', recipientUserId, announcementId, main})
  main.appendChild(div)
}

export { openSendMessageEvent }