async function loadDashboard() {

    try {

        const userResponse =
            await fetch("/api/me");


        if (!userResponse.ok) {

            window.location.href = "/";

            return;

        }


        const userData =
            await userResponse.json();


        document.getElementById(
            "userText"
        ).textContent =
            `Conectado como ${userData.user.username}`;


        const guildResponse =
            await fetch("/api/guilds");


        if (!guildResponse.ok) {

            document.getElementById(
                "guilds"
            ).innerHTML = `
                <div class="empty">
                    <h3>
                        ❌ No se pudieron cargar los servidores
                    </h3>

                    <p>
                        Intentá actualizar la página.
                    </p>
                </div>
            `;

            return;

        }


        const guilds =
            await guildResponse.json();


        const container =
            document.getElementById(
                "guilds"
            );


        container.innerHTML = "";


        if (!guilds.length) {

            container.innerHTML = `
                <div class="empty">

                    <h3>
                        😔 No hay servidores configurables
                    </h3>

                    <p>
                        No tenés permisos suficientes
                        para administrar ningún servidor.
                    </p>

                </div>
            `;

            return;

        }


        guilds.forEach(guild => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "guild";


            let iconURL;


            if (guild.icon) {

                iconURL =
                    `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;

            } else {

                iconURL =
                    `https://cdn.discordapp.com/embed/avatars/${guild.id % 5}.png`;

            }


            let botStatus = "";

            let actionButton = "";


            // ======================================
            // BOT INSTALADO
            // ======================================

            if (
                guild.botInstalled === true
            ) {

                botStatus = `
                    <span class="bot-status installed">
                        🟢 GhossBot está instalado
                    </span>
                `;


                actionButton = `
                    <button
                        class="configure"
                        onclick="selectGuild('${guild.id}')"
                    >
                        ⚙️ Configurar
                    </button>
                `;

            }


            // ======================================
            // BOT NO INSTALADO
            // ======================================

            else {

                botStatus = `
                    <span class="bot-status not-installed">
                        🔴 GhossBot no está instalado
                    </span>
                `;


                actionButton = `
                    <button
                        class="invite"
                        onclick="inviteBot()"
                    >
                        ➕ Invitar bot
                    </button>
                `;

            }


            div.innerHTML = `

                <div class="guild-info">

                    <img
                        class="guild-icon"
                        src="${iconURL}"
                        alt="Icono de ${escapeHTML(guild.name)}"
                    >

                    <div>

                        <strong>
                            ${escapeHTML(guild.name)}
                        </strong>

                        <p>
                            ${
                                guild.owner
                                    ? "👑 Propietario"
                                    : "🛡️ Administrador"
                            }
                        </p>

                        <div class="guild-bot-status">
                            ${botStatus}
                        </div>

                    </div>

                </div>

                ${actionButton}

            `;


            container.appendChild(
                div
            );

        });


    } catch (error) {

        console.error(
            "Error cargando dashboard:",
            error
        );


        document.getElementById(
            "guilds"
        ).innerHTML = `
            <div class="empty">

                <h3>
                    ❌ Error cargando el dashboard
                </h3>

                <p>
                    Revisá la conexión con Discord.
                </p>

            </div>
        `;

    }

}


// ==========================================
// INVITAR BOT
// ==========================================

async function inviteBot() {

    try {

        const response =
            await fetch(
                "/api/bot/invite"
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.url
        ) {

            alert(
                "No se pudo generar la invitación de GhossBot."
            );

            return;

        }


        window.location.href =
            data.url;


    } catch (error) {

        console.error(
            error
        );


        alert(
            "No se pudo abrir la invitación de GhossBot."
        );

    }

}


// ==========================================
// CONFIGURAR SERVIDOR
// ==========================================

function selectGuild(id) {

    window.location.href =
        `/config.html?id=${encodeURIComponent(id)}`;

}


// ==========================================
// SEGURIDAD HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// ==========================================
// INICIAR
// ==========================================

loadDashboard();