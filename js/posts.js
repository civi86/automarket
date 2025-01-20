import { formatDate, generateContainer, generateTable, getFilteredArray, getFilteredMap, loadingIndicator, tokenDecode } from "./functions.js";
import { notification } from "./notification.js";
import { openSendMessageEvent } from './events/message.js';
import { itemRequest } from "./apiRequests.js";

const backEndUrl = 'https://automarketbackend.onrender.com/api/items'
//const backEndUrl = 'http://localhost:3001/api/items'

const main = document.getElementsByTagName('main')[0]

async function fetchItems() {
    try {
        const itemsList = document.getElementById('items-list');

        // Add loading indicator
        const indicatorDiv = loadingIndicator()
        indicatorDiv.style.top = '60%'
        itemsList.appendChild(indicatorDiv)

        const response = await fetch(backEndUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        else {
            // Remove loading indicator if got response
            itemsList.removeChild(indicatorDiv)
        }
        if (response.status === 204) {
            itemsList.textContent = 'Ei yhtään ilmoitusta'
            itemsList.style.fontWeight = 'bold'
            itemsList.style.textAlign = 'center'
            itemsList.style.display = 'block'
            return []
        }
        const items = await response.json();

        console.log('Fetched Items:', items);

        // if (items.length === 0) {
        //     itemsList.textContent = 'Ei yhtään ilmoitusta'
        //     itemsList.style.fontWeight = 'bold'
        //     itemsList.style.textAlign = 'center'
        //     itemsList.style.display = 'block'
        //     return
        // }
        const decodedToken = tokenDecode()

        items.forEach(item => {
            const listItem = document.createElement('div');
            const img = document.createElement('img');
            const moreInfoButton = document.createElement('button')
            moreInfoButton.textContent = 'Lisätietoja'
            img.src = item.thumbnailURLs[0];
            img.onerror = () => {
                img.src = '/../img/404.png';
            };
            listItem.id = `item-${item.id}`;

            const textContent = document.createElement('span');
            textContent.textContent = `${item.mark} ${item.model} - ${item.price} €`;

            listItem.classList.add('listed-item');
            img.classList.add('listed-item-img');
            textContent.classList.add('listed-item-desc')

            listItem.appendChild(img);
            listItem.appendChild(textContent);
            listItem.appendChild(moreInfoButton)
            moreInfoButton.addEventListener('click', () => {
                itemRequest(item.id)
                    .then((response) => {
                        console.log(response)
                        response['createdDate'] = formatDate(response.createdDate)
                        const preventClicksDiv = document.createElement('div')
                        preventClicksDiv.classList.add('prevent-bg-clicks')
                        const infoBox = generateContainer('Lisätietoja')
                        const infoDiv = document.createElement('div')
                        infoDiv.classList.add('more-info')
                        const markModelRow = document.createElement('h3')
                        const status = response.announcementType = 'sell' ? 'Myydään' : 'Ostetaan' 
                        markModelRow.textContent = `${status}: ${response.mark} ${response.model} ${response.price} €`
                        const photo = document.createElement('img')
                        photo.src = response.photoURLs[0]
                        photo.onerror = () => {
                            photo.src = '/../img/404.png'
                        }
                        const descriptionRow = document.createElement('p')
                        descriptionRow.textContent = response.description
                        descriptionRow.style.textAlign = 'initial'
                        infoDiv.appendChild(markModelRow)
                        infoDiv.appendChild(photo)
                        infoDiv.appendChild(descriptionRow)
                        infoBox.bodyDiv.appendChild(infoDiv)
                        const filterList = {
                            mark: 'Merkki',
                            model: 'Malli',
                            mileage: 'Kilometrit',
                            year: 'Vuosimalli',
                            fuelType: 'Käyttövoima',
                            gearBoxType: 'Vaihteisto',
                            createdDate: 'Ilmoitus jätetty',
                        }

                        const data = getFilteredArray(response, filterList)
                        const table = generateTable({ data, headers: ['Tiedot ajoneuvosta:', ''] })
                        infoDiv.appendChild(table)
                        main.prepend(preventClicksDiv)
                        main.appendChild(infoBox.container)

                        infoBox.closePromise
                            .then(() => {
                                main.removeChild(preventClicksDiv)
                                main.removeChild(infoBox.container)
                            })
                    })
            })
            if (window.location.pathname === '/sivut/julkaisut.html') {
                if (decodedToken && item.user !== decodedToken.id) {
                    const sendMessageBtn = document.createElement('button')
                    if (item.announcementType === 'sell')
                        sendMessageBtn.textContent = 'Lähetä viesti myyjälle'
                    if (item.announcementType === 'buy') {
                        sendMessageBtn.textContent = 'Lähetä viesti ilmoituksen jättäjälle'
                    }
                    sendMessageBtn.addEventListener('click', () => { openSendMessageEvent(item.user, item.id, item.description)})
                    listItem.appendChild(sendMessageBtn)
                }
            }
            itemsList.appendChild(listItem);
        });
        return items;

    } catch (error) {
        console.error('Error fetching items:', error);
        notification({ error: { name: 'Error', message: 'Failed to fetch items. Please try again later.' }, stayOn: true });
    }
};
fetchItems();