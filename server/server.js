const fs = require("fs");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 3000;

const CACHE_FILE = "serverCache.json";

let serverCache = {};

// last inn cache fra fil
if (fs.existsSync(CACHE_FILE)) {
    serverCache = JSON.parse(
        fs.readFileSync(CACHE_FILE, "utf-8")
    );
}

// lagre cache
function saveCacheToFile() {
    fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(serverCache, null, 2)
    );
}

app.get("/api/rates/:base", async (req, res) => {

    const base = req.params.base;

    console.log("Request:", base);

    // CACHE HIT
    if (serverCache[base]) {
        console.log("CACHE HIT:", base);
        return res.json(serverCache[base]);
    }

    console.log("CACHE MISS:", base);

    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`
        );

        const data = await response.json();

        // lagre i fil-cache
        serverCache[base] = data;
        saveCacheToFile();

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