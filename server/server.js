const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

// Node 20 har fetch innebygd (OK)
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = 3000;

const CACHE_FILE = path.join(__dirname, "serverCache.json");
let serverCache = {};

app.get("/", (req, res) => {
    res.send("SERVER FUNKER");
});

// LAST CACHE
if (fs.existsSync(CACHE_FILE)) {
    const file = fs.readFileSync(CACHE_FILE, "utf-8");
    if (file.trim()) {
        try {
            serverCache = JSON.parse(file);
            console.log("Cache lastet fra fil");
        } catch (err) {
            console.log("Kunne ikke parse cache-fil");
            serverCache = {};
        }
    }
}

// LAGRE CACHE
function saveCache() {
    try {
        fs.writeFileSync(
            CACHE_FILE,
            JSON.stringify(serverCache, null, 2)
        );
    } catch (err) {
        console.log("Feil ved lagring av cache:", err);
    }
}

// API ROUTE
app.get("/api/rates/:base", async (req, res) => {
    const base = req.params.base;

    console.log("Request:", base);

    try {
        // CACHE HIT
        if (serverCache[base]) {
            console.log("CACHE HIT:", base);
            return res.json(serverCache[base].data);
        }

        console.log("CACHE MISS:", base);

        const url = `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API feil: ${response.status}`);
        }

        const data = await response.json();

        // lagre cache
        serverCache[base] = {
            data,
            cachedAt: Date.now()
        };

        saveCache();

        return res.json(data);

    } catch (err) {
        console.log("SERVER ERROR:", err);

        return res.status(500).json({
            error: "Server error"
        });
    }
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server kjører på port ${PORT}`);
});