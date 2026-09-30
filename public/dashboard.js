// ==========================================
// GHOSSBOT DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        // ==================================
        // USUARIO
        // ==================================

        const userResponse =
            await fetch("/api/me", {
                cache: "no-store"
            });


        if (!userResponse.ok) {

            window.location.href = "/";

            return;
        }


        const userData =
            await userResponse.json();


        const userText =
            document.getElementById("userText");


        if (userText && userData.user) {

            userText.textContent =
                `Conectado como ${userData.user.username}`;

        }


        // ==================================
        // SERVIDORES
        // ==================================

        const guildResponse =
            await fetch("/api/guilds", {
                cache: "no-store"
            });


        const container =
            document.getElementById("guilds");


        if (!guildResponse.ok) {

            if (container) {

                container.innerHTML = `
                    <div class="empty">

                        <h3>
                            ❌ No se pudieron cargar los servidores
                        </h3>

                        <p>
                            Discord no devolvió la lista de servidores.
                        </p>

                    </div>
                `;

            }

            return;
        }


        const guilds =
            await guildResponse.json();


        console.log(
            "Servidores recibidos:",
            guilds
        );


        // ==================================
        // CONTADOR
        // ==================================

        const serverCount =
            document.getElementById("serverCount");


        if (serverCount) {

            serverCount.textContent =
                guilds.length;

        }


        // ==================================
        // CONTENEDOR
        // ==================================

        if (!container) {

            console.error(
                "No existe el elemento #guilds"
            );

            return;
        }


        container.innerHTML = "";


        // ==================================
        // SIN SERVIDORES
        // ==================================

        if (!Array.isArray(guilds) || guilds.length === 0) {

            container.innerHTML = `

                <div class="empty">

                    <h3>
                        😔 No hay servidores configurables
                    </h3>

                    <p>
                        No se encontraron servidores
                        que puedas administrar.
                    </p>

                </div>

            `;

            return;
        }


        // ==================================
        // MOSTRAR SERVIDORES
        // ==================================

        guilds.forEach(guild => {

            const div =
                document.createElement("div");


            div.className =
                "guild";


            // ==================================
            // ICONO
            // ==================================

            let iconURL;


            if (guild.icon) {

                iconURL =
                    `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`;

            } else {

                const avatarNumber =
                    Number(guild.id) % 5;

                iconURL =
                    `https://cdn.discordapp.com/embed/avatars/${avatarNumber}.png`;

            }


            // ==================================
            // ESTADO DEL BOT
            // ==================================

            let botStatus = `

                <span class="bot-status unknown">

                    ⚪ Verificando GhossBot...

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


            // BOT INSTALADO