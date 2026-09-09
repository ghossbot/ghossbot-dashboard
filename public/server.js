async function loadServer() {

    const params = new URLSearchParams(
        window.location.search
    );

    const guildID = params.get("id");


    if (!guildID) {

        window.location.href = "/dashboard.html";

        return;

    }


    // ================================
    // USUARIO
    // ================================

    const userResponse =
        await fetch("/api/me");


    if (!userResponse.ok) {

        window.location.href = "/";

        return;

    }


    const userData =
        await userResponse.json();


    document.getElementById("userText").textContent =
        `Conectado como ${userData.user.username}`;



    // ================================
    // SERVIDORES
    // ================================

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
            server => server.id === guildID
        );


    if (!guild) {

        alert(
            "No tenés acceso a este servidor."
        );

        window.location.href =
            "/dashboard.html";

        return;

    }


    // ================================
    // COMPROBAR PERMISOS
    // ================================

    const permissions =
        BigInt(guild.permissions || 0);


    const administrator =
        (permissions & 0x8n) === 0x8n;


    if (!guild.owner && !administrator) {

        alert(
            "No tenés permisos para configurar este servidor."
        );

        window.location.href =
            "/dashboard.html";

        return;

    }



    // ================================
    // DATOS DEL SERVIDOR
    // ================================

    document.getElementById(
        "serverName"
    ).textContent = guild.name;


    document.getElementById(
        "serverTitle"
    ).textContent = guild.name;


    document.getElementById(
        "serverCardName"
    ).textContent = guild.name;


    document.getElementById(
        "serverID"
    ).textContent =
        `ID: ${guild.id}`;



    // ================================
    // ICONO
    // ================================

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
    ).src = iconURL;

}



function openConfig(section) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const guildID =
        params.get("id");


    window.location.href =
        `/config.html?id=${encodeURIComponent(guildID)}&section=${encodeURIComponent(section)}`;

}



loadServer();
