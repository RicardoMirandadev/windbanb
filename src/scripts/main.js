import { loadStays } from "/src/scripts/stays.js";
import { renderTarjetas } from "./ui.js";
import { filtrarEstancias } from "./filters.js";

let originalsCaves = [];
let estanciasDesplegadas = []; 

const contenedor = document.querySelector("#stays-container");
const menu = document.querySelector("#menu");
const ocultar = document.querySelector("#ocultar");
const mostrar = document.querySelector("#mostrar");
const btnSearchPC = document.querySelector("#btn-search");
const inputLocationMenu = document.querySelector("#menu-location-input");
const btnSearchMobile = document.querySelector("#btn-search-mobile");
const sugerencias = document.querySelector("#location-suggestions");


const activadorBarraSerch = document.querySelector("#search-bar-trigger");
const headerLocation = document.querySelector("#header-location");
const headerGuests = document.querySelector("#header-guests");

const totalGuestsMenu = document.querySelector("#totalguests");
const btnadultosAdd = document.querySelector("#btn-adultos-add");
const btnadultosSub = document.querySelector("#btn-adultos-sub");
const btnniñosAdd = document.querySelector("#btn-niños-add");
const btnniñosSub = document.querySelector("#btn-niños-sub");
const txtAdultos = document.querySelector("#menu #txt-adultos");
const txtNiños  = document.querySelector("#menu #txt-niños");
const contadorDeElementos = document.querySelector("#stays-count");

const warningBg = document.querySelector("#warning-bg");
const warningMenu = document.querySelector("#warning-menu");

const modalDeDetalles = document.querySelector("#details-modal");
const botonDeConsola = document.querySelector("#close-modal");
const imagendeLaTarjeta = document.querySelector("#modal-img");
const SuperHost = document.querySelector("#modal-superhost");
const camas = document.querySelector("#modal-type-beds");
const nivelRank = document.querySelector("#modal-rating");
const tituloDeTarjeta = document.querySelector("#modal-title");
const locationTarjeta = document.querySelector("#modal-location");
const maximoDeGuests = document.querySelector("#modal-max-guests");


if (activadorBarraSerch) {
    activadorBarraSerch.addEventListener("click", () => {
        menu.classList.remove("-top-full");
        menu.classList.add("top-0");
    });
}

function obtenerUbicacionesUnicas() {
    const ubicaciones = originalsCaves.map(estancia => `${estancia.city}, ${estancia.country}`);
    return [...new Set(ubicaciones)];
}

function renderizarSugerencias() {
    if (!sugerencias) return;
    const textoEscrito = inputLocationMenu.value.toLowerCase().trim();
    const ubicacionesUnicas = obtenerUbicacionesUnicas();
    const filtradas = ubicacionesUnicas.filter(loc => loc.toLowerCase().includes(textoEscrito));

    if (filtradas.length === 0) {
        sugerencias.innerHTML = `
            <div class="p-3 text-xs text-gray-400 select-none">No se encontraron ubicaciones</div>
        `;
        return;
    }

    sugerencias.innerHTML = filtradas.map(loc => `
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer text-sm text-gray-700 font-medium transition-all opcion-sugerencia" data-value="${loc}">
            <i class="fa-solid fa-location-dot text-gray-500"></i>
            <span>${loc}</span>
        </div>
    `).join("");

    const opciones = sugerencias.querySelectorAll(".opcion-sugerencia");
    opciones.forEach(opcion => {
        opcion.addEventListener("click", () => {
            const valorSeleccionado = opcion.getAttribute("data-value");
            inputLocationMenu.value = valorSeleccionado;
            headerLocation.innerText = valorSeleccionado;
            headerLocation.classList.remove("text-gray-400");
            headerLocation.classList.add("text-gray-800");
            hacerFiltrado();
        });
    });
}

inputLocationMenu.addEventListener("focus", () => {
    renderizarSugerencias();
});

inputLocationMenu.addEventListener("input", (e) => {
    const val = e.target.value;
    if (val.trim() !== "") {
        headerLocation.innerText = val;
        headerLocation.classList.remove("text-gray-400");
        headerLocation.classList.add("text-gray-800");
    } else {
        headerLocation.innerText = "Add location";
        headerLocation.classList.remove("text-gray-800");
        headerLocation.classList.add("text-gray-400");
    }
    renderizarSugerencias();
    hacerFiltrado();
});

function limpiarAdvertencia() {
    if (warningBg) warningBg.classList.add("hidden");
    if (warningMenu) warningMenu.classList.add("hidden");
}

function actualizarTotalHuespedes() {
    const adultos = parseInt(txtAdultos.innerText);
    const ninos = parseInt(txtNiños.innerText);
    const total = adultos + ninos;
    
    totalGuestsMenu.innerText = `${total} guests`;
    

    if (total > 0) {
        headerGuests.innerText = `${total} guest${total > 1 ? 's' : ''}`;
        headerGuests.classList.remove("text-gray-400");
        headerGuests.classList.add("text-gray-800");
    } else {
        headerGuests.innerText = "Add guests";
        headerGuests.classList.remove("text-gray-800");
        headerGuests.classList.add("text-gray-400");
    }
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

ocultar.addEventListener("click", (e) => {
    e.stopPropagation(); 
    menu.classList.remove("top-0");
    menu.classList.add("-top-full");
});

mostrar.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.remove("-top-full");
    menu.classList.add("top-0");
});

