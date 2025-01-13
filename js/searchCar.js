import { notification } from './notification.js';

const searchButton = document.getElementById('haku-postItem');
const backEndUrl = 'https://automarketbackend.onrender.com/api';

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
        console.log(formData);

        const searchCriteria = {
            mark: formData.get('merkki'),
            model: formData.get('malli'),
            fuelType: formData.get('polttoaine'),
            mileage: formData.get('max-kilometrit'),
            gearBoxType: formData.get('vaihteisto'),
            price: formData.get('max-hinta'),
        };

        console.log('Search Criteria:', searchCriteria);

        const carDataList = await fetchCarData();

        const matchedCars = compareCarData(searchCriteria, carDataList);

        if (matchedCars.length > 0) {
            window.location = "/sivut/julkaisut.html"
            
            console.log('Matching Cars:', matchedCars);
            notification({
                error: { name: 'Info', message: `${matchedCars.length} auto(a) löytyi hakukriteereilläsi.` }
            });
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
    } catch (error) {
        console.error('Dropdown initialization failed:', error);
        notification({ error });
    }
});

searchButton.addEventListener('click', handleSearch);
