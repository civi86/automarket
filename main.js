import * as htmlElements from './js/htmlElements.js'

const registrationReDirect = () => {
    window.location = 'sivut/rekisterointi.html'
}

htmlElements.registrationBtn.addEventListener('click', registrationReDirect)