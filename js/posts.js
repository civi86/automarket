import { formatDate, generateContainer, generateTable, getFilteredArray, getFilteredMap, loadingIndicator, tokenDecode } from "./functions.js";
import { notification } from "./notification.js";
import { openSendMessageEvent } from './events/message.js';
import { itemRequest } from "./apiRequests.js";

const backEndUrl = 'https://automarketbackend.onrender.com/api/items'
//const backEndUrl = 'http://localhost:3001/api/items'

const main = document.getElementsByTagName('main')[0]

let sellItemsCurrentIndex = 0
let buyItemsCurrentIndex = 0

async function fetchItems(announcementsType, currentIndex) {
    try {
        let itemsList = null

        if (announcementsType === 'sell')
            itemsList = document.getElementById('items-list');
        else if (announcementsType === 'buy') {
            itemsList = document.getElementById('buy-items-list');
        }
        // Add loading indicator
        const indicatorDiv = loadingIndicator()
        indicatorDiv.style.position = 'unset'
        itemsList.appendChild(indicatorDiv)
        
        const response = await fetch(backEndUrl + `/${announcementsType}/${currentIndex}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        else {
            // Remove loading indicator if got response
            itemsList.removeChild(indicatorDiv)
        }
        if (response.status === 204 && currentIndex === 0) {
            itemsList.textContent = 'Ei yhtään ilmoitusta'
            itemsList.style.fontWeight = 'bold'
            itemsList.style.textAlign = 'center'
            itemsList.style.display = 'block'
            return []
        }
        else if (response.status === 204 && currentIndex > 0) {
            let button = null
            if (announcementsType === 'sell') {
                button = document.getElementById('more-sell-items')
            }
            else if (announcementsType === 'buy') {
                button = document.getElementById('more-buy-items')
            }
            main.removeChild(button.parentElement)
            notification({error:{name:'Info', message:'Ei enempää ilmoituksia'}})
            return []
        }
        const items = await response.json();

        console.log('Fetched Items:', items);

        const decodedToken = tokenDecode()

        items.forEach(item => {
            const listItem = document.createElement('div');
            const img = document.createElement('img');
            const moreInfoButton = document.createElement('button')
            moreInfoButton.textContent = 'Lisätietoja'
            if (announcementsType === 'sell') {
                img.src = item.thumbnailURLs[0];
                img.onerror = () => {
                    img.src = '/../img/404.png';
                };
                img.classList.add('listed-item-img');
                listItem.appendChild(img);
            }
            listItem.id = `item-${item.id}`;

            const textContent = document.createElement('span');
            textContent.textContent = `${item.mark} ${item.model} - ${item.price} €`;

            listItem.classList.add('listed-item');
            
            textContent.classList.add('listed-item-desc')

            
            listItem.appendChild(textContent);
            listItem.appendChild(moreInfoButton)
            moreInfoButton.addEventListener('click', () => {
                itemRequest(item.id)
                    .then((response) => {
                        //console.log(response)
                        response['createdDate'] = formatDate(response.createdDate)
                        const preventClicksDiv = document.createElement('div')
                        preventClicksDiv.classList.add('prevent-bg-clicks')
                        const infoBox = generateContainer('Lisätietoja')
                        const infoDiv = document.createElement('div')
                        infoDiv.classList.add('more-info')
                        const markModelRow = document.createElement('h3')
                        const status = response.announcementType === 'sell' ? 'Myydään' : 'Ostetaan' 
                        markModelRow.textContent = `${status}: ${response.mark} ${response.model} ${response.price} €`
                        const photo = document.createElement('img')
                        if (announcementsType === 'sell') {
                            photo.src = response.photoURLs[0]
                            photo.onerror = () => {
                                photo.src = '/../img/404.png'
                                photo.style.backgroundColor = 'white'
                            }
                        }
                        const descriptionRow = document.createElement('p')
                        descriptionRow.textContent = response.description
                        descriptionRow.style.textAlign = 'initial'
                        infoDiv.appendChild(markModelRow)
                        if (announcementsType === 'sell') {
                            infoDiv.appendChild(photo)
                        }
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
        if (items) {
            if (currentIndex === 0) {
                const div = document.createElement('div')
                div.classList.add('center')
                const moreItemsBtn = document.createElement('button')
                moreItemsBtn.classList.add('more-items')
                moreItemsBtn.textContent = 'Lataa lisää'
                
                moreItemsBtn.addEventListener('click', () => {
                    if (announcementsType === 'sell') {
                        moreItemsBtn.id = 'more-sell-items'
                        sellItemsCurrentIndex += 1
                        fetchItems(announcementsType, sellItemsCurrentIndex)
                    }
                    else if (announcementsType === 'buy') {
                        moreItemsBtn.id = 'more-buy-items'
                        buyItemsCurrentIndex += 1
                        fetchItems(announcementsType, buyItemsCurrentIndex)
                    }
                })
                div.appendChild(moreItemsBtn)
                itemsList.after(div)
            }
        }
        return items;

    } catch (error) {
        console.error('Error fetching items:', error);
        notification({ error: { name: 'Error', message: 'Failed to fetch items. Please try again later.' }, stayOn: true });
    }
};
fetchItems('sell', sellItemsCurrentIndex);
fetchItems('buy', buyItemsCurrentIndex)