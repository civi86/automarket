import { generateMessageBox } from '../functions.js'

const openSendMessageEvent = (recipientUserId, announcementId, itemDescription) => {
  const main = document.getElementsByTagName('main')[0]
  const div = generateMessageBox({title:'Lähetä viesti myyjälle', recipientUserId, announcementId, main})
  const preventBgClicks = document.createElement('div')
  preventBgClicks.classList.add('prevent-bg-clicks')
  main.appendChild(preventBgClicks)
  main.appendChild(div)
}

export { openSendMessageEvent }