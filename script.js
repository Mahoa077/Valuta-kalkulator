console.log("App har startet");

const apiKey = '311f91f03c97240a6690c66f';

//const apiURL = "https://app.exchangerate-api.com/dashboard";
const CACHE_key = "exchangeRates_";
const CACHE_tid_key = "exchangeRatesTime_";
const CACHE_tid = 1000 * 60 * 60; // dette er da altså en time til sammen

//const convertButton = document.getElementById("convertButton");

//convertButton.addEventListener("click", convertCurrency);

async function convert() {
    const result = document.getElementById("result");

    try {
        const amount = Number(document.getElementById("amount").value);
        const fromCurrency = document.getElementById("fromCurrency").value;
        const toCurrency = document.getElementById("toCurrency").value;
        

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
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`
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
}

selectTo.addEventListener("change", () => {
    const valgtCurrency = selectTo.value;

    bilde.style.opacity = 0;

    bg.style.opacity = 0;

    setTimeout(() => {
        bg.style.backgroundImage = `url(${currencyBilder[valgtCurrency]})`;
        bg.style.opacity = 1;
        bilde.src = currencyBilder[valgtCurrency];
        bilde.style.opacity = 1;
    }, 200) ;
});

const convertButton = document.getElementById("convertButton");
convertButton.addEventListener("click", convert);
