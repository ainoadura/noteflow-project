# Page & Frame - My Media Universe

Una aplicación móvil moderna construida con **React Native** y **Expo** para gestionar y organizar tu universo personal de libros, películas y series.

## 📂 Documentación
Consulta los detalles del proyecto en los siguientes documentos:
- [Definición de la Idea](docs/idea.md): Concepto, usuarios y funcionalidades.
- [Gestión del Proyecto](docs/project-management.md): Metodología y enlace al tablero de tareas.
- [Configuración de IA](docs/ai-setup.md): Reglas y contexto para herramientas de IA.
- [Teoría de React Native](docs/react-native-theory.md): Conceptos clave, Metro Bundler y entornos de desarrollo.
- [Teoría del Backend y API REST](docs/backend-theory.md): Patrón cliente-servidor, seguridad en bases de datos y códigos de estado HTTP.
- [Seguridad de la API e Inyección SQL](docs/security-api.md): Mitigación de inyecciones, consultas parametrizadas y variables de entorno protegidas.

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

## 💻 Infraestructura del Backend

El servidor de **Page & Frame** está conectado a una base de datos relacional en la nube:
- **Motor de Base de Datos:** PostgreSQL 18
- **Proveedor Cloud:** [Neon.tech](https://neon.tech) (Servidor alojado en la región `eu-central-1` - Frankfurt)
- **Variables de Entorno:** Las credenciales de conexión se gestionan de forma oculta y segura en el archivo local `backend/.env.local` (excluido en el `.gitignore`).

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

El repositorio está organizado bajo una arquitectura **Monorepo** que independiza las dependencias y entornos de desarrollo de cada módulo:

- `docs/`: Documentación teórica centralizada global (`react-native-teoria.md` y `backend-theory.md`).
- `frontend/`: Aplicación móvil desarrollada con React Native, Expo, Zustand y TypeScript.
  - `app/`: Enrutamiento y pantallas de la interfaz móvil (Expo Router).
  - `src/`: Lógica core, persistencia con AsyncStorage, tipos estrictos y tokens de diseño.
  - `components/`: Tarjetas optimizadas (`NoteCard`, `ChecklistCard`, `IdeaCard`).
- `backend/`: API REST desarrollada con Next.js, conectada a PostgreSQL en la nube de Neon mediante sentencias SQL.
  - `app/`: Rutas, manejadores de peticiones y endpoints del servidor web (Next App Router).
  - `lib/`: Módulo de conexión e intermediario de consultas seguras a la base de datos (`db.ts`).
  - `sql/`: Código fuente de las sentencias DDL de las tablas relacionales (`schema.sql`).
