async function loadDashboard() {

    const userResponse = await fetch("/api/me");

    if (!userResponse.ok) {
        window.location.href = "/";
        return;
    }

    const data = await userResponse.json();

    document.getElementById("userText").textContent =
        `Conectado como ${data.user.username}`;


    const guildResponse = await fetch("/api/guilds");

    const guilds = await guildResponse.json();

    const container = document.getElementById("guilds");

    container.innerHTML = "";


    guilds.forEach(guild => {

        const div = document.createElement("div");

        div.className = "guild";

        div.innerHTML = `
            <div>
                <strong>${guild.name}</strong>
                <p>ID: ${guild.id}</p>
            </div>

            <button onclick="selectGuild('${guild.id}')">
                Configurar
            </button>
        `;

        container.appendChild(div);

    });

}


function selectGuild(id) {

    alert(
        "Servidor seleccionado: " + id +
        "\n\nLa configuración la conectaremos en el siguiente módulo."
    );

}


loadDashboard();
