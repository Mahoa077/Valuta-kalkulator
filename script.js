console.log("App har startet");

// VALUTAER
const currencies = ["USD","NOK","EUR","AUD","CLP","SEK","CAD","DKK","JPY"];

// ELEMENTER
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const result = document.getElementById("result");
const lastUpdated = document.getElementById("lastUpdated");
const bg = document.getElementById("bg");

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

// DROPDOWN
currencies.forEach(c => {
    fromSelect.add(new Option(c, c));
    toSelect.add(new Option(c, c));
});

fromSelect.value = "USD";
toSelect.value = "NOK";

// API
async function getRates(base) {
    console.log("Henter data fra server:", base);

    const response = await fetch(
        `http://localhost:3000/api/rates/${base}`
    );

    if (!response.ok) {
        throw new Error("Server error");
    }

    const data = await response.json();

    console.log("API DATA:", data);

    return data;
}

// KONVERTER
async function convert() {
    try {
        const amount = Number(document.getElementById("amount").value);
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;

        if (Number.isNaN(amount) || amount <= 0) {
            result.innerText = "Skriv inn et gyldig beløp";
            return;
        }

        const data = await getRates(fromCurrency);

        console.log("FROM SERVER:", data);

        const rate = data?.conversion_rates?.[toCurrency];

        if (!rate) {
            throw new Error("Fant ikke valutakurs");
        }

        const output = (amount * rate).toFixed(2);

        result.innerText =
            `${amount} ${fromCurrency} = ${output} ${toCurrency}`;

        // CACHE / TIME INFO
        const time = data.time_last_update_unix
            ? new Date(data.time_last_update_unix * 1000)
            : null;

        lastUpdated.innerText =
            "Sist oppdatert: " +
            (time ? time.toLocaleString("no-NO") : "ukjent") +
            (data.fromCache ? " (CACHE)" : " (API)");

    } catch (err) {
        console.log(err);
        result.innerText = "Noe gikk galt";
    }
}

// BACKGROUND
function updateBackground() {
    const currency = toSelect.value;
    bg.style.backgroundImage = `url(${currencyImages[currency]})`;
    bg.style.opacity = 1;
}

// EVENTS
document.getElementById("convertButton").addEventListener("click", convert);

document.getElementById("swapButton").addEventListener("click", () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    updateBackground();
    convert();
});

toSelect.addEventListener("change", updateBackground);

document.getElementById("amount").addEventListener("keydown", (e) => {
    if (e.key === "Enter") convert();
});

// START
updateBackground();