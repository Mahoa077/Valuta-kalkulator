const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

const PORT = 3000;


// FIL SOM CACHE LAGRES I
const CACHE_FILE =
    path.join(__dirname, "serverCache.json");

    console.log("Cache-fil:", CACHE_FILE);

// SERVER CACHE
let serverCache = {};


// LAST INN CACHE FRA FIL
if (fs.existsSync(CACHE_FILE)) {

    const fileContent =
        fs.readFileSync(CACHE_FILE, "utf-8");

    // SJEKK AT FILEN IKKE ER TOM
    if (fileContent.trim()) {

        serverCache =
            JSON.parse(fileContent);

        console.log("Cache lastet fra fil");
    }
}


// LAGRE CACHE TIL FIL
function saveCacheToFile() {

    fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(serverCache, null, 2)
    );

    console.log("Cache lagret til fil");
}


// API ROUTE
app.get("/api/rates/:base", async (req, res) => {

    const base =
        req.params.base;

    console.log("Request:", base);


    // CACHE HIT
    if (serverCache[base]) {

        console.log("CACHE HIT:", base);

        return res.json(serverCache[base]);
    }


    // CACHE MISS
    console.log("CACHE MISS:", base);

    try {

        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`
        );

        const data =
            await response.json();


        // LAGRE I CACHE
        serverCache[base] = data;


        // SKRIV TIL FIL
        saveCacheToFile();


        // SEND TIL FRONTEND
        res.json(data);

    } catch (error) {

        console.log("API FEIL:", error);

        res.status(500).json({
            error: "Noe gikk galt"
        });
    }
});


// START SERVER
app.listen(PORT, () => {

    console.log(
        `Server kjører på port ${PORT}`
    );
});