const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 3000;

console.log("API KEY:", process.env.API_KEY);

app.get("/", (req, res) => {
    res.send("SERVER FUNKER");
});

app.get("/api/rates/:base", async (req, res) => {
    const base = req.params.base;

    try {
        const url = `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${base}`;

        console.log("\n--- NEW REQUEST ---");
        console.log("BASE:", base);
        console.log("URL:", url);

        const response = await fetch(url);

        console.log("STATUS:", response.status);

        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.log("JSON PARSE ERROR:", err);
            return res.status(500).json({ error: "Invalid JSON from API" });
        }

        // Hvis API returnerer error
        if (data.result === "error") {
            console.log("API ERROR:", data);
            return res.status(500).json({ error: data["error-type"] });
        }

        return res.json(data);

    } catch (err) {
        console.log("SERVER CRASH:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});