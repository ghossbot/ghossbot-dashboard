async function loadDashboard() {

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



    // ==========================================
    // SERVIDORES
    // ==========================================

    const guildResponse =
        await fetch("/api/guilds");


    if (!guildResponse.ok) {

        document.getElementById(
            "guilds"
        ).textContent =
            "No se pudieron cargar los servidores.";

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



    // ==========================================
    // MOSTRAR SERVIDORES
    // ==========================================

    guilds.forEach(guild => {

        const div =
            document.createElement("div");


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



        // ======================================
        // ESTADO DEL BOT
        // ======================================

        let botStatus = `
            <span class="bot-status unknown">
                ⚪ Verificando bot...
            </span>
        `;


        let actionButton = `

            <button
                class="configure"
                onclick="selectGuild('${guild.id}')"
            >
                ⚙️ Configurar
            </button>

        `;


        /*
         * Por ahora botInstalled puede ser null
         * porque todavía no tenemos la conexión
         * directa con el bot BDFD.
         *
         * NO mostramos "Invitar bot" falsamente.
         */

        if (guild.botInstalled === true) {

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


        else if (guild.botInstalled === false) {

            botStatus = `
                <span class="bot-status not-installed">
                    🔴 GhossBot no está instalado
                </span>
            `;

            actionButton = `

                <button
                    class="invite"
                    onclick="inviteBot('${guild.id}')"
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

}



// ==========================================
// ESCAPAR HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}



// ==========================================
// CONFIGURAR SERVIDOR
// ==========================================

function selectGuild(id) {

    window.location.href =
        `/config.html?id=${encodeURIComponent(id)}`;

}



// ==========================================
// INVITAR BOT
// ==========================================

function inviteBot(id) {

    /*
     * Lo conectaremos al enlace real de
     * invitación de GhossBot cuando dejemos
     * definida la integración.
     */

    alert(
        "La invitación de GhossBot se configurará en el siguiente paso."
    );

}



// ==========================================
// INICIAR
// ==========================================

loadDashboard();