import { notification } from './notification.js'
import { newItemRequest } from './apiRequests.js'

const postItemBtn = document.getElementById('postItem')

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

        const announcementType = form.id === 'car-purchase-form'
            ? 'buy'
            : 'sell'

        for (const [key, rawData] of formDataRaw) {
            if (rawData === '') {
                if (key === 'kuvaus' || key === 'car-description') {
                    continue
                }
                else {
                    throw new Error(`${key} kenttä on tyhjä`)
                }
            }
            data.append(keys[key], rawData)
        }
        data.append('announcementType', announcementType)
        newItemRequest(data)
            .then((response) => {
                if (response.ok) {
                    notification({ error: { name: 'Info', message: 'Ilmoitus rekisteröity onnistuneesti' }, doWeRedirectLater: true })
                }
                else {
                    throw new Error(response)
                }
                setTimeout(() => { window.location = 'julkaisut.html' }, 5000)
            })
    }
    catch (error) {
        notification({ error })
    }

}

postItemBtn.addEventListener('click', newItemEvent)