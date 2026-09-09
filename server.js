const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "ghossbot-dashboard-secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static(path.join(__dirname, "public")));


// ================================
// ESTADO DEL DASHBOARD
// ================================

app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        bot: "GhossBot",
        version: "1.0.0"
    });

});


// ================================
// LOGIN CON DISCORD
// ================================

app.get("/auth/discord", (req, res) => {

    const clientId = process.env.CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "identify guilds"
    });

    res.redirect(
        `https://discord.com/oauth2/authorize?${params.toString()}`
    );

});


// ================================
// CALLBACK DE DISCORD
// ================================

app.get("/auth/discord/callback", async (req, res) => {

    const code = req.query.code;

    if (!code) {
        return res.status(400).send("No se recibió el código de Discord.");
    }

    try {

        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI
        });

        const tokenResponse = await fetch(
            "https://discord.com/api/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error(tokenData);
            return res.status(500).send("No se pudo iniciar sesión con Discord.");
        }

        const userResponse = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`
                }
            }
        );

        const user = await userResponse.json();

        req.session.user = user;
        req.session.accessToken = tokenData.access_token;

        res.redirect("/dashboard.html");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Ocurrió un error al conectar con Discord."
        );

    }

});


// ================================
// USUARIO ACTUAL
// ================================

app.get("/api/me", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            loggedIn: false
        });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });

});


// ================================
// SERVIDORES DEL USUARIO
// ================================

app.get("/api/guilds", async (req, res) => {

    if (!req.session.accessToken) {
        return res.status(401).json({
            error: "No estás conectado."
        });
    }

    try {

        const response = await fetch(
            "https://discord.com/api/users/@me/guilds",
            {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`
                }
            }
        );

        const guilds = await response.json();

        res.json(guilds);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudieron obtener los servidores."
        });

    }

});


// ================================
// LOGOUT
// ================================

app.get("/auth/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });

});


// ================================
// SERVIDOR
// ================================

app.listen(PORT, () => {

    console.log(
        `GhossBot Dashboard funcionando en el puerto ${PORT}`
    );

});
