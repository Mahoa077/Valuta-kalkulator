const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 3000;

// CORS
app.use(cors({
    origin: "*",
    methods: ["GET"]
}));

// CACHE FIL
const CACHE_FILE = path.join(__dirname, "serverCache.json");

let serverCache = {};

// LAST CACHE FRA FIL
if (fs.existsSync(CACHE_FILE)) {
    try {
        const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");

        if (fileContent.trim()) {
            serverCache = JSON.parse(fileContent);
            console.log("Cache lastet fra fil");
        }
    } catch (err) {
        console.log("Feil i cache-fil, starter tom cache");
        serverCache = {};
    }
}

// LAGRE CACHE
function saveCache() {
    fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(serverCache, null, 2)
    );
    console.log("Cache lagret til fil");
}

// API
app.get("/api/rates/:base", async (req, res) => {
    const base = req.params.base;

    console.log("Request:", base);

    // CACHE HIT
    if (serverCache[base]) {
        console.log("CACHE HIT:", base);

        return res.json({
            ...serverCache[base],
            fromCache: true
        });
    }

    console.log("CACHE MISS:", base);

    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`
        );

        const data = await response.json();

        serverCache[base] = data;

        saveCache();

        return res.json({
            ...data,
            fromCache: false
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server kjører på port ${PORT}`);
});