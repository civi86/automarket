import { generateMessageBox } from '../messages.js'

const main = document.getElementsByTagName('main')[0]

const openSendMessageEvent = (recipientUserId, announcementId) => {
  const div = generateMessageBox('Lähetä viesti myyjälle', recipientUserId, announcementId)
  main.prepend(div)
}

const sendMessageEvent = () => {

}

export { openSendMessageEvent, sendMessageEvent }