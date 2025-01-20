const translations = {
    en: {
        "title": "Auto-Marketti",
        "switch-language": "Switch to: English",
        "logout": "Log out",
        "findcar": "Find a new car",
        "listcar": "Sell your car",
        "searchcar": "Car search",
        "messages": "Messages",
        "contact": "Contact",
        "search-title": "Search for a car based on your criteria",
        "search-desc": "Enter the vehicle information in the form below.",
        "car-brand-label": "Vehicle brand:",
        "car-brand-placeholder": "Select brand",
        "car-model-label": "Vehicle model:",
        "car-model-placeholder": "Select model",
        "fuel-label": "Fuel type:",
        "fuel-placeholder": "Select fuel type",
        "fuel-petrol": "Petrol",
        "fuel-diesel": "Diesel",
        "fuel-hybrid": "Hybrid",
        "fuel-electric": "Electric",
        "gearbox-label": "Gearbox type:",
        "gearbox-placeholder": "Select gearbox",
        "gearbox-manual": "Manual",
        "gearbox-automatic": "Automatic",
        "max-km-label": "Maximum kilometers:",
        "max-km-placeholder": "Enter max kilometers",
        "max-price-label": "Maximum price:",
        "max-price-placeholder": "Enter max price",
        "submit-button": "Submit",
        "header": "List your car for sale",
        "p": "Fill your car information below",
        "ourcontact": "Our contact information",
        "ourcontact2": "For problems with site contact: tuki@auto-marketti.fi",
        "ourcontact3": "You can also call us monday-friday 8-16 number: 045 678 91011",
        "messagesget": "Get messages",
        "hinta": "Price",
        "desc": "Description",
        "img": "Add a picture",
        "kilometres": "Kilometres",
        "title2": "Results that fit the search criteria",
        "managecar": "Manage your notifications"
    },
    fi: {
        "title": "Auto-Marketti",
        "switch-language": "Vaihda kieleksi: Suomi",
        "logout": "Kirjaudu ulos",
        "findcar": "Löydä itsellesi uusi auto",
        "listcar": "Listaa autosi myytäväksi",
        "searchcar": "Autohaku",
        "messages": "Viestit",
        "contact": "Yhteystiedot",
        "search-title": "Etsi autoa haluamasi kriteereillä",
        "search-desc": "Syötä ajoneuvon tiedot alla olevaan lomakkeeseen.",
        "car-brand-label": "Ajoneuvon merkki:",
        "car-brand-placeholder": "Valitse merkki",
        "car-model-label": "Ajoneuvon malli:",
        "car-model-placeholder": "Valitse malli",
        "fuel-label": "Käyttövoima:",
        "fuel-placeholder": "Valitse käyttövoima",
        "fuel-petrol": "Bensiini",
        "fuel-diesel": "Diesel",
        "fuel-hybrid": "Hybridi",
        "fuel-electric": "Sähkö",
        "gearbox-label": "Vaihteistotyyppi:",
        "gearbox-placeholder": "Valitse vaihteisto",
        "gearbox-manual": "Manuaali",
        "gearbox-automatic": "Automaatti",
        "max-km-label": "Maksimikilometrit:",
        "max-km-placeholder": "Syötä maksimikilometrit",
        "max-price-label": "Maksimihinta:",
        "max-price-placeholder": "Syötä maksimihinta",
        "submit-button": "Lähetä",
        "header": "Listaa ajoneuvosi myytäväksi",
        "p": "Syötä ajoneuvosi tiedot alla olevaan lomakkeeseen",
        "ourcontact": "Yhteystietomme",
        "ourcontact2": "Ongelmatilanteissa ota yhteyttä: tuki@auto-marketti.fi",
        "ourcontact3": "Palvelemme myös arkisin puhelimitse klo 8-16 numerossa 045 678 91011",
        "messagesget": "Hae viestit",
        "hinta": "Hinta",
        "desc": "Kuvaus ajoneuvosta",
        "img": "Lisää kuva ajoneuvosta",
        "kilometres": "Kilometrit",
        "title2": "Kriteereihin sopivat hakutulokset",
        "managecar": "Hallitse omia ilmoituksia"
    }
};

let currentLanguage = "fi";

const updateLanguage = (language) => {
    const elements = document.querySelectorAll("[data-lang-key]");
    elements.forEach((element) => {
        const key = element.getAttribute("data-lang-key");
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    const toggleButton = document.getElementById("language-toggle");
    toggleButton.textContent = language === "fi"
        ? "Switch to: English"
        : "Vaihda kieleksi: Suomi";
};

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("language-toggle");

    const savedLanguage = localStorage.getItem("language") || "fi";
    currentLanguage = savedLanguage;
    updateLanguage(currentLanguage);

    toggleButton.addEventListener("click", () => {
        currentLanguage = currentLanguage === "fi" ? "en" : "fi";
        localStorage.setItem("language", currentLanguage);
        updateLanguage(currentLanguage);
    });

    updateLanguage(currentLanguage);
});
