import { notification } from './notification.js';
import { tokenDecode } from './functions.js';
import { openSendMessageEvent } from './events/message.js';

const searchButton = document.getElementById('haku-postItem');
const backEndUrl = 'https://automarketbackend.onrender.com/api';
const itemsList = document.getElementById('items-list');
const decodedToken = tokenDecode();
const searchContainer = document.getElementById('search-container');
const carSearch = document.getElementById('car-search');

const fetchCarData = async () => {
    try {
        const response = await fetch(`${backEndUrl}/items`);
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Autotietojen haku epäonnistui.');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        notification({ error });
        return [];
    }
};

const populateDropdowns = (carData) => {
    const brandDropdown = document.getElementById('haku-merkki');
    const modelDropdown = document.getElementById('haku-malli');

    const brands = new Set();
    const models = new Set();

    carData.forEach(car => {
        if (car.mark) brands.add(car.mark);
        if (car.model) models.add(car.model);
    });

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandDropdown.appendChild(option);
    });

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelDropdown.appendChild(option);
    });
};

const compareCarData = (formData, carDataList) => {
    return carDataList.filter(car => {
        return (
            (!formData.mark || car.mark.toLowerCase() === formData.mark.toLowerCase()) &&
            (!formData.model || car.model.toLowerCase() === formData.model.toLowerCase()) &&
            (!formData.fuelType || car.fuelType.toLowerCase() === formData.fuelType.toLowerCase()) &&
            (!formData.mileage || car.mileage <= parseInt(formData.mileage)) &&
            (!formData.price || car.price <= parseInt(formData.price)) &&
            (!formData.gearBoxType || car.gearBoxType.toLowerCase() === formData.gearBoxType.toLowerCase())
        );
    });
};

const handleSearch = async (event) => {
    event.preventDefault();
    try {
        const form = document.getElementById('publish');
        const formData = new FormData(form);

        const filters = {
            mark: formData.get('merkki') || '',
            model: formData.get('malli') || '',
            fuelType: formData.get('polttoaine') || '',
            mileage: formData.get('max-kilometrit') || '',
            gearBoxType: formData.get('vaihteisto') || '',
            price: formData.get('max-hinta') || '',
        };

        const carDataList = await fetchCarData();

        const filteredItems = compareCarData(filters, carDataList);
        
        if (filteredItems.length > 0) {
            if (itemsList) {
                itemsList.innerHTML = '';
                carSearch.style.display = 'none';
                searchContainer.style.display = 'block';
            }
            notification({
                error: { name: 'Info', message: `${filteredItems.length} auto(a) löytyi hakukriteereilläsi.` }
            });

            filteredItems.forEach(item => {
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
            if (window.location.pathname === '/sivut/haku.html') {   
                if (decodedToken && item.user !== decodedToken.id) {
                    const sendMessageBtn = document.createElement('button')
                    sendMessageBtn.textContent = 'Lähetä viesti myyjälle'
                    sendMessageBtn.addEventListener('click', () => { openSendMessageEvent(item.user, item.id) })
                    listItem.appendChild(sendMessageBtn)
                }
            }
            itemsList.appendChild(listItem);
            });
            console.log(filteredItems);
        } else {
            notification({
                error: { name: 'Info', message: 'Hakukriteereilläsi ei löytynyt autoja.' }
            });
        }
    } catch (error) {
        console.error(error);
        notification({ error });
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const carData = await fetchCarData();
        console.log(carData);
        populateDropdowns(carData);
        searchButton.addEventListener('click', handleSearch);
    } catch (error) {
        //console.error('Dropdown initialization failed:', error);
        //notification({ error });
    }
});

export { handleSearch }