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

export { tokenDecode, loadingIndicator }