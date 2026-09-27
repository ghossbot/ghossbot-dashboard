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
// CONFIGURACIONES
// ==========================================

const guildConfigs = {};


// ==========================================
// FUNCIONES DISCORD
// ==========================================

async function discordBotRequest(
    endpoint,
    options = {}
) {

    const token =
        process.env.DISCORD_BOT_TOKEN;

    if (!token) {
        throw new Error(
            "DISCORD_BOT_TOKEN no está configurado."
        );
    }

    const response =
        await fetch(
            `https://discord.com/api/v10${endpoint}`,
            {
                ...options,

                headers: {
                    Authorization:
                        `Bot ${token}`,

                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})
                }
            }
        );

    return response;
}


// ==========================================
// ESTADO
// ==========================================

app.get(
    "/api/status",
    (req, res) => {

        res.json({
            online: true,
            bot: "GhossBot",
            version: "1.0.0"
        });

    }
);


// ==========================================
// LOGIN DISCORD
// ==========================================

app.get(
    "/auth/discord",
    (req, res) => {

        const clientId =
            process.env.CLIENT_ID;

        const redirectUri =
            process.env.DISCORD_REDIRECT_URI;

        const params =
            new URLSearchParams({
                client_id:
                    clientId,

                redirect_uri:
                    redirectUri,

                response_type:
                    "code",

                scope:
                    "identify guilds"
            });

        res.redirect(
            `https://discord.com/oauth2/authorize?${params.toString()}`
        );

    }
);


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

app.get(
    "/api/me",
    (req, res) => {

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

    }
);


// ==========================================
// OBTENER SERVIDORES
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


            // ======================================
            // SERVIDORES ADMINISTRABLES
            // ======================================

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


            // ======================================
            // COMPROBAR GHOSSBOT
            // ======================================

            const result = [];

            for (
                const guild
                of manageableGuilds
            ) {

                let botInstalled =
                    false;


                try {

                    /*
                     * Primero obtenemos la cuenta
                     * del bot mediante su token.
                     */

                    const botUserResponse =
                        await discordBotRequest(
                            "/users/@me"
                        );


                    if (
                        botUserResponse.ok
                    ) {

                        const botUser =
                            await botUserResponse.json();


                        /*
                         * Comprobamos si el bot
                         * es miembro del servidor.
                         */

                        const memberResponse =
                            await discordBotRequest(
                                `/guilds/${guild.id}/members/${botUser.id}`
                            );


                        if (
                            memberResponse.ok
                        ) {

                            botInstalled =
                                true;

                        }

                    }

                } catch (error) {

                    console.error(
                        `Error comprobando bot en ${guild.name}:`,
                        error.message
                    );

                    botInstalled =
                        false;

                }


                result.push({

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
                        botInstalled

                });

            }


            res.json(
                result
            );


        } catch (error) {

            console.error(
                "Error obteniendo servidores:",
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
// INVITACIÓN DEL BOT
// ==========================================

app.get(
    "/api/bot/invite",
    (req, res) => {

        const clientId =
            process.env.CLIENT_ID;

        if (!clientId) {

            return res
                .status(500)
                .json({
                    error:
                        "CLIENT_ID no está configurado."
                });

        }


        const params =
            new URLSearchParams({

                client_id:
                    clientId,

                scope:
                    "bot applications.commands",

                permissions:
                    "0"

            });


        const inviteURL =
            `https://discord.com/oauth2/authorize?${params.toString()}`;


        res.json({

            url:
                inviteURL

        });

    }
);


// ==========================================
// CANALES DEL SERVIDOR
// ==========================================

app.get(
    "/api/guilds/:guildID/channels",
    async (req, res) => {

        const guildID =
            req.params.guildID;


        try {

            const response =
                await discordBotRequest(
                    `/guilds/${guildID}/channels`
                );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Error obteniendo canales:",
                    data
                );

                return res
                    .status(
                        response.status
                    )
                    .json({
                        error:
                            "No se pudieron obtener los canales."
                    });

            }


            res.json(
                data
            );


        } catch (error) {

            console.error(
                error
            );

            res
                .status(500)
                .json({
                    error:
                        "Error obteniendo canales."
                });

        }

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

            success:
                true,

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