function hacerFiltrado() {
   const rawValue = inputLocationMenu.value.toLowerCase().trim();
   const ciudadBuscada = rawValue.includes(",") ? rawValue.split(",")[0].trim() : rawValue;
    const adultos = parseInt(txtAdultos.innerText) || 0;
    const niños = parseInt(txtNiños.innerText) || 0;
    const totalHuespedes = adultos + niños;
    
    estanciasDesplegadas = filtrarEstancias(originalsCaves, ciudadBuscada, totalHuespedes);
  
    renderTarjetas(estanciasDesplegadas, contenedor);
    
    if (contadorDeElementos) {
        contadorDeElementos.innerText = `${estanciasDesplegadas.length} stays`;
    }
    
    verificarAlertaCapacidad();
}

function clickBotonRojo(e) {
    if(e) e.preventDefault();
    hacerFiltrado();
    menu.classList.remove("top-0");
    menu.classList.add("-top-full");
}

if(btnSearchPC) btnSearchPC.addEventListener("click", clickBotonRojo);
if(btnSearchMobile) btnSearchMobile.addEventListener("click", clickBotonRojo);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        clickBotonRojo(e);
    }
});


function verificarAlertaCapacidad() {
    const adultos = parseInt(txtAdultos.innerText) || 0;
    const niños = parseInt(txtNiños.innerText) || 0; 
    const totalHuespedes = adultos + niños;

    const cajaGuestsFondo = headerGuests.parentElement; 
    const cajaGuestsMenu = totalGuestsMenu.parentElement; 

    const noHayTarjetas = estanciasDesplegadas.length === 0;

    if (noHayTarjetas && totalHuespedes > 0) {
        cajaGuestsFondo.classList.add("bg-[#ED635B]", "rounded-lg");
        headerGuests.classList.add("text-white");
        headerGuests.classList.remove("text-gray-400", "text-gray-800");
        
        cajaGuestsMenu.classList.add("bg-[#ED635B]", "text-white", "rounded-xl", "p-2");
        totalGuestsMenu.classList.replace("text-gray-500", "text-white");
    } else {
        cajaGuestsFondo.classList.remove("bg-[#ED635B]", "rounded-lg");
        headerGuests.classList.remove("text-white");
        
        if (totalHuespedes > 0) {
            headerGuests.classList.add("text-gray-800");
            headerGuests.classList.remove("text-gray-400");
        } else {
            headerGuests.classList.add("text-gray-400");
            headerGuests.classList.remove("text-gray-800");
        }
        
        cajaGuestsMenu.classList.remove("bg-[#ED635B]", "text-white", "rounded-xl", "p-2");
        totalGuestsMenu.classList.replace("text-white", "text-gray-500");
    }
}


contenedor.addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".stay-card");
    if (!tarjeta) return;

    const index = tarjeta.getAttribute("data-index");
    const estancia = estanciasDesplegadas[index];
    if (!estancia) return;

 
    imagendeLaTarjeta.src = estancia.photo;
    imagendeLaTarjeta.alt = estancia.title;

    if (estancia.superHost) {
        SuperHost.classList.remove("hidden");
    } else {
        SuperHost.classList.add("hidden");
    }

    camas.innerText = `${estancia.type} . ${estancia.beds !== null ? estancia.beds + ' beds' : ''}`;
    nivelRank.innerText = estancia.rating;
    tituloDeTarjeta.innerText = estancia.title;
    locationTarjeta.innerText = `${estancia.city}, ${estancia.country}`;
    maximoDeGuests.innerText = estancia.maxGuests;

   
    modalDeDetalles.classList.remove("hidden");
    setTimeout(() => {
        modalDeDetalles.firstElementChild.classList.remove("scale-95");
        modalDeDetalles.firstElementChild.classList.add("scale-100");
    }, 50);
});


botonDeConsola.addEventListener("click", () => {
    modalDeDetalles.firstElementChild.classList.remove("scale-100");
    modalDeDetalles.firstElementChild.classList.add("scale-95");
    setTimeout(() => {
        modalDeDetalles.classList.add("hidden");
    }, 150);
});


modalDeDetalles.addEventListener("click", (e) => {
    if (e.target === modalDeDetalles) {
        botonDeConsola.click();
    }
});

async function desplegarPagina() {
    originalsCaves = await loadStays();
    estanciasDesplegadas = [...originalsCaves];
    renderTarjetas(estanciasDesplegadas, contenedor);  
    
    renderizarSugerencias();

    if (contadorDeElementos) {
        contadorDeElementos.innerText = `${estanciasDesplegadas.length} stays`;
    }
}


desplegarPagina();