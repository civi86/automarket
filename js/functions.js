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

export { tokenDecode, loadingIndicator, confirmationBox }