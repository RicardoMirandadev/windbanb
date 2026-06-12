export function renderTarjetas(lista, contenedor) {
    contenedor.innerHTML = "";
    lista.forEach((estancia, index) => {
        const tarjetahtml = `
        <div class="bg-white rounded-lg max-w-xl mx-auto my-4 group cursor-pointer stay-card" data-index="${index}">
            <div class="text-sm text-gray-800 mb-3 overflow-hidden rounded-2xl h-64 group-hover:h-112.5 transition-all duration-500 ease-in-out">
                <img class="w-full h-full aspect-4/3 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" src="${estancia.photo}" alt="${estancia.title}">
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