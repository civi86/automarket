import { generateMessageBox } from '../messages.js'

const main = document.getElementsByTagName('main')[0]

const openSendMessageEvent = (recipientUserId, announcementId, announcementType) => {
  const div = generateMessageBox('Lähetä viesti myyjälle', recipientUserId, announcementId, announcementType)
  main.prepend(div)
}

export { openSendMessageEvent }