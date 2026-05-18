# Page & Frame - My Media Universe

Una aplicación móvil moderna construida con **React Native** y **Expo** para gestionar y organizar tu universo personal de libros, películas y series.

## 📂 Documentación
Consulta los detalles del proyecto en los siguientes documentos:
- [Definición de la Idea](docs/idea.md): Concepto, usuarios y funcionalidades.
- [Gestión del Proyecto](docs/project-management.md): Metodología y enlace al tablero de tareas.
- [Configuración de IA](docs/ai-setup.md): Reglas y contexto para herramientas de IA.
- [Teoría de React Native](docs/react-native-theory.md): Conceptos clave, Metro Bundler y entornos de desarrollo.

## 📋 Tablero de Trabajo
Puedes seguir el progreso en tiempo real aquí: [Enlace a mi Trello](https://trello.com/invite/b/6a01af6815b98b29c282adfa/ATTIaccbbc0bf941684d94e39fc1cae8468724621184/noteflow-project)

## 🚀 Estado del Proyecto
- [x] **Fase 1: Definición de la Idea** (Completado)
- [ ] **Fase 2: Arquitectura y Sistema de Diseño** (En progreso)
- [ ] **Fase 3: Navegación y Estado Global** (Pendiente)
- [ ] **Fase 4: Listas de Alto Rendimiento y Persistencia** (Pendiente)

## 📖 Concepto
Page & Frame resuelve la fragmentación de las recomendaciones culturales. Permite a los usuarios organizar su consumo mediático en categorías codificadas por colores:
- 📕 **Libros (Amarillo):** Título, autor, páginas y puntuación.
- 🎬 **Películas (Rojo):** Título, director, duración y reseñas.
- 📺 **Series (Verde):** Título, director, capítulos y progreso.

## 🛠️ Tecnologías utilizadas
- **Framework:** Expo (React Native)
- **Lenguaje:** TypeScript
- **Gestión de Estado:** Zustand
- **Navegación:** Expo Router
- **Rendimiento:** Shopify FlashList
- **Persistencia:** MMKV / AsyncStorage

## ⚙️ Fundamentos Técnicos de React Native

En el desarrollo de **Page & Frame**, tenemos en cuenta la arquitectura interna de React Native para asegurar el máximo rendimiento.

### Hilos de ejecución
1. **JavaScript Thread:** Donde reside nuestra lógica de negocio y estado (Zustand).
2. **Main/UI Thread:** Donde el sistema operativo renderiza los componentes nativos.

### Optimización
Para evitar bloqueos en la interfaz (UI), utilizaremos **FlashList**, que optimiza la comunicación entre hilos mediante el reciclaje de vistas, permitiendo un desplazamiento fluido incluso con grandes volúmenes de datos.

## 🧰 Entorno de Desarrollo: Expo Go vs. Dev Builds

Para la construcción de **Page & Frame**, es fundamental entender la diferencia entre los dos entornos de ejecución de Expo:

- **Expo Go:** Es una aplicación pre-compilada que permite prototipar de forma inmediata escaneando un código QR. Es nuestra herramienta principal para el desarrollo ágil de la interfaz y la lógica.
- **Development Builds:** Son binarios personalizados generados con **EAS (Expo Application Services)**. Se utilizan en proyectos profesionales cuando necesitamos incluir módulos nativos a medida (como sistemas de cámara avanzados o biometría) que no vienen por defecto en Expo Go.


## 📂 Estructura del Proyecto
- `docs/`: Documentación del proyecto e ideas.
- `app/`: Rutas principales de la aplicación (Expo Router).
- `src/`: Código fuente incluyendo componentes, estados (store) y temas.