// main.js

// Väntar tills hela DOM har laddats innan någon JavaScript körs
document.addEventListener("DOMContentLoaded", function () {
    // Hämta alla DOM-element vi ska arbeta med
    const formFields = {
        fullname: document.getElementById("fullname"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        font: document.getElementById("font")
    };

    const previewFields = {
        fullname: document.getElementById("previewfullname"),
        email: document.getElementById("previewemail"),
        phone: document.getElementById("previewphone")
    };

    const errorListElement = document.createElement("ul"); // Felmeddelanden ska visas i en ul
    document.body.appendChild(errorListElement); // Läggs till sist i dokumentet (kan ändras om plats behövs)

    const generateBtn = document.getElementById("generate");
    const clearBtn = document.getElementById("clear");
    const historyElement = document.getElementById("history");

    // Hämta historik från localStorage vid sidladdning
    renderHistory();

    // ========================
    // Event Listeners
    // ========================

    generateBtn.addEventListener("click", handleGenerate);
    clearBtn.addEventListener("click", clearForm);

    // ========================
    // Funktioner
    // ========================

    // Huvudfunktion som körs vid klick på "Generera visitkort"
    function handleGenerate() {
        const errors = []; // Array för felmeddelanden

        // Läs in värden från formuläret
        const fullname = formFields.fullname.value.trim();
        const email = formFields.email.value.trim();
        const phone = formFields.phone.value.trim();
        const font = formFields.font.value;

        // Validering: kontrollera att inga fält är tomma
        if (!fullname) errors.push("Namn får inte vara tomt.");
        if (!email) errors.push("E-postadress får inte vara tom.");
        if (!phone) errors.push("Telefonnummer får inte vara tomt.");

        // Skriv ut eventuella felmeddelanden
        displayErrors(errors);

        // Avbryt om fel finns
        if (errors.length > 0) return;

        // Inga fel – skriv ut till DOM
        previewFields.fullname.textContent = fullname;
        previewFields.email.textContent = email;
        previewFields.phone.textContent = phone;

        // Ändra typsnitt enligt val
        const previewElements = Object.values(previewFields);
        previewElements.forEach(el => el.style.fontFamily = font);

        // Spara till historik (valfri del)
        saveToHistory({ fullname, email, phone, font });
        renderHistory();
    }

    // Visar felmeddelanden i en <ul>
    function displayErrors(errors) {
        errorListElement.innerHTML = ""; // Rensa tidigare meddelanden

        if (errors.length === 0) return;

        errors.forEach(msg => {
            const li = document.createElement("li");
            li.textContent = msg;
            errorListElement.appendChild(li);
        });
    }

    // Rensar inmatningsfält, förhandsvisning, felmeddelanden och kan även rensa localStorage
    function clearForm() {
        // Rensa formulärfält
        for (const field in formFields) {
            formFields[field].value = "";
        }

        // Rensa preview-fält
        for (const field in previewFields) {
            previewFields[field].textContent = "";
            previewFields[field].style.fontFamily = "";
        }

        // Rensa felmeddelanden
        errorListElement.innerHTML = "";

        // Rensa historik i localStorage och DOM
        localStorage.removeItem("cardHistory");
        historyElement.innerHTML = "";
    }

    // Sparar en post till localStorage-historik
    function saveToHistory(data) {
        let history = JSON.parse(localStorage.getItem("cardHistory")) || [];
        history.push(data);
        localStorage.setItem("cardHistory", JSON.stringify(history));
    }

    // Skriver ut historik till DOM-elementet med id="history"
    function renderHistory() {
        const history = JSON.parse(localStorage.getItem("cardHistory")) || [];
        historyElement.innerHTML = ""; // Töm innehållet

        if (history.length === 0) {
            historyElement.textContent = "Ingen historik tillgänglig.";
            return;
        }

        const list = document.createElement("ul");
        history.forEach(entry => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${entry.fullname}</strong> | 
                ${entry.email} | 
                ${entry.phone} | 
                <em>${entry.font}</em>
            `;
            list.appendChild(li);
        });

        historyElement.appendChild(list);
    }
});
