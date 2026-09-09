const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        bot: "GhossBot",
        version: "1.0.0"
    });
});

app.listen(PORT, () => {
    console.log(`GhossBot Dashboard funcionando en el puerto ${PORT}`);
});
