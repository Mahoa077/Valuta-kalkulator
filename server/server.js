const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 3000;

// 🔥 CORS MÅ KOMME FØRST
app.use(cors({
    origin: "*",
    methods: ["GET"]
}));

// CACHE FIL
const CACHE_FILE = path.join(__dirname, "serverCache.json");

let serverCache = {};

// LAST CACHE FRA FIL
if (fs.existsSync(CACHE_FILE)) {
    const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");

    if (fileContent.trim()) {
        serverCache = JSON.parse(fileContent);
        console.log("Cache lastet fra fil");
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

// API ROUTE
app.get("/api/rates/:base", async (req, res) => {
    const base = req.params.base;

    console.log("Request:", base);
    console.log("CACHE STATE BEFORE:", Object.keys(serverCache));


    console.log("Request:", base);

    if (serverCache[base]) {
        console.log("CACHE HIT:", base);
        console.log("CACHE DATA:", serverCache[base]);
        return res.json(serverCache[base]);
    }

    console.log("CACHE MISS:", base);

    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`
        );

        const data = await response.json();

        serverCache[base] = data;

        console.log("CACHE SAVED:", base);
        
        saveCache();

        res.json(data);

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server kjører på port ${PORT}`);
});