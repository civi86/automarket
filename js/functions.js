const tokenDecode = () => {
    const tokenFromLocalStorage = localStorage.getItem('token')
    if (tokenFromLocalStorage !== null) {
        const arrayOfToken = tokenFromLocalStorage.split('.')
        const decodedToken = JSON.parse(atob(arrayOfToken[1]))
        return decodedToken
    }
    return null
}

const loadingIndicator = () => {
    const div = document.createElement('div')
    div.classList.add('loading')
    return div
}

const generateContainer = (containerTitle) => {
    const container = document.createElement('div')
    container.classList.add('container-box')
    const headerDiv = document.createElement('div')
    headerDiv.classList.add('container-header')
    const h3 = document.createElement('h3')
    h3.classList.add('center')
    h3.textContent = containerTitle
    headerDiv.appendChild(h3)
    const closeBtn = document.createElement('button')
    closeBtn.textContent = 'X'
    closeBtn.id = 'close-container-btn'

    headerDiv.appendChild(closeBtn)
    closeBtn.addEventListener('click', () => { container.parentElement.removeChild(container) })
    container.appendChild(headerDiv)
    const bodyDiv = document.createElement('div')
    bodyDiv.classList.add('center')

    container.appendChild(bodyDiv)

    return { container, headerDiv, bodyDiv }
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
            resolve()
        })
        noBtn.addEventListener('click', (event) => {
            reject()
        })
    })

    return { containerDiv, confirmationPromise }
}

export { tokenDecode, loadingIndicator, confirmationBox, generateContainer }