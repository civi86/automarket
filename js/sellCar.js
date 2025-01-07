import { notification } from './notification.js'
import { newItemRequest } from './apiRequests.js'

const postItemBtn = document.getElementById('postItem')

const backEndUrl = 'https://automarketbackend.onrender.com/api'

const newItemEvent = (event) => {
    try {
        event.preventDefault()

        const keyList = [{
            'merkki': 'mark',
            'malli': 'model',
            'polttoaine': 'fuelType',
            'kilometrit': 'mileage',
            'vaihteisto': 'gearBoxType',
            'hinta': 'price',
            'kuvaus': 'description',
            'kuva': 'photos'
        },
        {
            'car-make': 'mark',
            'car-model': 'model',
            'car-gear': 'gearBoxType',
            'car-year': 'year',
            'car-price': 'price',
            'car-description': 'description',
            'car-image': 'photos'
        }]

        

        const form = event.target.parentElement
        const formDataRaw = new FormData(form)
        const data = new FormData()
        const keys = form.id === 'car-purchase-form'
            ? keyList[1]
            : keyList[0]

        for (const [key, rawData] of formDataRaw) {
            if (rawData === '' && key !== 'kuvaus') {
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