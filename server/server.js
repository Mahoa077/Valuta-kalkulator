const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));

const CACHE_FILE = path.join(__dirname, "serverCache.json");

let serverCache = {};

// LOAD CACHE
if (fs.existsSync(CACHE_FILE)) {
    const file = fs.readFileSync(CACHE_FILE, "utf-8");
    if (file.trim()) {
        serverCache = JSON.parse(file);
        console.log("Cache lastet fra fil");
    }
}

// SAVE CACHE
function saveCache() {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(serverCache, null, 2));
    console.log("Cache lagret");
}

// ROUTE
app.get("/api/rates/:base", async (req, res) => {
    const base = req.params.base;

    console.log("Request:", base);

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

        serverCache[base] = data;
        saveCache();

        return res.json(data);

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server kjører på port ${PORT}`);
});