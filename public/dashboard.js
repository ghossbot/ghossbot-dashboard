async function loadDashboard() {

    const userResponse = await fetch("/api/me");

    if (!userResponse.ok) {
        window.location.href = "/";
        return;
    }

    const userData = await userResponse.json();

    document.getElementById("userText").textContent =
        `Conectado como ${userData.user.username}`;


    const guildResponse = await fetch("/api/guilds");

    if (!guildResponse.ok) {
        document.getElementById("guilds").textContent =
            "No se pudieron cargar los servidores.";
        return;
    }

    const guilds = await guildResponse.json();

    const container = document.getElementById("guilds");

    container.innerHTML = "";


    /*
        ADMINISTRADOR = 0x8

        Solo mostramos servidores donde:
        - El usuario es dueño
        O
        - Tiene permiso de Administrador
    */

    const manageableGuilds = guilds.filter(guild => {

        const isOwner = guild.owner === true;

        const permissions = BigInt(guild.permissions || 0);

        const administrator =
            (permissions & 0x8n) === 0x8n;

        return isOwner || administrator;

    });


    if (manageableGuilds.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>😔 No hay servidores configurables</h3>

                <p>
                    No tenés permisos suficientes para administrar
                    ningún servidor donde puedas configurar GhossBot.
                </p>
            </div>
        `;

        return;
    }


    manageableGuilds.forEach(guild => {

        const div = document.createElement("div");

        div.className = "guild";


        let iconURL;

        if (guild.icon) {

            iconURL =
                `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;

        } else {

            iconURL =
                `https://cdn.discordapp.com/embed/avatars/${guild.id % 5}.png`;

        }


        div.innerHTML = `

            <div class="guild-info">

                <img
                    class="guild-icon"
                    src="${iconURL}"
                    alt="Icono de ${guild.name}"
                >

                <div>

                    <strong>
                        ${escapeHTML(guild.name)}
                    </strong>

                    <p>
                        ${guild.owner ? "👑 Propietario" : "🛡️ Administrador"}
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


        container.appendChild(div);

    });

}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


function selectGuild(id) {

    window.location.href =
        `/server.html?id=${encodeURIComponent(id)}`;

}


loadDashboard();
