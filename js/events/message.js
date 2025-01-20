import { generateMessageBox } from '../functions.js'

const openSendMessageEvent = (recipientUserId, announcementId, itemDescription) => {
  const main = document.getElementsByTagName('main')[0]
  const { messageContainer, container2 } = generateMessageBox({
    title: 'Lähetä viesti myyjälle',
    recipientUserId,
    announcementId,
    itemDescription,
    main
  })

  main.prepend(messageContainer)
  main.prepend(container2)
}

export { openSendMessageEvent }