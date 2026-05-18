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
