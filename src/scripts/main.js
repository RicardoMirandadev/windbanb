import { loadStays } from "/src/scripts/stays.js";
import { renderTarjetas } from "./ui.js";
import { filtrarEstancias } from "./filters.js";

let originalsCaves = [];
let displayedStays = []; // Almacena las estancias actualmente visibles para el modal

const contenedor = document.querySelector("#stays-container");
const menu = document.querySelector("#menu");
const ocultar = document.querySelector("#ocultar");
const mostrar = document.querySelector("#mostrar");
const btnSearchPC = document.querySelector("#btn-search");
const inputLocationMenu = document.querySelector("#menu-location-input");
const btnSearchMobile = document.querySelector("#btn-search-mobile");
const suggestionsContainer = document.querySelector("#location-suggestions");


const searchBarTrigger = document.querySelector("#search-bar-trigger");
const headerLocation = document.querySelector("#header-location");
const headerGuests = document.querySelector("#header-guests");

const totalGuestsMenu = document.querySelector("#totalguests");
const btnadultosAdd = document.querySelector("#btn-adultos-add");
const btnadultosSub = document.querySelector("#btn-adultos-sub");
const btnniñosAdd = document.querySelector("#btn-niños-add");
const btnniñosSub = document.querySelector("#btn-niños-sub");
const txtAdultos = document.querySelector("#menu #txt-adultos");
const txtNiños  = document.querySelector("#menu #txt-niños");
const staysCountElement = document.querySelector("#stays-count");

const warningBg = document.querySelector("#warning-bg");
const warningMenu = document.querySelector("#warning-menu");

// Selectores del modal de detalles
const detailsModal = document.querySelector("#details-modal");
const closeModalBtn = document.querySelector("#close-modal");
const modalImg = document.querySelector("#modal-img");
const modalSuperhost = document.querySelector("#modal-superhost");
const modalTypeBeds = document.querySelector("#modal-type-beds");
const modalRating = document.querySelector("#modal-rating");
const modalTitle = document.querySelector("#modal-title");
const modalLocation = document.querySelector("#modal-location");
const modalMaxGuests = document.querySelector("#modal-max-guests");

// Al hacer clic en la barra de búsqueda superior, se abre el modal desplegable
if (searchBarTrigger) {
    searchBarTrigger.addEventListener("click", () => {
        menu.classList.remove("-top-full");
        menu.classList.add("top-0");
    });
}

function obtenerUbicacionesUnicas() {
    const ubicaciones = originalsCaves.map(estancia => `${estancia.city}, ${estancia.country}`);
    return [...new Set(ubicaciones)];
}

function renderizarSugerencias() {
    if (!suggestionsContainer) return;
    const textoEscrito = inputLocationMenu.value.toLowerCase().trim();
    const ubicacionesUnicas = obtenerUbicacionesUnicas();
    const filtradas = ubicacionesUnicas.filter(loc => loc.toLowerCase().includes(textoEscrito));

    if (filtradas.length === 0) {
        suggestionsContainer.innerHTML = `
            <div class="p-3 text-xs text-gray-400 select-none">No se encontraron ubicaciones</div>
        `;
        return;
    }

    suggestionsContainer.innerHTML = filtradas.map(loc => `
        <div class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer text-sm text-gray-700 font-medium transition-all opcion-sugerencia" data-value="${loc}">
            <i class="fa-solid fa-location-dot text-gray-500"></i>
            <span>${loc}</span>
        </div>
    `).join("");

    const opciones = suggestionsContainer.querySelectorAll(".opcion-sugerencia");
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
    
    // Se sincroniza con el botón superior
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

// Eventos de los contadores de huéspedes
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
    e.stopPropagation(); // Evita reabrir el menú por propagación
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
    
    displayedStays = filtrarEstancias(originalsCaves, ciudadBuscada, totalHuespedes);
  
    renderTarjetas(displayedStays, contenedor);
    
    if (staysCountElement) {
        staysCountElement.innerText = `${displayedStays.length} stays`;
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

// Alerta visual de capacidad adaptada para elementos estáticos
function verificarAlertaCapacidad() {
    const adultos = parseInt(txtAdultos.innerText) || 0;
    const niños = parseInt(txtNiños.innerText) || 0; 
    const totalHuespedes = adultos + niños;

    const cajaGuestsFondo = headerGuests.parentElement; 
    const cajaGuestsMenu = totalGuestsMenu.parentElement; 

    const noHayTarjetas = displayedStays.length === 0;

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

// Logica del modal de detalles (al hacer clic en las tarjetas de estancia)
contenedor.addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".stay-card");
    if (!tarjeta) return;

    const index = tarjeta.getAttribute("data-index");
    const estancia = displayedStays[index];
    if (!estancia) return;

    // Poblar información en el modal
    modalImg.src = estancia.photo;
    modalImg.alt = estancia.title;

    if (estancia.superHost) {
        modalSuperhost.classList.remove("hidden");
    } else {
        modalSuperhost.classList.add("hidden");
    }

    modalTypeBeds.innerText = `${estancia.type} . ${estancia.beds !== null ? estancia.beds + ' beds' : ''}`;
    modalRating.innerText = estancia.rating;
    modalTitle.innerText = estancia.title;
    modalLocation.innerText = `${estancia.city}, ${estancia.country}`;
    modalMaxGuests.innerText = estancia.maxGuests;

    // Mostrar modal con transición suave
    detailsModal.classList.remove("hidden");
    setTimeout(() => {
        detailsModal.firstElementChild.classList.remove("scale-95");
        detailsModal.firstElementChild.classList.add("scale-100");
    }, 50);
});

// Cerrar modal
closeModalBtn.addEventListener("click", () => {
    detailsModal.firstElementChild.classList.remove("scale-100");
    detailsModal.firstElementChild.classList.add("scale-95");
    setTimeout(() => {
        detailsModal.classList.add("hidden");
    }, 150);
});

// Cerrar al hacer clic fuera del contenido del modal
detailsModal.addEventListener("click", (e) => {
    if (e.target === detailsModal) {
        closeModalBtn.click();
    }
});

async function desplegarPagina() {
    originalsCaves = await loadStays();
    displayedStays = [...originalsCaves];
    renderTarjetas(displayedStays, contenedor);  
    
    renderizarSugerencias();

    if (staysCountElement) {
        staysCountElement.innerText = `${displayedStays.length} stays`;
    }
}


desplegarPagina();