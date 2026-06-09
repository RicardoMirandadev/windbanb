async function loadStays() {
    const response = await fetch('/data/stays.json');
    const stays = await response.json();
    return stays;
}

// 1. Seleccionamos los elementos del HTML por IDs
const menu = document.querySelector("#menu");
const ocultar = document.querySelector("#ocultar");
const mostrar = document.querySelector("#mostrar");

// 2. Evento para OCULTAR la barra rojadel menu  (la manda hacia arriba, fuera de la pantalla)
ocultar.addEventListener("click", () => {
    menu.classList.remove("top-0");
    menu.classList.add("-top-40"); 
});

// 2.5  (la regresa a su posición original visible)
mostrar.addEventListener("click", () => {
    menu.classList.remove("-top-40");
    menu.classList.add("top-0");
});

// 3.