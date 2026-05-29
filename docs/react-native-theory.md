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

## 7. Gestión de Estado: Comparativa Técnica (useState vs Context API vs Zustand)

Para el desarrollo del "cerebro de datos" de **Page & Frame**, se ha evaluado el uso de tres herramientas fundamentales de gestión de estado en el ecosistema de React Native. A continuación se justifica la elección de **Zustand** frente a las alternativas tradicionales:

### A. Estado Local (`useState`)
*   **Mecanismo:** Almacena la información de forma aislada dentro de un único componente. Para compartir datos con otros componentes, es necesario pasar el estado y sus funciones a través de propiedades (*prop drilling*).
*   **Limitación en el proyecto:** Al tener tres pestañas independientes gestionadas por un enrutador de archivos (`/home`, `/add-content`, `/ideas`), es imposible usar `useState` para comunicar las notas entre pantallas de forma eficiente sin sobrecargar la raíz de la aplicación con un código denso y difícil de mantener.

### B. Proveedores Globales (`Context API`)
*   **Mecanismo:** Permite inyectar un estado global envolviendo la aplicación en un componente proveedor (`<Provider>`). Cualquier componente hijo puede suscribirse a ese contexto.
*   **Limitación en el proyecto:** Context API no está optimizado para actuar como un almacén de datos de alta frecuencia. Cada vez que una propiedad cambia (por ejemplo, al marcar un elemento de un checklist como completado), **todos** los componentes envueltos por el proveedor se ven obligados a renderizarse de nuevo (*re-render* innecesario), degradando drásticamente el rendimiento y la fluidez de las animaciones nativas en dispositivos móviles.

### C. Almacenes Atómicos (`Zustand`)
*   **Mecanismo:** Crea un almacén (*store*) centralizado y externo al árbol de componentes de React, utilizando un patrón atómico basado en funciones inmutables puros (`.map` y `.filter`).
*   **Justificación de su elección en Page & Frame:**
    1.  **Sin proveedores anidados:** No requiere envolver la aplicación en etiquetas `<Provider>` pesadas en el layout raíz, manteniendo el código limpio y modular.
    2.  **Rendimiento óptimo (Selectores estrictos):** Permite a cada pestaña suscribirse únicamente al fragmento de datos que necesita (ej: la pestaña `/ideas` solo escucha a `state.ideas`). Si el usuario añade una reseña de texto en la pestaña `/home`, las demás pantallas no sufren ningún *re-render* innecesario.
    3.  **Lógica inmutable y directa:** Permite despachar acciones directas (`addNote`, `toggleChecklistItem`) que actualizan el estado de forma inmediata y síncrona en memoria, garantizando una experiencia móvil fluida y una compatibilidad total con TypeScript.

## 8. Rendimiento en Listas y Reciclaje de Componentes (Shopify FlashList)

Para la visualización de las colecciones en las tres pestañas principales de **Page & Frame** (`/home`, `/add-content`, `/ideas`), se ha descartado el uso de listas tradicionales debido a problemas de optimización en volúmenes de datos densos, sustituyéndolas por `@shopify/flash-list`. A continuación se detalla la justificación técnica de este cambio y el funcionamiento del reciclaje de celdas:

### A. El problema del scroll rápido y las pantallas en blanco
*   **Mecanismo tradicional (`FlatList` / `ScrollView`):** Cuando un usuario hace scroll vertical a gran velocidad, el sistema se ve obligado a crear nuevos objetos e interfaces de forma continua en la memoria RAM, destruyendo al mismo tiempo las celdas que salen de la zona visible.
*   **Impacto en el rendimiento:** Este proceso constante de "creación y destrucción" satura el hilo principal de JavaScript (*Bridge / Hermes UI thread*), provocando caídas drásticas de fotogramas (lag visual) y la aparición de molestos parches o pantallas en blanco mientras el dispositivo móvil intenta renderizar la interfaz a marchas forzadas.

