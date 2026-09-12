async function loadDashboard() {

    // =====================================
    // COMPROBAR USUARIO
    // =====================================

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



    // =====================================
    // OBTENER SERVIDORES
    // =====================================

    const guildResponse =
        await fetch("/api/guilds");


    const container =
        document.getElementById("guilds");


    if (!guildResponse.ok) {

        let errorText =
            "No se pudieron cargar los servidores.";


        try {

            const errorData =
                await guildResponse.json();


            if (errorData.error) {
                errorText =
                    errorData.error;
            }

        } catch (error) {}


        container.innerHTML = `

            <div class="empty">

                <h3>
                    ❌ Error
                </h3>

                <p>
                    ${escapeHTML(errorText)}
                </p>

            </div>

        `;

        return;

    }


    const guilds =
        await guildResponse.json();


    container.innerHTML = "";



    // =====================================
    // SIN SERVIDORES
    // =====================================

    if (guilds.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <h3>
                    😔 No hay servidores configurables
                </h3>

                <p>
                    No tenés permisos de administrador
                    en ningún servidor.
                </p>

            </div>

        `;

        return;

    }



    // =====================================
    // MOSTRAR SERVIDORES
    // =====================================

    guilds.forEach(guild => {

        const div =
            document.createElement("div");


        div.className =
            "guild";


        // ---------------------------------
        // ICONO
        // ---------------------------------

        let iconURL;


        if (guild.icon) {

            iconURL =
                `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;

        } else {

            iconURL =
                `https://cdn.discordapp.com/embed/avatars/${guild.id % 5}.png`;

        }



        // =================================
        // GHOSSBOT INSTALADO
        // =================================

        if (guild.botInstalled === true) {

            div.innerHTML = `

                <div class="guild-info">

                    <img
                        class="guild-icon"
                        src="${iconURL}"
                        alt="Icono del servidor"
                    >

                    <div>

                        <strong>
                            ${escapeHTML(guild.name)}
                        </strong>

                        <p class="bot-installed">
                            🟢 GhossBot está instalado
                        </p>

                    </div>

                </div>


                <button
                    class="configure"
                    onclick="selectGuild('${guild.id}')"
                >
                    ⚙️ Configurar
                </button>

            `;

        }



        // =================================
        // GHOSSBOT NO INSTALADO
        // =================================

        else {

            div.innerHTML = `

                <div class="guild-info">

                    <img
                        class="guild-icon"
                        src="${iconURL}"
                        alt="Icono del servidor"
                    >

                    <div>

                        <strong>
                            ${escapeHTML(guild.name)}
                        </strong>

                        <p class="bot-not-installed">
                            ⚪ GhossBot no está instalado
                        </p>

                    </div>

                </div>


                <button
                    class="invite"
                    onclick="inviteBot('${guild.id}')"
                >
                    ➕ Invitar GhossBot
                </button>

            `;

        }


        container.appendChild(div);

    });

}



// =====================================
// SEGURIDAD HTML
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}



// =====================================
// CONFIGURAR SERVIDOR
// =====================================

function selectGuild(id) {

    window.location.href =
        `/server.html?id=${encodeURIComponent(id)}`;

}



// =====================================
// INVITAR GHOSSBOT
// =====================================

function inviteBot(guildID) {

    // Tu Client ID de Discord
    const clientID =
        "864595576511660052";


    // Administrator
    const permissions =
        "8";


    const url =
        `https://discord.com/oauth2/authorize?client_id=${clientID}&permissions=${permissions}&scope=bot%20applications.commands&guild_id=${guildID}`;


    window.location.href =
        url;

}



// =====================================
// INICIAR
// =====================================

loadDashboard();
