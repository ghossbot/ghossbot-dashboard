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
    // ABRIR SECCIÓN DESDE URL
    // ======================================

    const section =
        params.get("section");


    if (section) {

        openSection(section);

    }

}



// ==========================================
// ABRIR CONFIGURACIÓN
// ==========================================

function openSection(section) {

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
                    Acá podremos configurar el canal
                    y mensaje de bienvenida.
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

        title.textContent =
            "💬 Quotes";


        content.innerHTML = `

            <div class="setting-box">

                <h4>
                    Sistema de Quotes
                </h4>

                <p>
                    Configurá el canal donde GhossBot
                    enviará los Quotes.
                </p>

                <button
                    class="save-config"
                    onclick="saveQuotes()"
                >
                    💾 Configurar Quotes
                </button>

            </div>

        `;

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
// QUOTES
// ==========================================

function saveQuotes() {

    alert(
        "La configuración de Quotes la conectaremos con BDFD en el siguiente paso."
    );

}



loadConfig();
