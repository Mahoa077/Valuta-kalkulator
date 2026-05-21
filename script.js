console.log("App har startet");

//const apiKey = 'deac2d8fd9967e3a4a3ff816';

//const apiURL = "https://app.exchangerate-api.com/dashboard";
const CACHE_key = "exchangeRates_";
const CACHE_tid_key = "exchangeRatesTime_";
const CACHE_tid = 1000 * 60 * 60 * 24; // dette gjør at det går en dag mellom hver gang det blir oppdatert

const currencies = ["USD", "NOK", "EUR", "AUD", "CLP", "SEK", "CAD", "DKK", "JPY"];

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
//const convertButton = document.getElementById("convertButton");

//convertButton.addEventListener("click", convertCurrency);

currencies.forEach(currency => {
    fromSelect.innerHTML += `<option value="${currency}">${currency}</option>`;
    toSelect.innerHTML += `<option value="${currency}">${currency}</option>`;
});

async function convert() {

    const result = document.getElementById("result");
    const lastUpdated = document.getElementById("lastUpdated");

    try {

        const amount = Number(document.getElementById("amount").value);

        const fromCurrency =
            document.getElementById("fromCurrency").value;

        const toCurrency =
            document.getElementById("toCurrency").value;

        if (!amount || amount <= 0) {

            result.innerText = "Skriv inn et gyldig beløp";

            return;
        }

        // HENT DATA FØRST
        const data = await getRates(fromCurrency);

        // VIS SIST OPPDATERT
        if (data.time_last_update_utc) {

            lastUpdated.innerText =
                "Valutakurser oppdatert: " +
                data.time_last_update_utc;

        } else {

            lastUpdated.innerText =
                "Sist oppdatert: ukjent";
        }

        // HENT VALUTAKURS
        const rate = data.conversion_rates[toCurrency];

        // REGN UT
        const output = (amount * rate).toFixed(2);

        // VIS RESULTAT
        result.innerText =
            `${amount} ${fromCurrency} = ${output} ${toCurrency}`;

    } catch (error) {

        console.log(error);

        result.innerText =
            "Noe gikk galt. Prøv igjen senere.";
    }
}

async function getRates(base = "USD") {

    const cachedData = localStorage.getItem(CACHE_key + base);
    const cachedTid = localStorage.getItem(CACHE_tid_key + base);

    const now = Date.now();

    // BRUK CACHE hvis under 24 timer gammel
    if (cachedData && cachedTid && (now - cachedTid < CACHE_tid)) {
        console.log("Bruker cache for", base);

        return JSON.parse(cachedData);
    }

    console.log("Henter ny data for", base);

    try {

        const response = await fetch(`/api/rates/${base}`);

        if (!response.ok) {
            throw new Error("API svarte ikke riktig");
        }

        const data = await response.json();

        if (data.result === "error") {
            throw new Error(data["error-type"]);
        }

        // lagrer NY cache
        localStorage.setItem(CACHE_key + base, JSON.stringify(data));
        localStorage.setItem(CACHE_tid_key + base, now);

        return data;

    } catch (error) {

        console.log("API feil:", error);

        // fallback til gammel cache hvis API er nede
        if (cachedData) {

            console.log("Bruker gammel cache fordi API feilet");

            return JSON.parse(cachedData);
        }

        throw error;
    }
}



const https = require('https');
const http = require('http');

function insecureGet(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        // Konfigurer agenten for å ignorere sertifikatfeil (kun for testing!)
        const agent = new client.Agent({
            rejectUnauthorized: false 
        });

        const req = client.get(url, { agent, timeout }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Tidsavbrudd'));
        });
    });
}

// Bruk
insecureGet('https://example.com')
    .then(response => console.log(response))
    .catch(err => console.error(err));

/*// konverterer valutaen 
async function converterCurrency(amount, from, to) {ba
    const data = await getRates();

    const rateFRA = data.rates[from];
    const rateTIL = data.rates[to];

    const resultat = (amount / rateFRA) * rateTIL;

    return resultat;

    
} */

// Bilder til valuta kalkulator     
const selectTo = document.getElementById("toCurrency");
const bilde = document.getElementById("currencyBilder");

const bg = document.getElementById("bg");

const currencyBilder = {
    USD: "bilder/usdbilde.png",
    EUR: "bilder/eurbilde.png",
    NOK: "bilder/nokbilde.png",
    AUD: "bilder/audbilde.png",
    CLP: "bilder/clpbilde.png",
    SEK: "bilder/sekbilde.png",
    CAD: "bilder/cadbilde.png",
    DKK: "bilder/dkkbilde.png",
    JPY: "bilder/jpybilde.png",
}

document.getElementById("clearCache").addEventListener("click", () => {

    localStorage.clear();

    alert("Cache slettet!");
});

selectTo.addEventListener("change", () => {
    const valgtCurrency = selectTo.value;

    
    bg.style.backgroundImage = `url(${currencyBilder[valgtCurrency]})`;
    bg.style.opacity = 1;

});

const convertButton = document.getElementById("convertButton");
convertButton.addEventListener("click", convert);

bg.style.opacity = 0;