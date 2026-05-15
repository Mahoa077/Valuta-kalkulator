console.log("App har startet");

//const apiKey = '311f91f03c97240a6690c66f';

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
        const fromCurrency = document.getElementById("fromCurrency").value;
        const toCurrency = document.getElementById("toCurrency").value;
        
        const cachedTime = localStorage.getItem(CACHE_tid_key + fromCurrency);

        if (cachedTime) {
            lastUpdated.innerText = "Sist oppdatert: " + formatTimeAgo(Number(cachedTime));
        } else {
            lastUpdated.innerText = "Sist oppdatert: ukjent ";
        }

        if (!amount || amount <= 0){
            result.innerText = "Skriv inn et gyldig beløp";
            return;
        }

        const data = await getRates(fromCurrency);
        const rate = data.conversion_rates[toCurrency];
        
        const output = (amount * rate).toFixed(2);

        result.innerText = `${amount} ${fromCurrency} = ${output} ${toCurrency}`;

        
        
    } catch (error) {
       console.log(error);
       result.innerText = "Noe gikk galt. Prøv igjen senere, unnskyld!";
    }

    
}


// henter valutakurser ( med cache )
async function getRates(base = "USD") {

    const cachedData = localStorage.getItem(CACHE_key + base);
    const cachedTid = localStorage.getItem(CACHE_tid_key + base);
    const now = Date.now();

    // dette sjekker om cache eksisterer og om det fortsatt er riktig og funker 
    if(cachedData && cachedTid &&(now - cachedTid < CACHE_tid)) {
        console.log("Bruker cache for", base);
        return JSON.parse(cachedData);
    }

    // Ellers så hent ny data
    console.log("Henter ny data for", base);

    const response = await fetch(
        `http://localhost:3000/api/rates/${base}`
    );
    
    const data = await response.json();

    if (data.result === "error"){
        throw new Error(data["error-type"]);
    }
    

    // lagrer da til cache 
    localStorage.setItem(CACHE_key + base, JSON.stringify(data));
    localStorage.setItem(CACHE_tid_key + base, now);

    return data; 
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes =Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60); 

    if (minutes < 1) return "akkurat nå";
    if (minutes < 60) return `${minutes} minutter siden`;
    return `${hours} timer siden`; 
}

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

selectTo.addEventListener("change", () => {
    const valgtCurrency = selectTo.value;

    
    bg.style.backgroundImage = `url(${currencyBilder[valgtCurrency]})`;
    bg.style.opacity = 1;

});

const convertButton = document.getElementById("convertButton");
convertButton.addEventListener("click", convert);

bg.style.opacity = 0;s