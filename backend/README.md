# NoteFlow API 🚀

Este es el servidor backend para el proyecto **NoteFlow** (Page & Frame), una solución robusta y escalable diseñada bajo el patrón cliente-servidor. La API actúa como guardián de la lógica de negocio, validando los datos y gestionando de forma segura la persistencia en un clúster relacional de PostgreSQL administrado en la nube.

## 📋 Características principales
*   **API RESTful**: Endpoints modulares mapeados bajo semántica HTTP estricta.
*   **Seguridad Activa**: Mitigación de vectores de ataque mediante consultas parametrizadas (anti SQL Injection).
*   **Persistencia Robusta**: Esquema relacional con integridad referencial y borrado en cascada en Neon.
*   **Validación de Esquemas**: Limpieza y tipado estricto de payloads entrantes mediante Zod.

---

## 🛠️ Tecnologías y Arquitectura

*   **Framework:** Next.js (App Router / API Routes)
*   **Lenguaje:** TypeScript
*   **Base de Datos:** PostgreSQL (Neon Serverless)
*   **Validador:** Zod
*   **Autenticación:** JWT (JSON Web Tokens)

---

## 🔒 Variables de Entorno Requeridas

Para ejecutar este servidor localmente, debes crear un archivo `.env.local` en la raíz de este directorio con las siguientes llaves:

```env
DATABASE_URL=postgres://usuario:password@host.neon.tech/neondb
JWT_SECRET=tu_clave_secreta_super_segura_para_firmar_tokens
```

*(Nota: Una plantilla sin credenciales reales se encuentra disponible en el archivo `.env.example`)*.

---

## 💻 Instalación y Configuración Local

1.  **Navegar al directorio del backend:**
    ```bash
    cd backend
    ```
2.  **Instalar todas las dependencias del proyecto:**
    ```bash
    npm install
    ```
3.  **Ejecutar el servidor en entorno de desarrollo:**
    ```bash
    npm run dev
    ```
    *El servidor estará escuchando activamente en: `http://localhost:3000`*

---

## 🌐 Catálogo de Endpoints (API Reference)

### Autenticación (Rutas Públicas)
*   **`POST /api/auth/register`**
    *   **Body esperado:** `{ "email": "usuario@ejemplo.com", "password": "mipasswordsegura" }`
    *   **Respuesta (201 Created):** `{ "message": "Usuario registrado con éxito" }`
*   **`POST /api/auth/login`**
    *   **Body esperado:** `{ "email": "usuario@ejemplo.com", "password": "mipasswordsegura" }`
    *   **Respuesta (200 OK):** `{ "token": "eyJhbGciOi..." }`

### Gestión de Notas (Requiere Header `Authorization: Bearer <token>`)
*   **`GET /api/notes`**
    *   **Respuesta (200 OK):** Devuelve un array con todas las notas unificadas, realizando una agregación JSON (`LEFT JOIN`) para incluir sus ítems de checklist correspondientes de forma estructurada.
*   **`POST /api/notes`**
    *   **Body esperado:** `{ "title": "Nueva Nota", "type": "standard", "content": "Texto descriptivo" }`
    *   **Respuesta (201 Created):** Devuelve el objeto de la nota recién guardado con su ID único asignado por el servidor.
*   **`PATCH /api/notes/[id]`**
    *   **Body esperado:** Payload con modificaciones parciales (`title`, `content`, `color`, etc.).
    *   **Respuesta (200 OK):** Objeto de la nota actualizado con los nuevos cambios.
*   **`DELETE /api/notes/[id]`**
    *   **Respuesta (204 No Content):** Borrado físico en la base de datos. Gracias a la restricción `ON DELETE CASCADE`, elimina automáticamente los ítems de checklist y etiquetas dependientes de esta nota sin dejar registros huérfanos.
