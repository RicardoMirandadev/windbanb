Windbnb - Proyecto Final (Funval)

Este es mi proyecto final para la primera etapa de Frontend en Funval. Es una aplicación web responsiva basada en el reto "Windbnb" de DevChallenges, que simula la interfaz y funcionalidad de búsqueda de una plataforma como AirBnB.

*Link del proyecto en vivo=

¿Qué hace este proyecto?

El objetivo principal de esta aplicación es consumir una base de datos local (`stays.js`) y permitirle al usuario filtrar las estancias disponibles por ciudad y por cantidad de huéspedes. 

Me enfoqué en que la lógica funcionara bien y en que el código estuviera ordenado. Estas son las características principales que implementé:

*   **Diseño 100% Responsive:** Maquetado con TailwindCSS. La interfaz cambia lógicamente dependiendo de la pantalla. En móviles, el buscador y las tarjetas se apilan; en escritorio, el diseño pasa a una fila horizontal y un grid de 3 columnas para aprovechar el espacio.
*   **Filtros en tiempo real:** No hay que recargar la página. Al escribir la ciudad o al sumar/restar huéspedes en el menú, las tarjetas en pantalla se actualizan al instante usando la función `.filter()` de JavaScript.
*   **Arquitectura Modular:** Para no tener un archivo gigante y difícil de leer, dividí la lógica de JavaScript en módulos:
    *   `stays.js`: Se encarga exclusivamente de hacer el fetch a los datos.
    *   `filters.js`: Maneja la matemática y la lógica pura del colador de datos.
    *   `ui.js`: Se encarga de recibir los datos limpios y dibujar el HTML en el DOM.
    *   `main.js`: Es el director de orquesta que importa los módulos y maneja los eventos del usuario.

Mejoras Extra UX/UI

Aparte de los requisitos base del proyecto, decidí agregar un par de funcionalidades extra para que la página se sienta más como un producto real y mejore la experiencia del usuario:

1.Efecto de expansión en las tarjetas (Hover): 
   Para que el grid de PC se viera simétrico, forcé a que todas las imágenes tuvieran la misma altura y proporción (`object-cover`). Sin embargo, para no perder la foto original, agregué un efecto para que, al pasar el ratón, la tarjeta entera crezca suavemente hacia abajo revelando el tamaño real de la imagen, sin romper la cuadrícula.

2.Alerta visual de capacidad excedida: 
   Si un usuario empieza a sumar huéspedes y sobrepasa la capacidad máxima de todas las casas disponibles (dejando la pantalla en blanco), los contenedores de los inputs se pintan de rojo automáticamente para advertirle visualmente que se pasó del límite.

3.Sincronización de inputs y bloqueos de seguridad: 
   El buscador principal de la página y el del menú desplegable están conectados bidireccionalmente. Además, bloqueé el input de huéspedes de la pantalla principal (`readonly`) para obligar al usuario a usar los controles de `+` y `-`, evitando que ingresen números negativos o letras por error.

Tecnologías utilizadas

*   HTML5 (Estructura semántica)
*   TailwindCSS (Estilos y responsividad)
*   JavaScript Vanilla (Lógica y manipulación del DOM)
*   Vite (Entorno de desarrollo)

Cómo correr el proyecto en local

para clonar este repositorio y correrlo en tu máquina:

1.Clona el repositorio.
2.Abrír la terminal en la carpeta del proyecto.
3.Instala las dependencias con `pnpm install`.
4.Levanta el servidor con `pnpm run dev`.
