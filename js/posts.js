async function fetchItems() {
    try {
        const response = await fetch('https://automarketbackend.onrender.com/api/items/');

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const items = await response.json();

        console.log('Fetched Items:', items);

        const itemsList = document.getElementById('items-list');
        
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - ${item.price}`;
            itemsList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        alert('Failed to fetch items. Please try again later.');
    }
};
