import { loadStays } from "/src/scripts/stays.js";
import { renderTarjetas } from "./ui.js";
import { filtrarEstancias } from "./filters.js";


let originalsCaves =[];


const contenedor = document.querySelector("#stays-container");
const menu  =   document.querySelector("#menu");
const ocultar   =   document.querySelector("#ocultar");
const mostrar   =   document.querySelector("#mostrar");
const btnSearchPC = document.querySelector("#btn-search");
const btnSearchMobile = document.querySelector("#btn-search-mobile");
const inputLocation = document.querySelector("input[name='location']");
const txtAdultos = document.querySelector("#menu #txt-adultos");
const txtNiños  = document.querySelector("#menu #txt-niños");
const btnadultosAdd = document.querySelector("#btn-adultos-add");
const btnadultosSub = document.querySelector("#btn-adultos-sub");
const btnniñosAdd = document.querySelector("#btn-niños-add");
const btnniñosSub = document.querySelector("#btn-niños-sub");
const totalGuestsMenu = document.querySelector("#totalguests");
const formPrincipal = document.querySelector("form"); 
const textoUbicacionMenu = document.querySelector("#menu span.text-xs.text-gray-500.block");
const inputGuestsBg = document.querySelector("input[name='guests']");
const inputLocationMenu = document.querySelector("#menu-location-input");
const warningBg = document.querySelector("#warning-bg");
const warningMenu = document.querySelector("#warning-menu");


inputLocation.addEventListener("input", (e) => {
    inputLocationMenu.value = e.target.value;
     hacerFiltrado();
});
inputLocationMenu.addEventListener("input", (e) => {
    inputLocation.value = e.target.value;
     hacerFiltrado();
});



inputGuestsBg.addEventListener("input", (e) => {
    const cantidad = parseInt(e.target.value) || 0;
    txtAdultos.innerText = cantidad;
    actualizarTotalHuespedes();
     hacerFiltrado();
    
    if (cantidad > 0) {
        if (warningBg) warningBg.classList.remove("hidden");
        if (warningMenu) warningMenu.classList.remove("hidden");
    } else {
        if (warningBg) warningBg.classList.add("hidden");
        if (warningMenu) warningMenu.classList.add("hidden");
    }
});


function limpiarAdvertencia() {
    if (warningBg) warningBg.classList.add("hidden");
    if (warningMenu) warningMenu.classList.add("hidden");
    
    const total = parseInt(txtAdultos.innerText) + parseInt(txtNiños.innerText);
    inputGuestsBg.value = total > 0 ? total : "";
}



function actualizarTotalHuespedes() {
    const adultos = parseInt(txtAdultos.innerText);
    const ninos = parseInt(txtNiños.innerText);
    totalGuestsMenu.innerText = `${adultos + ninos} guests`;
}


btnadultosAdd.addEventListener("click", () => {
    let count = parseInt(txtAdultos.innerText);
    txtAdultos.innerText = count + 1;
    actualizarTotalHuespedes();
     limpiarAdvertencia();
      hacerFiltrado();
     
});


btnadultosSub.addEventListener("click", () => {
    let count = parseInt(txtAdultos.innerText);
    if (count > 0) { 
        txtAdultos.innerText = count - 1;
        actualizarTotalHuespedes();
        limpiarAdvertencia();
         hacerFiltrado();
    }
});


btnniñosAdd.addEventListener("click", () => {
    let count = parseInt(txtNiños.innerText);
    txtNiños.innerText = count + 1;
    actualizarTotalHuespedes();
    limpiarAdvertencia();
     hacerFiltrado();
});


btnniñosSub.addEventListener("click", () => {
    let count = parseInt(txtNiños.innerText);
    if (count > 0) {
        txtNiños.innerText = count - 1;
        actualizarTotalHuespedes();
        limpiarAdvertencia();
        hacerFiltrado();

    }
});


ocultar.addEventListener("click", () => {
    menu.classList.remove("top-0");
    menu.classList.add("-top-full");

});


mostrar.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.remove("-top-full");
    menu.classList.add("top-0");

});




function hacerFiltrado() {
    const ciudadBuscada = inputLocation.value.toLowerCase().trim();
    const adultos = parseInt(txtAdultos.innerText) || 0;
    const niños = parseInt(txtNiños.innerText) || 0;
    const totalHuespedes = adultos + niños;
    const resultFiltrados = filtrarEstancias(originalsCaves, ciudadBuscada, totalHuespedes);
  
    renderTarjetas(resultFiltrados, contenedor);
    verificarAlertaCapacidad();
}


inputLocation.addEventListener("input", () => {
    hacerFiltrado();

     if(textoUbicacionMenu) {
        if(inputLocation.value !== "") {
            textoUbicacionMenu.innerText = inputLocation.value;
            textoUbicacionMenu.classList.replace("text-gray-500", "text-black");
        } else {
            textoUbicacionMenu.innerText = "state, country";
            textoUbicacionMenu.classList.replace("text-black", "text-gray-500");
        }
    }
});




function clickBotonRojo(e) {
    if(e) e.preventDefault();
    hacerFiltrado();
    menu.classList.remove("top-0");
    menu.classList.add("-top-full");
}



if(btnSearchPC) btnSearchPC.addEventListener("click", clickBotonRojo);
if(btnSearchMobile) btnSearchMobile.addEventListener("click",clickBotonRojo);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        clickBotonRojo(e);
    }

});


async function desplegarPagina() {
    originalsCaves = await loadStays();
    renderTarjetas(originalsCaves, contenedor);  

}


desplegarPagina();

// FUNCIONALIDAD EXTRA: Alerta visual de capacidad excedida
function verificarAlertaCapacidad() {
    const adultos = parseInt(txtAdultos.innerText) || 0;
    const niños = parseInt(txtNiños.innerText) || 0; // Usamos tu variable con 'ñ'
    const totalHuespedes = adultos + niños;

    const cajaGuestsFondo = inputGuestsBg.parentElement; 
    const cajaGuestsMenu = totalGuestsMenu.parentElement; 

    // Revisamos si el contenedor de tarjetas se quedó vacío
    const noHayTarjetas = contenedor.children.length === 0;

    if (noHayTarjetas && totalHuespedes > 0) {
        // Encender alertas rojas
        cajaGuestsFondo.classList.add("bg-[#ED635B]", "rounded-lg");
        inputGuestsBg.classList.add("text-white", "placeholder-white");
        cajaGuestsMenu.classList.add("bg-[#ED635B]", "text-white", "rounded-xl", "p-2");
        totalGuestsMenu.classList.replace("text-gray-500", "text-white");
    } else {
        // Apagar alertas rojas
        cajaGuestsFondo.classList.remove("bg-[#ED635B]", "rounded-lg");
        inputGuestsBg.classList.remove("text-white", "placeholder-white");
        cajaGuestsMenu.classList.remove("bg-[#ED635B]", "text-white", "rounded-xl", "p-2");
        totalGuestsMenu.classList.replace("text-white", "text-gray-500");
    }
}