### B. La Solución: Reciclaje Agresivo de Celdas
*   **Mecanismo de FlashList:** En lugar de destruir los componentes visuales que desaparecen por la parte superior de la pantalla, la librería de Shopify los mantiene vivos en memoria. Cuando un nuevo elemento de la lista va a aparecer por la parte inferior, FlashList **"recicla" la estructura física de la tarjeta vieja** y se limita a rellenarla con los nuevos datos (*re-hydration*).
*   **Impacto en el rendimiento:** Al reutilizar los mismos elementos visuales una y otra vez (como las estructuras de `NoteCard`, `ChecklistCard` o `IdeaCard`), la carga de trabajo de la CPU se reduce prácticamente a cero durante el desplazamiento. Esto garantiza un scroll fluido a 60 FPS estables, eliminando por completo las pantallas en blanco sin importar el volumen de reseñas culturales almacenadas.

### C. Importancia del Atributo `estimatedItemSize`
*   **Propósito técnico:** La propiedad `estimatedItemSize` actúa como un plano arquitectónico previo para el compilador. Le indica a la lista, expresado en píxeles, el tamaño vertical aproximado que ocupará una tarjeta en la pantalla antes de que sea renderizada por primera vez.
*   **Justificación de su precisión:** Cuanto más exacto sea este valor con respecto al diseño real del componente (ej: `90px` para reseñas de texto extendidas, `65px` para barras de progreso compactas), más eficientes serán los cálculos matemáticos que realiza el motor de renderizado. Esto permite reservar el espacio de pantalla de forma síncrona en el hilo nativo de iOS o Android, optimizando el rendimiento y logrando una fluidez óptima en el dispositivo.

## 9. Persistencia de Datos en Almacenamiento Local (AsyncStorage)

Para garantizar la retención de los datos registrados en **Page & Frame** al cerrar o reiniciar la aplicación, se ha integrado el módulo `@react-native-async-storage/async-storage` acoplado directamente al estado global de Zustand mediante su middleware nativo de persistencia. A continuación se detallan las limitaciones técnicas evaluadas sobre esta arquitectura:

### A. Ausencia de Cifrado Nativo (Seguridad)
*   **Análisis:** AsyncStorage almacena la información en un formato de texto plano (clave-valor) sin ningún tipo de encriptación criptográfica en el sistema de archivos del dispositivo. 
*   **Impacto en Page & Frame:** Al ser una aplicación destinada a la catalogación cultural pública de libros, series y reseñas de películas, no maneja datos sensibles (como contraseñas, tokens bancarios o datos médicos). Por tanto, AsyncStorage es una solución idónea por su ligereza, pero se desaconseja su uso para almacenar credenciales críticas de usuario sin un módulo complementario de *Secure Store*.

### B. Límite de Tamaño de Almacenamiento (Capacidad)
*   **Análisis:** Por defecto, la base de datos de AsyncStorage tiene una restricción de tamaño máxima (aproximadamente 6 MB en sistemas Android).
*   **Impacto en Page & Frame:** Dado que guardamos datos puramente textuales y estructurales indexados (strings de títulos, críticas y booleanos de progreso), el consumo en disco es mínimo. La aplicación puede albergar miles de registros antes de aproximarse al límite físico, garantizando un ciclo de vida extenso antes de requerir una migración a bases de datos relacionales SQLite.

### C. Almacenamiento Aislado Local (Dispositivo)
*   **Análisis:** Los datos persisten única y exclusivamente en el almacenamiento físico local del terminal móvil donde se ejecuta la app.
*   **Impacto en Page & Frame:** No existe sincronización automática en la nube de forma nativa. Si el usuario desinstala la aplicación o cambia de teléfono, el catálogo cultural se perderá. Esta limitación es propia de la arquitectura sin servidor (*serverless local*), ideal para entornos académicos pero que marca la hoja de ruta para implementar un backend dedicado en futuras fases comerciales.

## 10. Proceso de Rehidratación y Control de Carga Síncrona

