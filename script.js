console.log();

const key = '311f91f03c97240a6690c66f';

const convertButton = document.getElementById("convertButton");

convertButton.addEventListener("click", convertCurrency);

async function convertCurrency() {
    const amount = document.getElementById("amount").value;
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const results = document.getElementById("result");
}

if (amount === "" || amount <= 0){
    result.innerText = "Skriv inn et gyldig beløp";
    return;
}

try {
    const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${key}/latest/${fromCurrency}`
    );

    const data = await response.json();
    const rate = data.conversion_rates[toCurrency];
    
    result.innerText = 
        '${amount} ${fromCurrency} = ${(amount * rate).toFixed(2)} ${toCurrency}';

} catch {
    result.innerText = "Noe gikk galt. Prøv igjen!";
}