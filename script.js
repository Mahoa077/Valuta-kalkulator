console.log("App har startet");


// VALUTAER
const currencies = [
    "USD",
    "NOK",
    "EUR",
    "AUD",
    "CLP",
    "SEK",
    "CAD",
    "DKK",
    "JPY"
];


// HTML ELEMENTER
const fromSelect =
    document.getElementById("fromCurrency");

const toSelect =
    document.getElementById("toCurrency");

const result =
    document.getElementById("result");

const lastUpdated =
    document.getElementById("lastUpdated");

const bg =
    document.getElementById("bg");


// BILDER
const currencyImages = {

    USD: "bilder/usdbilde.png",
    EUR: "bilder/eurbilde.png",
    NOK: "bilder/nokbilde.png",
    AUD: "bilder/audbilde.png",
    CLP: "bilder/clpbilde.png",
    SEK: "bilder/sekbilde.png",
    CAD: "bilder/cadbilde.png",
    DKK: "bilder/dkkbilde.png",
    JPY: "bilder/jpybilde.png"
};


// FYLL DROPDOWNS
currencies.forEach(currency => {

    const option1 =
        new Option(currency, currency);

    const option2 =
        new Option(currency, currency);

    fromSelect.add(option1);
    toSelect.add(option2);
});


// STANDARDVERDIER
fromSelect.value = "USD";
toSelect.value = "NOK";


// HENT VALUTAKURSER
async function getRates(base = "USD") {

    console.log("Henter data fra server:", base);

    try {

        // BACKEND API
        const response = await fetch(
            `http://192.168.20.77:3000/api/rates/${base}`
        );

        if (!response.ok) {

            throw new Error(
                "Backend svarte ikke riktig"
            );
        }

        const data = await response.json();

        return data;

    } catch (error) {

        console.log("API feil:", error);

        throw error;
    }
}


// KONVERTER VALUTA
async function convert() {

    try {

        const amount =
            Number(
                document.getElementById("amount").value
            );

        const fromCurrency =
            fromSelect.value;

        const toCurrency =
            toSelect.value;

        // VALIDERING
        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            result.innerText =
                "Skriv inn et gyldig beløp";

            return;
        }

        // HENT DATA
        const data =
            await getRates(fromCurrency);

        // HENT RATE
        const rate =
            data.conversion_rates[toCurrency];

        if (!rate) {

            throw new Error(
                "Fant ikke valutakurs"
            );
        }

        // REGN UT
        const output =
            (amount * rate).toFixed(2);

        // VIS RESULTAT
        result.innerText =
            `${amount} ${fromCurrency} = ${output} ${toCurrency}`;

        // VIS STATUS
        lastUpdated.innerText =
            "Data hentes fra server-cache";

    } catch (error) {

        console.log(error);

        result.innerText =
            "Noe gikk galt";
    }
}


// OPPDATER BAKGRUNN
function updateBackground() {

    const selectedCurrency =
        toSelect.value;

    bg.style.backgroundImage =
        `url(${currencyImages[selectedCurrency]})`;

    bg.style.opacity = 1;
}


// KONVERTER-KNAPP
document
    .getElementById("convertButton")
    .addEventListener("click", convert);


// BYTT VALUTA
document
    .getElementById("swapButton")
    .addEventListener("click", () => {

        const temp =
            fromSelect.value;

        fromSelect.value =
            toSelect.value;

        toSelect.value =
            temp;

        updateBackground();

        convert();
    });


// AUTO OPPDATER BAKGRUNN
toSelect.addEventListener(
    "change",
    updateBackground
);


// ENTER KNAPP
document
    .getElementById("amount")
    .addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            convert();
        }
    });


// START
updateBackground();