Al utilizar el middleware `persist` de Zustand combinado con `@react-native-async-storage/async-storage`, se activa un ciclo de vida crítico al iniciar la aplicación conocido como **rehidratación**:

### A. ¿Qué ocurre durante la rehidratación del Store?
1.  **Lectura en Disco (Asíncrona):** Nada más abrir **Page & Frame**, el hilo de ejecución de Zustand lanza una petición asíncrona al sistema de archivos local del dispositivo móvil para leer la clave `'noteflow-storage'`.
2.  **Conversión de Datos (De-serialización):** El texto plano recuperado de `AsyncStorage` se parsea mediante `JSON.parse` para recuperar sus tipos de datos estructurados nativos.
3.  **Hidratación en Memoria:** Zustand inyecta de golpe esos datos recuperados en las variables reactivas (`notes`, `checklists`, `ideas`), notificando a los componentes suscritos que ya pueden renderizar el catálogo cultural guardado.

### B. Control del Indicador de Carga mediante `useNotesStore.persist.hasHydrated`
Debido a que la lectura en disco toma unos milisegundos, intentar pintar las listas de alto rendimiento (`FlashList`) antes de finalizar la rehidratación puede provocar parpadeos visuales desagradables o lecturas de arrays vacíos erróneas. 

Para resolverlo siguiendo las buenas prácticas de React Native, se utiliza el método nativo de Zustand **`useNotesStore.persist.hasHydrated()`** (un hook reactivo que devuelve `false` mientras lee el disco y `true` cuando termina). Mientras el estado sea `false`, la aplicación interrumpe el flujo normal y muestra un indicador de carga nativo (`ActivityIndicator`) bloqueando la interfaz de forma elegante:

```tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNotesStore } from '../src/store/noteStore';
import { useTheme } from '../src/constants/theme';

export default function AppHydrationGuard({ children }: { children: React.ReactNode }) {
  const hasHydrated = useNotesStore.persist.hasHydrated();
  const { colors } = useTheme();

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background || '#0F0F10' }}>
        <ActivityIndicator size="large" color={colors.primary || '#F59E0B'} />
      </View>
    );
  }

  return <>{children}</>;
}

```

## 11. Validación de Formularios con Zod y Animaciones Nativas con Reanimated

Para la creación ágil de registros en el modal central (`app/new-note.tsx`), se ha integrado un motor de validación estricta combinado con animaciones fluidas en la interfaz:

### A. Validación Robusta en Tiempo de Ejecución (Zod)
*   **Justificación:** React Native no tiene un sistema nativo para validar que los inputs de texto cumplan con unos mínimos de seguridad. Al usar esquemas de Zod (`standardSchema`, `checklistSchema`, `ideaSchema`), la aplicación analiza los datos mediante `.safeParse()` antes de enviarlos al almacenamiento.
*   **Rendimiento:** Esto evita que entren strings vacíos o datos corruptos al Store de Zustand y a `AsyncStorage`, atajando los errores de renderizado en cascada que congelan las pantallas en blanco. El manejo de errores mapea los fallos directamente sobre el hilo gráfico mediante estados limpios.

### B. Animaciones de Alto Rendimiento (React Native Reanimated v3)
*   **Justificación:** Las tarjetas del tablón (`NoteCard`, `ChecklistCard`, `IdeaCard`) utilizan los contenedores de Reanimated (`Animated.View`) junto con efectos de transición físicos (`entering={FadeInDown}` y `exiting={FadeOutLeft}`).
*   **Rendimiento en Hilos:** A diferencia de la API básica de React Native, Reanimated ejecuta toda la lógica de interpolación matemáica, layouts y físicas directamente en el **UI/Main Thread** (hilo nativo) a través de *Worklets* de herencia en C++. Al no tener que enviar datos continuamente de ida y vuelta a través del puente de JavaScript (*Bridge*), las tarjetas aparecen y desaparecen con un frame-rate óptimo de 60 FPS estables, eliminando tirones visuales (*lag*) al interactuar o borrar registros mediante el toque prolongado.
