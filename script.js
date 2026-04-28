console.log();

const apiKey = '311f91f03c97240a6690c66f';

//const convertButton = document.getElementById("convertButton");

//convertButton.addEventListener("click", convertCurrency);

async function convertCurrency() {
    const amount = document.getElementById("amount").value;
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const results = document.getElementById("result");
}

if (amount === "" || amount <= 0){
    result.innerText = "Skriv inn et gyldig beløp";
}

async function convert() {
    try {
        const amount = document.getElementById("amount").value;
        const fromCurrency = document.getElementById("fromCurrency").value;
        const toCurrency = document.getElementById("toCurrency").value;
        const result = document.getElementById("result");

        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/311f91f03c97240a6690c66f/latest/${fromCurrency}`
        );
    
        const data = await response.json();
        const rate = data.conversion_rates[toCurrency];
        
        let output = amount * rate
            output = output.toFixed(2)
            //'${amount} ${fromCurrency} = ${(amount * rate).toFixed(2)} ${toCurrency}';
        console.log("ferdig ingen error")
        console.log(output)
        result.innerText = output
    
    } catch (error) {
       console.log(error)
    }
}

const apiURL = "https://app.exchangerate-api.com/dashboard";
const CACHE_key = "exchangeRates";
const CACHE_tid_key = "exchangeRatesTime";
const CACHE_tid = 1000 * 60 * 60; // dette er da altså en time til sammen

async function getRates() {
    const cachedData = localStorage.getItem(CACHE_key);
    const cachedTid = localStorage.getItem(CACHE_tid_key);

    const now = Date.now();

    // dette sjekker om cache eksisterer og om det fortsatt er riktig og funker 
    if(cachedData && cachedTid &&(now - cachedTid < CACHE_tid)) {
        console.log("Bruker cached dataen");
        return JSON.parse(cachedData);
    }

    // Ellers så hent ny data
    console.log("Henter ny data");
    const respons = await fetch(apiURL);
    const data = await response.json();

    // lagrer da til cache 
    localStorage.setItem(CACHE_key, JSON.stringify(data))
    localStorage.setItem(CACHE_tid_key, now);

    return data;
}

async function converterCurrency(amount, from, to) {
    const data = await getRates();

    const rateFRA = data.rates[from];
    const rateTIL = data.rates[to];

    const resultat = (amount / rateFRA) * rateTIL;

    return resultat;
}