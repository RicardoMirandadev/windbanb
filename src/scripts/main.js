import { loadStays } from "/src/scripts/stays.js";


let originalsCaves =[];


const contenedor = document.querySelector("#stays-container");
const menu  =   document.querySelector("#menu");
const ocultar   =   document.querySelector("#ocultar");
const mostrar   =   document.querySelector("#mostrar");
const btnSearchPC = document.querySelector("#btn-search");
const btnSearchMobile = document.querySelector("#btn-search-mobile");
const inputLocation = document.querySelector("input[name='location']");
const txtAdultos = document.querySelector("#menu #txt-adults");
const txtNiños  = document.querySelector("#menu #txt-children");

ocultar.addEventListener("click", () => {
    menu.classList.remove("top-0");
    menu.classList.add("-top-full");

});

mostrar.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.remove("-top-full");
    menu.classList.add("top-0");

});

function renderTarjetas(lista) {
    contenedor.innerHTML= "";
    lista.forEach(estancia => {
        const tarjetahtml = `
        <div class="bg-white rounded-lg max-w-xl mx-auto my-4 group cursor-pointer">
            <div class="text-sm text-gray-800 mb-3 overflow-hidden rounded-2xl">
                <img class="w-full h-64 object-cover transition-all duration-500 group-hover:h-[450px] group-hover:scale-110" src="${estancia.photo}" alt="${estancia.title}">
            </div>
            <div class="pt-2 text-sm text-gray-500">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-gray-400"> 
                        ${estancia.superHost ? '<span class="border border-gray-800 text-gray-800 px-2 py-1 rounded-full text-xs font-bold mr-2">SUPERHOST</span>' : ''} 
                        ${estancia.type} . ${estancia.beds !== null ? estancia.beds + ' beds' : ''}
                    </span>
                    <i class="fa-solid fa-star star text-amber-500"><span class="font-light text-gray-400 score ml-1">${estancia.rating}</span></i>
                </div>                
                <span class="flex justify-between items-baseline gap-1 font-semibold text-gray-700 mt-2">
                    <h3 class="text-gray-900 font-bold text-base tracking-tight">${estancia.title}</h3>
                </span>
            </div>
        </div>
        `; 
        contenedor.innerHTML += tarjetahtml;
        
    });
}

function aplicarfiltro (e) {
    if(e) e.preventDefault();

    const ciudadBuscada = inputLocation.value.toLowerCase().trim();
    const adultos = parseInt(txtAdultos.innerText) || 0;
    const niños = parseInt(txtNiños.innerText) || 0;
    const totalHuespedes = adultos + niños;
    const resultFiltrados = originalsCaves.filter((estancia) => {
        const pasaCiudad = estancia.city.toLowerCase().includes(ciudadBuscada) || ciudadBuscada ==="";
        const pasaHuespedes = estancia.maxGuests >= totalHuespedes;
        return pasaCiudad && pasaHuespedes;

    });
    renderTarjetas(resultFiltrados);
    menu.classList.remove("top-0");
    menu.classList.add("-top-full");
}

if(btnSearchPC) btnSearchPC.addEventListener("click", aplicarfiltro);
if(btnSearchMobile) btnSearchMobile.addEventListener("click",aplicarfiltro);

async function arrancarPagina() {
    originalsCaves = await loadStays();
    renderTarjetas(originalsCaves);  

}

arrancarPagina();