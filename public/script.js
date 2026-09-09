document.querySelectorAll(".switch").forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("on");

    });

});


document.querySelector("#loginButton").addEventListener("click", () => {

    alert("El inicio de sesión con Discord lo conectaremos en el siguiente paso.");

});
