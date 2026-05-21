# Fundamentos Teóricos de React Native

Este documento recopila los conceptos esenciales sobre el funcionamiento interno de React Native y el flujo de trabajo con Expo utilizado en **Page & Frame**.

## 1. React Native vs. Apps Nativas Tradicionales

A diferencia de las aplicaciones híbridas antiguas que renderizaban HTML dentro de una vista web (WebView) lenta, React Native funciona de una manera completamente distinta:

*   **Vistas Nativas Reales:** Tu código en JavaScript/TypeScript define la interfaz, pero React Native se comunica directamente con las APIs del sistema operativo (iOS y Android) para crear botones, textos y listas nativas reales. El rendimiento y el aspecto visual son idénticos a los de una app escrita en Swift o Kotlin.
*   **Arquitectura de Hilos:** La app divide el trabajo en dos motores principales:
    1.  *JavaScript Thread:* El "cerebro" donde se ejecuta tu lógica, las funciones de tus listas y el estado global (Zustand).
    2.  *Main/UI Thread:* El "músculo" del sistema operativo encargado de dibujar los elementos visuales en pantalla y procesar los gestos del usuario de forma ultra rápida.

## 2. ¿Qué es el Metro Bundler?

**Metro** es el empaquetador de JavaScript diseñado específicamente para React Native (el equivalente a Webpack o Vite en la web). 

Su función principal es tomar todo tu árbol de archivos de código fuente, componentes y dependencias de la carpeta `node_modules/`, unificarlos y transformarlos en un único archivo JavaScript (un *bundle*). Además, provee el sistema de **Fast Refresh**, que recarga automáticamente la aplicación en tu móvil en fracciones de segundo cada vez que guardas un cambio en VS Code sin perder el estado actual de la pantalla.

## 3. ¿Por qué Expo Go no es suficiente en proyectos reales?

**Expo Go** es un entorno fantástico para empezar: descargas una app del store, escaneas un código QR y ves tu código funcionar al instante. Sin embargo, las aplicaciones profesionales reales se construyen utilizando **Development Builds** (EAS Build) por los siguientes motivos:

*   **Código Nativo a Medida:** Expo Go contiene un conjunto de librerías nativas pre-seleccionadas. Si tu proyecto necesita una librería de terceros que requiera modificar el código nativo de iOS o Android (como sistemas avanzados de biometría, pasarelas de pago específicas, o widgets para la pantalla de inicio), Expo Go no la podrá ejecutar.
*   **Tamaño y Control:** Expo Go incluye cientos de módulos que probablemente no uses (como mapas o sensores), haciendo que el entorno no sea idéntico al binario final. Un *Development Build* genera una versión personalizada con el código nativo exacto que tu aplicación necesita, garantizando que lo que pruebas en desarrollo sea un clon perfecto de lo que se subirá a las tiendas.

## 4. Sistemas de Diseño: Justificación de Gluestack UI

En la fase de arquitectura de **Page & Frame**, se evaluaron las dos soluciones de interfaz de usuario más utilizadas en el ecosistema de Expo: **React Native Paper** y **Gluestack UI**. Se ha determinado utilizar el enfoque adaptativo de Gluestack UI por los siguientes motivos técnicos:

*   **Evitar Restricciones de Terceros:** React Native Paper obliga a la aplicación a adoptar de manera rígida las directrices estéticas de Material Design (Google). Esto colisiona con el objetivo de Page & Frame, el cual requiere una identidad de autor personalizada y diferenciada para sus secciones de entretenimiento.
*   **Diseño Dinámico por Categorías:** Page & Frame se fundamenta en un sistema de color semántico (Rojo para Películas, Verde para Series, Amarillo para Libros). La naturaleza atómica y basada en propiedades utilitarias de Gluestack permite inyectar estilos y variantes dinámicas a las tarjetas y contenedores de datos de manera limpia, sin necesidad de sobrescribir componentes pesados.
*   **Eficiencia en el Hilo de UI:** Gluestack está optimizado para procesar los tokens de estilo reduciendo la sobrecarga de cálculos en el *JavaScript Thread*, delegando el peso del renderizado al *UI Thread*, lo cual se traduce en un desplazamiento de listas más fluido y libre de latencia.

## 5. Estrategia de Navegación en Page & Frame

Para el desarrollo de la aplicación se ha implementado una arquitectura de navegación híbrida utilizando **Expo Router**. A continuación se detalla la justificación técnica de por qué combinamos pestañas (Tabs), pilas (Stack) y modales:

