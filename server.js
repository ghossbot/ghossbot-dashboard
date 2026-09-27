const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "ghossbot-dashboard-secret",

        resave: false,

        saveUninitialized: false
    })
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==========================================
// CONFIGURACIONES TEMPORALES
// ==========================================

const guildConfigs = {};


// ==========================================
// ESTADO
// ==========================================

app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        bot: "GhossBot",
        version: "1.0.0"
    });

});


// ==========================================
// LOGIN DISCORD
// ==========================================

app.get("/auth/discord", (req, res) => {

    const clientId =
        process.env.CLIENT_ID;

    const redirectUri =
        process.env.DISCORD_REDIRECT_URI;

    const params =
        new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "identify guilds"
        });

    res.redirect(
        `https://discord.com/oauth2/authorize?${params.toString()}`
    );

});


// ==========================================
// CALLBACK DISCORD
// ==========================================

app.get(
    "/auth/discord/callback",
    async (req, res) => {

        const code =
            req.query.code;

        if (!code) {

            return res
                .status(400)
                .send(
                    "No se recibió el código de Discord."
                );

        }

        try {

            const params =
                new URLSearchParams({
                    client_id:
                        process.env.CLIENT_ID,

                    client_secret:
                        process.env.CLIENT_SECRET,

                    grant_type:
                        "authorization_code",

                    code:
                        code,

                    redirect_uri:
                        process.env.DISCORD_REDIRECT_URI
                });


            const tokenResponse =
                await fetch(
                    "https://discord.com/api/oauth2/token",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body: params
                    }
                );


            const tokenData =
                await tokenResponse.json();


            if (!tokenData.access_token) {

                console.error(
                    "Error de Discord:",
                    tokenData
                );

                return res
                    .status(500)
                    .send(
                        "No se pudo iniciar sesión con Discord."
                    );

            }


            const userResponse =
                await fetch(
                    "https://discord.com/api/users/@me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${tokenData.access_token}`
                        }
                    }
                );


            const user =
                await userResponse.json();


            req.session.user =
                user;

            req.session.accessToken =
                tokenData.access_token;


            res.redirect(
                "/dashboard.html"
            );


        } catch (error) {

            console.error(
                error
            );

            res
                .status(500)
                .send(
                    "Ocurrió un error al conectar con Discord."
                );

        }

    }
);


// ==========================================
// USUARIO ACTUAL
// ==========================================

app.get("/api/me", (req, res) => {

    if (!req.session.user) {

        return res
            .status(401)
            .json({
                loggedIn: false
            });

    }

    res.json({

        loggedIn: true,

        user:
            req.session.user

    });

});


// ==========================================
// SERVIDORES DEL USUARIO
// ==========================================

app.get(
    "/api/guilds",
    async (req, res) => {

        if (!req.session.accessToken) {

            return res
                .status(401)
                .json({
                    error:
                        "No estás conectado."
                });

        }


        try {

            const response =
                await fetch(
                    "https://discord.com/api/users/@me/guilds",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${req.session.accessToken}`
                        }
                    }
                );


            const guilds =
                await response.json();


            if (!Array.isArray(guilds)) {

                console.error(
                    "Discord respondió:",
                    guilds
                );

                return res
                    .status(500)
                    .json({
                        error:
                            "Discord no devolvió los servidores."
                    });

            }


            /*
             * ADMINISTRADOR = 0x8
             *
             * Mostramos solamente servidores
             * que el usuario puede administrar.
             */

            const manageableGuilds =
                guilds.filter(guild => {

                    const isOwner =
                        guild.owner === true;


                    const permissions =
                        BigInt(
                            guild.permissions || 0
                        );


                    const administrator =
                        (
                            permissions &
                            0x8n
                        ) === 0x8n;


                    return (
                        isOwner ||
                        administrator
                    );

                });


            /*
             * IMPORTANTE:
             *
             * Por ahora NO intentamos comprobar
             * la presencia de GhossBot mediante
             * un token.
             *
             * Primero dejamos funcionando
             * correctamente el dashboard.
             *
             * La detección automática del bot
             * la hacemos en el siguiente paso.
             */

            const result =
                manageableGuilds.map(guild => {

                    return {

                        id:
                            guild.id,

                        name:
                            guild.name,

                        icon:
                            guild.icon,

                        owner:
                            guild.owner,

                        permissions:
                            guild.permissions,

                        botInstalled:
                            null

                    };

                });


            res.json(
                result
            );


        } catch (error) {

            console.error(
                error
            );


            res
                .status(500)
                .json({
                    error:
                        "No se pudieron obtener los servidores."
                });

        }

    }
);


// ==========================================
// CANALES DEL SERVIDOR
// ==========================================
//
// POR AHORA NO DEPENDE DEL BOT TOKEN.
// Esta ruta queda preparada para la próxima
// etapa de integración.
//

app.get(
    "/api/guilds/:guildID/channels",
    async (req, res) => {

        /*
         * Discord no permite obtener los canales
         * privados de un servidor utilizando
         * simplemente el OAuth del usuario.
         *
         * Esta ruta será conectada al sistema
         * del bot cuando hagamos la integración.
         */

        res.status(501).json({

            error:
                "La obtención de canales se conectará en la próxima etapa."

        });

    }
);


// ==========================================
// OBTENER CONFIGURACIÓN DE QUOTES
// ==========================================

app.get(
    "/api/guilds/:guildID/quotes",
    (req, res) => {

        const guildID =
            req.params.guildID;


        const config =
            guildConfigs[guildID] || {};


        res.json({

            channelID:
                config.quoteChannelID ||
                null

        });

    }
);


// ==========================================
// GUARDAR CONFIGURACIÓN DE QUOTES
// ==========================================

app.post(
    "/api/guilds/:guildID/quotes",
    (req, res) => {

        const guildID =
            req.params.guildID;


        const channelID =
            req.body.channelID;


        if (!channelID) {

            return res
                .status(400)
                .json({
                    error:
                        "No se especificó ningún canal."
                });

        }


        if (!guildConfigs[guildID]) {

            guildConfigs[guildID] = {};

        }


        guildConfigs[guildID]
            .quoteChannelID =
                channelID;


        console.log(
            `Quotes configurado: ${guildID} → ${channelID}`
        );


        res.json({

            success: true,

            guildID:
                guildID,

            channelID:
                channelID

        });

    }
);


// ==========================================
// LOGOUT
// ==========================================

app.get(
    "/auth/logout",
    (req, res) => {

        req.session.destroy(
            () => {

                res.redirect("/");

            }
        );

    }
);


// ==========================================
// SERVIDOR
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `GhossBot Dashboard funcionando en el puerto ${PORT}`
        );

    }
);