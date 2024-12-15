import { notification } from './notification.js'

const postItemBtn = document.getElementById('postItem')

const backEndUrl = 'https://automarketbackend.onrender.com/api'

const newItemRequest = async (data) => {
    try {
        const token = localStorage.getItem('token')
        if (token) {
            const request = new Request(backEndUrl + '/item', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },

                body: data,
            })
            const response = await fetch(request)
            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.error)
            }
            else {
                const result = await response.json()

                return result
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

const newItemEvent = (event) => {
    try {
        event.preventDefault()

        const keys = { 'merkki': 'mark', 'malli': 'model', 'polttoaine': 'fuelType', 'kilometrit': 'mileage', 'vaihteisto': 'gearBoxType', 'hinta': 'price', 'kuvaus': 'description', 'kuva': 'photos' }
        const form = event.target.parentElement
        const formDataRaw = new FormData(form)
        const data = new FormData()
        for (const [key, rawData] of formDataRaw) {
            if (rawData === '' && key != 'kuvaus') {
                throw new Error(`${key} kenttä on tyhjä`)
            }
            data.append(keys[key], rawData)
        }
        newItemRequest(data)
            .then((response) => {
                console.log(response)
                notification({ error: { name: 'Info', message: 'Ilmoitus rekisteröity onnistuneesti' }, doWeRedirectLater: true })
                setTimeout(() => { window.location = 'julkaisut.html' }, 5000)
            })
    }
    catch (error) {
        notification({ error })
    }

}

postItemBtn.addEventListener('click', newItemEvent)