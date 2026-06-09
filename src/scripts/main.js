const contenedor = document.querySelector("#stays-container")


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

mostrar.addEventListener("click", (e) => {
        e.preventDefault();
    menu.classList.remove("-top-40");
    menu.classList.add("top-0");
});

async function cargartarjetas() {
    const respuesta = await fetch('/src/data/stays.json')
    const estancias = await respuesta.json()
    contenedor.innerHTML="";
    estancias.forEach((estancia) => {
     const tarjetahtml = `
        <div class="bg-white rounded-lg max-w-xl mx-auto my-4 ">
            
            <div class="text-sm text-gray-800 mb-3">
                <!-- Reemplazamos src="/src/images/fin.jpg" por la variable de la foto -->
                <img class="rounded-4xl" src="${estancia.photo}" alt="${estancia.title}">
            </div>

            <div class="pt-2 text-sm to-gray-500">
                <div class="flex items-center justify-between">
                    
                    <!-- Reemplazamos "entire apartment . 2 beds" -->
                    <span class="font-semibold text-gray-400"> ${estancia.type} . ${estancia.beds !== null ? estancia.beds + ' beds' : ''}</span>
                    
                    <!-- Reemplazamos "4.4" por el rating -->
                    <i class="fa-solid fa-star star text-amber-500"><span class="font-light text-gray-400 score">${estancia.rating}</span></i>
                </div>
                
                <span class="flex justify-between items-baseline gap-1 font-semibold text-gray-700">
                    <!-- Reemplazamos el título fijo por la variable -->
                    <h3 class="mt-1 text-gray-900 font-bold text-base tracking-tight">${estancia.title}</h3>
                </span>
            </div>

        </div>
        `; 

        contenedor.innerHTML += tarjetahtml;
        
    });
}
    cargartarjetas();