import { loadingIndicator } from "./functions.js";
import { notification } from "./notification.js";

async function fetchItems() {
    try {
        const itemsList = document.getElementById('items-list');

        // Add loading indicator
        const indicatorDiv = loadingIndicator()
        itemsList.appendChild(indicatorDiv)

        const response = await fetch('https://automarketbackend.onrender.com/api/items/');

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        else {
            // Remove loading indicator if got response
            itemsList.removeChild(indicatorDiv)
        }
        const items = await response.json();

        console.log('Fetched Items:', items);

        items.forEach(item => {
            const listItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = item.thumbnailURLs[0];
            img.onerror = () => {
                img.src = 'img/404.png';
            };
            listItem.id = `item-${item.id}`;

            const textContent = document.createElement('span');
            textContent.textContent = `${item.mark} ${item.model} - ${item.price} €`;

            listItem.classList.add('listed-item');
            img.classList.add('listed-item-img');
            textContent.classList.add('listed-item-desc')

            listItem.appendChild(img);
            listItem.appendChild(textContent);
            itemsList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        notification({ name: 'Error', message: 'Failed to fetch items. Please try again later.', stayOn: true });
    }
};
fetchItems();