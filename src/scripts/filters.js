export function filtrarEstancias(listaOriginal, ciudadBuscada, totalHuespedes) {
    return listaOriginal.filter((estancia) => {
        const pasaCiudad = estancia.city.toLowerCase().includes(ciudadBuscada) || ciudadBuscada === "";
        const pasaHuespedes = estancia.maxGuests >= totalHuespedes;
        return pasaCiudad && pasaHuespedes;
    });
}