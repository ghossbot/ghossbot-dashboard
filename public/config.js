let guildID = null;


// ==========================================
// INICIAR
// ==========================================

async function loadConfig() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    guildID =
        params.get("id");


    if (!guildID) {

        window.location.href =
            "/dashboard.html";

        return;

    }


    // ======================================
    // USUARIO
    // ======================================

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



    // ======================================
    // SERVIDORES
    // ======================================

    const guildResponse =
        await fetch("/api/guilds");


    if (!guildResponse.ok) {

        window.location.href =
            "/dashboard.html";

        return;

    }


    const guilds =
        await guildResponse.json();


    const guild =
        guilds.find(
            server =>
                server.id === guildID
        );


    if (!guild) {

        alert(
            "No tenés acceso a este servidor."
        );

        window.location.href =
            "/dashboard.html";

        return;

    }


    // ======================================
    // COMPROBAR GHOSSBOT
    // ======================================

    if (guild.botInstalled !== true) {

        alert(
            "GhossBot no está instalado en este servidor."
        );

        window.location.href =
            "/dashboard.html";

        return;

    }


    // ======================================
    // MOSTRAR SERVIDOR
    // ======================================

    document.getElementById(
        "serverName"
    ).textContent =
        guild.name;


    document.getElementById(
        "serverTitle"
    ).textContent =
        guild.name;


    document.getElementById(
        "serverID"
    ).textContent =
        `ID: ${guild.id}`;



    // ======================================
    // ICONO
    // ======================================

    let iconURL;


    if (guild.icon) {

        iconURL =
            `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`;

    } else {

        iconURL =
            `https://cdn.discordapp.com/embed/avatars/${guild.id % 5}.png`;

    }


    document.getElementById(
        "serverIcon"
    ).src =
        iconURL;



    // ======================================
    // ABRIR SECCIÓN
    // ======================================

    const section =
        params.get("section");


    if (section) {

        openSection(section);

    }

}



// ==========================================
// ABRIR SECCIÓN
// ==========================================

async function openSection(section) {

    const area =
        document.getElementById(
            "configurationArea"
        );


    const title =
        document.getElementById(
            "configurationTitle"
        );


    const content =
        document.getElementById(
            "configurationContent"
        );


    area.classList.remove("hidden");



    // ======================================
    // CONFIGURACIÓN GENERAL
    // ======================================

    if (section === "settings") {

        title.textContent =
            "⚙️ Configuración general";


        content.innerHTML = `

            <div class="setting-box">

                <h4>
                    GhossBot
                </h4>

                <p>
                    Configuración general del bot.
                </p>

                <div class="coming-soon">
                    🚧 Próximamente
                </div>

            </div>

        `;

    }



    // ======================================
    // BIENVENIDA
    // ======================================

    else if (section === "welcome") {

        title.textContent =
            "👋 Bienvenida";


        content.innerHTML = `

            <div class="setting-box">

                <h4>
                    Sistema de bienvenida
                </h4>

                <p>
                    Acá podremos configurar los
                    mensajes de bienvenida.
                </p>

                <div class="coming-soon">
                    🚧 Próximamente
                </div>

            </div>

        `;

    }



    // ======================================
    // MODERACIÓN
    // ======================================

    else if (section === "moderation") {

        title.textContent =
            "🛡️ Moderación";


        content.innerHTML = `

            <div class="setting-box">

                <h4>
                    Sistema de moderación
                </h4>

                <p>
                    Acá podremos configurar las
                    funciones de moderación.
                </p>

                <div class="coming-soon">
                    🚧 Próximamente
                </div>

            </div>

        `;

    }



    // ======================================
    // QUOTES
    // ======================================

    else if (section === "quotes") {

        await loadQuotes();

    }



    // ======================================
    // LOGS
    // ======================================

    else if (section === "logs") {

        title.textContent =
            "📜 Logs";


        content.innerHTML = `

            <div class="setting-box">

                <h4>
                    Sistema de Logs
                </h4>

                <p>
                    Configurá el canal donde se
                    enviarán los registros.
                </p>

                <div class="coming-soon">
                    🚧 Próximamente
                </div>

            </div>

        `;

    }

}



// ==========================================
// CARGAR CONFIGURACIÓN DE QUOTES
// ==========================================

async function loadQuotes() {

    const title =
        document.getElementById(
            "configurationTitle"
        );


    const content =
        document.getElementById(
            "configurationContent"
        );


    title.textContent =
        "💬 Quotes";


    content.innerHTML = `

        <div class="setting-box">

            <h4>
                💬 Sistema de Quotes
            </h4>

            <p>
                Elegí el canal donde GhossBot
                enviará los Quotes.
            </p>


            <div class="form-group">

                <label>
                    Canal de Quotes
                </label>


                <select
                    id="quoteChannel"
                    class="config-select"
                >

                    <option value="">
                        Cargando canales...
                    </option>

                </select>

            </div>


            <button
                class="save-config"
                onclick="saveQuotes()"
            >
                💾 Guardar configuración
            </button>


            <div
                id="quoteStatus"
                class="config-status"
            ></div>

        </div>

    `;


    await loadQuoteChannels();

}



// ==========================================
// CARGAR CANALES DE DISCORD
// ==========================================

async function loadQuoteChannels() {

    const select =
        document.getElementById(
            "quoteChannel"
        );


    try {

        const response =
            await fetch(
                `/api/guilds/${guildID}/channels`
            );


        if (!response.ok) {

            select.innerHTML = `

                <option value="">
                    ❌ No se pudieron cargar los canales
                </option>

            `;

            return;

        }


        const channels =
            await response.json();


        select.innerHTML = `

            <option value="">
                Seleccioná un canal
            </option>

        `;


        const textChannels =
            channels.filter(
                channel =>
                    channel.type === 0
            );


        textChannels.forEach(channel => {

            const option =
                document.createElement("option");


            option.value =
                channel.id;


            option.textContent =
                `# ${channel.name}`;


            select.appendChild(
                option
            );

        });


        // ==================================
        // CARGAR CONFIGURACIÓN GUARDADA
        // ==================================

        const configResponse =
            await fetch(
                `/api/guilds/${guildID}/quotes`
            );


        if (configResponse.ok) {

            const config =
                await configResponse.json();


            if (config.channelID) {

                select.value =
                    config.channelID;

            }

        }


    } catch (error) {

        console.error(error);


        select.innerHTML = `

            <option value="">
                ❌ Error cargando canales
            </option>

        `;

    }

}



// ==========================================
// GUARDAR QUOTES
// ==========================================

async function saveQuotes() {

    const select =
        document.getElementById(
            "quoteChannel"
        );


    const status =
        document.getElementById(
            "quoteStatus"
        );


    const channelID =
        select.value;


    if (!channelID) {

        status.textContent =
            "⚠️ Seleccioná un canal primero.";

        status.className =
            "config-status error";

        return;

    }


    try {

        const response =
            await fetch(
                `/api/guilds/${guildID}/quotes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        channelID:
                            channelID
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            status.textContent =
                data.error ||
                "❌ No se pudo guardar.";

            status.className =
                "config-status error";

            return;

        }


        status.textContent =
            "✅ Configuración guardada correctamente.";

        status.className =
            "config-status success";


    } catch (error) {

        console.error(error);


        status.textContent =
            "❌ Error al guardar la configuración.";

        status.className =
            "config-status error";

    }

}



// ==========================================
// INICIAR
// ==========================================

loadConfig();
