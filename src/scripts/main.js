async function loadStays() {
    const response = await fetch('/data/stays.json');
    const stays = await response.json();
    return stays;
}

const menu = document.querySelector("#menu");
const ocultar = document.querySelector("#ocultar");
const mostrar = document.querySelector("#mostrar");

ocultar.addEventListener("click", () => {
    menu.classList.remove("top-0");
    menu.classList.add("-top-40"); 
});

mostrar.addEventListener("click", () => {
    menu.classList.remove("-top-40");
    menu.classList.add("top-0");
});