### A. Navegación por Pestañas (Tabs Layout)
*   **Qué es:** Una barra de acceso directo fija en la parte inferior de la pantalla.
*   **Justificación en el proyecto:** Sirve como la navegación principal e identitaria de **Page & Frame**. Da acceso inmediato a las tres experiencias core del usuario (`/home` para las listas generales, `/add-content` para interactuar con la mediateca y `/ideas` para las anotaciones rápidas). Al ser vistas independientes que mantienen su propio historial, permiten al usuario saltar de una a otra de forma intuitiva sin perder el contexto.

### B. Navegación por Pila (Stack Layout)
*   **Qué es:** Un flujo lineal donde las pantallas se apilan una encima de otra (como un mazo de cartas). Para volver atrás, la pantalla superior se "desapila".
*   **Justificación en el proyecto:** Es nuestro layout raíz. Lo utilizamos para la pantalla de detalle dinámico (`app/note/[id].tsx`). Cuando el usuario hace clic en una película o un libro concreto desde su pestaña de inicio, la aplicación introduce esa vista en la pila nativa empujando la interfaz hacia la izquierda. Esto es crucial para mantener la experiencia móvil nativa estándar (con el botón de retroceso integrado de iOS/Android).

### C. Navegación por Modales (Modal Presentation)
*   **Qué es:** Una pantalla que se desliza desde la parte inferior cubriendo temporalmente toda la interfaz para requerir la atención inmediata del usuario.
*   **Justificación en el proyecto:** Implementado en la ruta `app/new-note.tsx`. Lo destinamos para procesos de creación rápidos e interrupciones lógicas (como registrar contenido de emergencia desde cualquier sección). El uso de un modal rompe visualmente con la navegación lineal del Stack, indicando al usuario que está realizando una acción transitoria; una vez completada o cancelada, el modal se desliza hacia abajo devolviendo el control exacto a la pantalla subyacente sin alterar los historiales de las pestañas principales.

## 6. Modelado de Datos y Tipado Estricto (TypeScript)

Para dar cumplimiento a los requisitos de tipado estricto y herencia del proyecto, se han definido las interfaces de datos dentro de `src/types/index.ts`. A continuación se detalla cómo las estructuras técnicas requeridas (`Note`, `ChecklistNote` e `IdeaNote`) se integran con el propósito de las pestañas personalizadas de **Page & Frame**:

### A. Estructura de Reseñas Culturales (`Note` ➔ `/home`)
*   **Campos técnicos:** Hereda de `BaseNote` (`id`, `title`, `createdAt`, `updatedAt`) y añade `content: string`.
*   **Justificación de uso:** Mapeado directamente con la pestaña principal de inicio (`/home`). El campo `content` se utiliza para almacenar de forma extensa las **reseñas, críticas y reflexiones literarias o cinematográficas** escritas por el usuario sobre sus libros, películas y series finalizadas.

### B. Gestión de Progreso y Listas de Seguimiento (`ChecklistNote` ➔ `/add-content`)
*   **Campos técnicos:** Hereda de `BaseNote` y añade un array de objetos estrictos `items: ChecklistItem[]` (con `id`, `text` e `isCompleted`).
*   **Justificación de uso:** Mapeado con la pestaña interactiva `/add-content`. Se utiliza como un **cuaderno de bitácora o watchlist activa**. Permite al usuario desglosar una obra en tareas completables (por ejemplo, registrar los capítulos leídos de una novela o marcar los episodios vistos de una temporada de una serie) para llevar un control riguroso de su consumo cultural.

### C. Captura Flotante de Recomendaciones (`IdeaNote` ➔ `/ideas`)
*   **Campos técnicos:** Hereda de `BaseNote` y añade arrays de etiquetas (`tags: string[]`) y un identificador visual (`color: string`).
*   **Justificación de uso:** Mapeado con la pestaña `/ideas`. Actúa como un espacio de **anotaciones rápidas y espontáneas**. Está diseñado para capturar recomendaciones efímeras recibidas en el día a día antes de que se conviertan en un post oficial de la biblioteca, permitiendo clasificarlas mediante etiquetas temáticas (ej: `#Pendiente`, `#JoyasOcultas`) y organizarlas visualmente por colores.

### D. Discriminación en Tiempo de Ejecución (`Type Guards`)
Debido a que la aplicación utiliza el tipo de unión `AnyNote = Note | ChecklistNote | IdeaNote` para centralizar la gestión de datos, se han implementado funciones de control de tipo (*Type Guards*) estrictas utilizando predicados de tipo nativos (`note is ChecklistNote`). 

Mediante el operador de evaluación `'items' in note`, la aplicación discrimina de forma síncrona en tiempo de ejecución con qué estructura está interactuando. Esto permite que componentes genéricos rendericen de forma segura interfaces totalmente diferentes (campos de texto, listados de verificación o cuadrículas de etiquetas) garantizando la total seguridad del tipado y evitando excepciones de puntero nulo en el dispositivo móvil.
