import { loadingIndicator, tokenDecode } from "./functions.js";
import { notification } from "./notification.js";
import { openSendMessageEvent } from './events/message.js';

async function fetchItems() {
    try {
        const itemsList = document.getElementById('items-list');

        // Add loading indicator
        const indicatorDiv = loadingIndicator()
        indicatorDiv.style.top = '60%'
        itemsList.appendChild(indicatorDiv)

        const response = await fetch('http://localhost:3001/api/items/');

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        else {
            // Remove loading indicator if got response
            itemsList.removeChild(indicatorDiv)
        }
        const items = await response.json();

        console.log('Fetched Items:', items);

        if (items.length === 0) {
            itemsList.textContent = 'Ei yhtään ilmoitusta'
            itemsList.style.fontWeight = 'bold'
            itemsList.style.textAlign = 'center'
            itemsList.style.display = 'block'
        }
        const decodedToken = tokenDecode()

        items.forEach(item => {
            const listItem = document.createElement('div');
            const img = document.createElement('img');
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
            if (window.location.pathname === '/sivut/julkaisut.html') {   
                if (decodedToken && item.user !== decodedToken.id) {
                    const sendMessageBtn = document.createElement('button')
                    sendMessageBtn.textContent = 'Lähetä viesti myyjälle'
                    sendMessageBtn.addEventListener('click', () => { openSendMessageEvent(item.user, item.id, 'sell') })
                    listItem.appendChild(sendMessageBtn)
                }
            }
            itemsList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        notification({ error: { name: 'Error', message: 'Failed to fetch items. Please try again later.' }, stayOn: true });
    }
};
fetchItems();