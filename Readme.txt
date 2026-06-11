Este proyecto consiste en el desarrollo de una aplicación web de búsqueda de estancias, inspirada en el desafío Windbnb de DevChallenges.
 El objetivo es proporcionar una interfaz donde los usuarios puedan filtrar alojamientos de forma dinámica según su ubicación y la cantidad
 de huéspedes.


Características principales

Interfaz responsive diseñada con Tailwind CSS, adaptándose a cualquier dispositivo.

Filtrado en tiempo real: los resultados se actualizan automáticamente al ajustar los criterios de búsqueda (ubicación y cantidad de huéspedes).

Lógica modular: el código está estructurado utilizando módulos de JavaScript (ES6+) para garantizar una arquitectura limpia y mantenible.

Consumo de datos local: implementación de un archivo stays.js para la gestión y carga de la información de las estancias.


Tecnologías utilizadas

HTML5: Estructura semántica de la interfaz.
Tailwind CSS: Estilos y diseño responsivo.
JavaScript (Vanilla): Lógica de negocio, manipulación del DOM y filtrado.
Vite: Entorno de desarrollo para empaquetado y optimización.
Font Awesome: Iconografía.


Arquitectura del proyecto

Para facilitar el desarrollo y escalar la aplicación, he organizado la lógica en módulos independientes:

main.js: Punto de entrada que orquesta los eventos del DOM y la interacción del usuario.
ui.js: Responsable de la renderización dinámica de las tarjetas de estancias y modales.
filters.js: Contiene las funciones puras encargadas de procesar y filtrar los datos según los criterios seleccionados.
stays.js: Módulo dedicado a la gestión y carga asíncrona de los datos (stays.json).


Funcionalidades adicionales

Como mejora propia, he añadido una funcionalidad de alerta visual: si el usuario realiza una búsqueda donde no existen estancias que
cumplan con la capacidad de huéspedes requerida, el buscador resalta visualmente los campos de entrada, guiando al usuario para ajustar
sus filtros y obtener resultados válidos. También he implementado un sistema de modales para visualizar los detalles de cada estancia 
al hacer clic sobre ella.

Instalación y ejecución
Para trabajar con este proyecto localmente, sigue estos pasos:
Clona el repositorio:
git clone []
Instala las dependencias necesarias:
npm install
Inicia el servidor de desarrollo:
npm run dev
Abre la dirección proporcionada (habitualmente http://localhost:5173) en tu navegador.