process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 3000;


// 🧠 REQUEST COUNTER (HER SKAL DEN VÆRE)
let requestCount = 0;


app.get("/api/rates/:base", async (req, res) => {

    const base = req.params.base;

    // øk teller
    requestCount++;

    console.log("━━━━━━━━━━━━━━━━━━━━");
    console.log("API kall mottatt:", base);
    console.log("Tid:", new Date().toISOString());
    console.log("Antall API-kall:", requestCount);
    console.log("━━━━━━━━━━━━━━━━━━━━");

    try {

        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`
        );

        const data = await response.json();

        res.json(data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Noe gikk galt"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});