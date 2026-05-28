console.log("App har startet");

const currencies = ["USD","NOK","EUR","AUD","CLP","SEK","CAD","DKK","JPY"];

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const result = document.getElementById("result");
const lastUpdated = document.getElementById("lastUpdated");
const bg = document.getElementById("bg");

const API_URL = "http://192.168.20.77:3000";

const currencyImages = {
    USD:"bilder/usdbilde.png",
    EUR:"bilder/eurbilde.png",
    NOK:"bilder/nokbilde.png",
    AUD:"bilder/audbilde.png",
    CLP:"bilder/clpbilde.png",
    SEK:"bilder/sekbilde.png",
    CAD:"bilder/cadbilde.png",
    DKK:"bilder/dkkbilde.png",
    JPY:"bilder/jpybilde.png"
};

// dropdown
currencies.forEach(c => {
    fromSelect.add(new Option(c,c));
    toSelect.add(new Option(c,c));
});

fromSelect.value = "USD";
toSelect.value = "NOK";

async function getRates(base) {
    console.log("Henter data fra server:", base);

    try {
        const res = await fetch(`${API_URL}/api/rates/${base}`);

        if (!res.ok) {
            throw new Error("Server error");
        }

        return await res.json();

    } catch (err) {
        console.log("FETCH ERROR:", err);
        throw err;
    }
}

async function convert() {
    try {
        const amount = Number(document.getElementById("amount").value);
        const from = fromSelect.value;
        const to = toSelect.value;

        if (!amount || amount <= 0) {
            result.innerText = "Skriv inn gyldig beløp";
            return;
        }

        const data = await getRates(from);

        const rate = data?.conversion_rates?.[to];

        if (!rate) {
            result.innerText = "Fant ikke kurs";
            return;
        }

        const output = (amount * rate).toFixed(2);

        result.innerText = `${amount} ${from} = ${output} ${to}`;

        if (data.time_last_update_unix) {
            const t = new Date(data.time_last_update_unix * 1000);
            lastUpdated.innerText =
                "Sist oppdatert: " + t.toLocaleString("no-NO");
        }

    } catch (err) {
        console.log(err);
        result.innerText = "Noe gikk galt";
    }
}

function updateBackground() {
    bg.style.backgroundImage = `url(${currencyImages[toSelect.value]})`;
    bg.style.opacity = 1;
}

// events
document.getElementById("convertButton")
    .addEventListener("click", convert);

document.getElementById("swapButton")
    .addEventListener("click", () => {
        const t = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = t;
        updateBackground();
        convert();
    });

toSelect.addEventListener("change", updateBackground);

document.getElementById("amount")
    .addEventListener("keydown", e => {
        if (e.key === "Enter") convert();
    });

updateBackground();