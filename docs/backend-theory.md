# Arquitectura de Servidor y Fundamentos de API REST

Este documento detalla los conceptos teóricos esenciales sobre el funcionamiento del backend en **Page & Frame**, justificando la separación de capas y el flujo de comunicación a través de internet.

## 1. El Patrón Cliente-Servidor

Para el desarrollo del ecosistema de **Page & Frame**, se ha implementado una arquitectura basada en el patrón **Cliente-Servidor**. Este patrón divide el sistema en dos componentes independientes que se comunican a través de una red local o internet utilizando el protocolo de red HTTP:

*   **El Cliente (Frontend / App Móvil):** Desarrollado con React Native y Expo. Es la capa encargada de interactuar directamente con el usuario, pintar las tarjetas visuales (**azul**, **morado** y **verde**) y capturar las entradas de datos en los formularios mediante Zustand. El cliente no tiene persistencia directa en bases de datos relacionales en la nube de producción por motivos de seguridad; delega esa responsabilidad en el servidor.
*   **El Servidor (Backend / API REST):** Desarrollado con Next.js y TypeScript. Es una entidad centralizada y protegida de forma externa. Actúa como el único intermediario legal entre la aplicación móvil y el motor de base de datos de PostgreSQL en Neon.

### 🛡️ Justificación de Seguridad Crítica
Una aplicación móvil **nunca bajo ningún concepto** debe conectarse de forma directa a una base de datos de producción. Si el String de Conexión o las credenciales de PostgreSQL estuviesen embebidas de forma nativa dentro del código binario compilado de la aplicación (los archivos `.apk` o `.ipa`), cualquier atacante con herramientas básicas de ingeniería inversa podría descompilar el paquete en cuestión de minutos. Al hacerlo, obtendría acceso total de lectura, escritura y borrado sobre el clúster de base de datos. 

Al interponer la capa del servidor como un "guardián privado", las credenciales críticas se almacenan en variables de entorno seguras (`.env.local`) que se procesan estrictamente en la nube del servidor. El cliente móvil solo puede interactuar con los datos a través de puntos de acceso restringidos y supervisados.

---

## 2. ¿Qué es una API REST?

Una **API REST** (Application Programming Interface / Representational State Transfer) es un estándar de arquitectura de software diseñado para guiar el intercambio de datos entre sistemas de forma ligera, síncrona y predecible. En **Page & Frame**, la API REST cumple con las siguientes características esenciales:

*   **Sin Estado (Stateless):** El servidor de Next.js no conserva memoria de qué cliente está conectado entre una petición y otra. Cada llamada HTTP entrante es una transacción independiente que debe contener toda la información y los parámetros necesarios para ser resuelta por sí misma.
*   **Formato JSON Nativo:** La comunicación de datos se realiza utilizando estructuras compactas de formato JSON (JavaScript Object Notation). El cliente móvil serializa sus interfaces rápidas a JSON y el servidor deserializa estas cadenas de texto de forma directa a objetos tipados en TypeScript.

---

## 3. Mapeo de Métodos HTTP y Operaciones de Datos

La API REST utiliza los métodos nativos del protocolo HTTP para mapear las intenciones de manipulación de datos que solicita el cliente móvil desde sus pestañas, asimilándolas a las operaciones CRUD tradicionales:

*   **`GET` (Leer Datos):** Se ejecuta cuando el usuario entra en la pestaña **Quick Ideas**. La aplicación móvil dispara un `GET` hacia la ruta de la API para recuperar las colecciones unificadas almacenadas en las tablas de la base de datos de Neon. Es una operación de solo lectura y segura.
*   **`POST` (Crear Datos):** Se acciona al rellenar el formulario rápido y pulsar **SAVE REGISTRATION**. El cliente envía el objeto JSON a través de un `POST` al servidor. El backend captura la estructura, la valida de forma estricta contra los esquemas de **Zod** y efectúa un comando `INSERT` de SQL en PostgreSQL.
*   **`PATCH` (Modificar Datos Parcialmente):** Utilizado para actualizar un fragmento de una nota existente sin sobrescribir el registro completo (por ejemplo, para conmutar el estado booleano `isCompleted` de un ítem dentro de una tarjeta de tareas morada).
*   **`DELETE` (Eliminar Datos):** Se ejecuta al realizar un toque prolongado (*onLongPress*) sobre las tarjetas del tablón rápido. Envía una petición `DELETE` adjuntando el ID del elemento en la URL para accionar una cláusula `DELETE FROM` de SQL en la base de datos local remota.

---

## 4. Gestión de Códigos de Estado (Status Codes) y Seguridad Interna

Para asegurar un diagnóstico preciso del flujo de red y blindar el servidor contra ataques de reconocimiento, la API procesa y devuelve Códigos de Estado estándar en sus respuestas HTTP:

*   **`200 OK`:** La consulta (ya sea de lectura, edición o borrado) se ha resuelto con éxito absoluto en el servidor.
*   **`201 Created`:** El método `POST` ha culminado correctamente; los datos de la nota rápida se han insertado de forma física y permanente en las tablas de PostgreSQL.
*   **`400 Bad Request`:** Los datos enviados por la app móvil no superaron el análisis estricto de los esquemas de validación de **Zod** (por ejemplo, un título con menos caracteres de los permitidos). El servidor frena la operación antes de tocar la base de datos y le devuelve al cliente los campos que fallaron.
*   **`401 Unauthorized`:** El cliente intenta operar sobre un recurso restringido sin aportar las claves o tokens de validación válidos.
*   **`404 Not Found`:** El recurso o ruta solicitada en la URL de la API no existe en el mapa de enrutamiento del servidor.
*   **`500 Internal Server Error`:** Indica que se ha producido un fallo no controlado dentro del código del backend o en la infraestructura de la base de datos.

### 🛡️ Tratamiento Seguro de Excepciones de Base de Datos
Siguiendo las mejores prácticas de seguridad informática, **nunca bajo ningún concepto se debe devolver el error nativo o la traza cruda de la base de datos al cliente final**. Si una consulta de SQL falla por un error de sintaxis o de claves foráneas, enviar esa excepción por red expondría la estructura interna de las tablas y los nombres de las columnas a posibles atacantes, quienes usarían esa información para planificar inyecciones SQL. 

En Page & Frame, todas las interacciones de base de datos se encapsulan en bloques `try/catch`. Si ocurre una excepción, el error real se registra en los archivos de log privados del terminal del PC (`console.error`), pero de cara al exterior la API interrumpe la respuesta y devuelve un mensaje genérico y seguro blindado con el código **`500 Internal Server Error`**.


## 5. Arquitectura de Base de Datos Relacional y Propiedades ACID

Para garantizar la integridad y persistencia de las anotaciones de **Page & Frame** en la nube de Neon, la API se apoya en los principios fundamentales de los motores relacionales (PostgreSQL):

### A. Propiedades ACID y Consistencia del Dominio
Las transacciones en la base de datos están blindadas por las propiedades **ACID** (Atomicidad, Consistencia, Aislamiento y Durabilidad):
*   **Atomicidad en el proyecto:** Al registrar una lista de tareas morada (`ChecklistNote`), la operación involucra insertar la cabecera en una tabla y sus elementos hijos en otra. La atomicidad garantiza que la transacción es un bloque único de "todo o nada". Si la inserción de un elemento del checklist falla, toda la transacción se revierte (*rollback*), impidiendo que se cree una nota vacía o incompleta que corrompa la consistencia de los datos.

### B. Gestión Estratégica de Claves (Primary & Foreign Keys)
*   **Primary Key (Generación Offline):** Como identificador único e irrepetible de cada nota, la aplicación móvil genera los IDs en el cliente utilizando marcas temporales únicas (`quick-${Date.now()}`). Esto permite que el usuario capture estímulos culturales, pensamientos e ideas de forma **offline** sin cobertura de red. El registro se guarda de forma segura con su clave primaria definitiva en `AsyncStorage` y se sincroniza síncronamente con Neon en cuanto detecta conexión.
*   **Foreign Key y Restricción ON DELETE CASCADE:** La tabla de elementos secundarios se enlaza a la tabla madre mediante una clave foránea (`Foreign Key`). Al declarar la restricción **`ON DELETE CASCADE`** en el DDL de PostgreSQL, garantizamos que cuando el usuario ejecute un toque prolongado (*onLongPress*) en su móvil para eliminar una lista, el motor de Neon purgará de forma automática todos los elementos hijos asociados, optimizando el mantenimiento de la base de datos desde el propio motor físico.

### C. Separación Lingüística: DDL vs DML
El ciclo de desarrollo de la base de datos en Neon diferencia estrictamente dos lenguajes de interacción:
1.  **DDL (Data Definition Language):** Comandos utilizados por el administrador para estructurar el esquema del servidor en la nube (`CREATE TABLE`, `ALTER`, `DROP`). Define los tipos de datos exactos de nuestras notas rápidas.
2.  **DML (Data Mining/Manipulation Language):** Sentencias dinámicas que ejecuta nuestra API de Next.js en tiempo de ejecución (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) para transferir de forma síncrona los objetos JSON del frontend hacia las tuplas físicas de PostgreSQL.


## 6. Diagrama Entidad-Relación (DER) y Diseño del Esquema en Neon

Para dar soporte a la persistencia unificada en la nube de Neon, se ha ejecutado el DDL optimizado en la consola SQL de PostgreSQL. A diferencia del enunciado genérico, el esquema se ha simplificado a **dos tablas relacionales**, absorbiendo la lógica de etiquetado en la tabla central para optimizar las consultas y eliminar tablas huérfanas en tiempo de ejecución.

### A. Estructura de las Tablas y Diccionario de Datos

#### 1. Tabla Central: `notes`
Representa la entidad madre que unifica las notas estándar, las listas de verificación y los pensamientos rápidos.
*   **`id` (VARCHAR(50) / PRIMARY KEY):** Identificador único e irrepetible transferido desde el cliente móvil tras su generación offline.
*   **`title` (VARCHAR(255) / NOT NULL):** Título descriptivo del registro o combinación ágil de cabecera.
*   **`content` (TEXT / NULL):** Cuerpo de la nota rápida o desarrollo del pensamiento.
*   **`type` (VARCHAR(50) / CHECK):** Restricción estricta de dominio que solo admite los valores `('standard', 'checklist', 'idea')`, mapeando con las pestañas de la interfaz móvil.
*   **`color` (VARCHAR(30) / NULL):** Almacena la marca de control (`blue-electric`) o el código hexadecimal pastel seleccionado para los bordes visuales.
*   **`created_at` (TIMESTAMPTZ / NOT NULL):** Marca de tiempo con zona horaria de la creación del registro.
*   **`updated_at` (TIMESTAMPTZ / NOT NULL):** Marca de tiempo de la última modificación.

#### 2. Tabla Secundaria: `checklist_items`
Representa las tareas individuales o capítulos asociados exclusivamente a las notas de tipo lista.
*   **`id` (VARCHAR(50) / PRIMARY KEY):** Identificador único de la tarea generado en el cliente móvil.
*   **`note_id` (VARCHAR(50) / FOREIGN KEY):** Clave foránea que conecta la tarea con su nota madre en la tabla `notes`.
*   **`text` (VARCHAR(255) / NOT NULL):** Descripción textual de la tarea específica.
*   **`is_completed` (BOOLEAN / DEFAULT FALSE):** Estado de verificación binario utilizado para calcular la barra de progreso en el frontend.

---

### B. Relaciones del Modelo y Justificación de Arquitectura

El esquema implementa una relación de **1 a Muchos (1:N)** entre la tabla `notes` y `checklist_items`:
*   Una tupla en la tabla `notes` puede tener **cero o múltiples** elementos hijos en la tabla `checklist_items` (específicamente cuando `type = 'checklist'`).
*   Cada elemento en `checklist_items` pertenece de forma obligatoria a **una y solo una** nota madre.

```text
  ┌────────────────────────┐             ┌────────────────────────┐
  │         NOTES          │             │    CHECKLIST_ITEMS     │
  ├────────────────────────┤             ├────────────────────────┤
  │ PK │ id (VARCHAR)      │1           N│ PK │ id (VARCHAR)      │
  │    │ title (VARCHAR)   ├────────────►│ FK │ note_id (VARCHAR) │
  │    │ content (TEXT)    │             │    │ text (VARCHAR)    │
  │    │ type (VARCHAR)    │             │    │ is_completed (BOOL)│
  │    │ color (VARCHAR)   │             └────────────────────────┘
  │    │ created_at (TZ)   │             
  │    │ updated_at (TZ)   │             
  └────────────────────────┘
```

### 🛡️ Restricción ON DELETE CASCADE y Optimización de Consultas
La relación está blindada con la cláusula **`ON DELETE CASCADE`** en la clave foránea. Esto garantiza la integridad referencial del sistema: si una nota de tipo checklist es eliminada mediante un toque prolongado en la aplicación móvil, el propio motor de PostgreSQL en Neon purga de forma síncrona todas las tareas de la tabla `checklist_items` vinculadas a ese `note_id`. 

**Justificación de la omisión de `note_tags`:** La tabla original de etiquetas libres se ha descartado debido a que el frontend automatiza la categorización internamente a través de la columna `type`. Mantener una tercera tabla para datos estáticos obligaría al servidor a realizar operaciones de acoplamiento (`JOIN`) costosas en tiempo de ejecución, penalizando la velocidad de respuesta de la API REST de forma innecesaria.

## 7. Bitácora de Pruebas de Endpoints (REST Client Validation)

Para validar la correcta sincronización entre la API REST de Next.js y el clúster de producción en Neon, se ha ejecutado una batería de pruebas de red utilizando la extensión REST Client. A continuación se documenta el volcado literal de las respuestas de éxito devueltas por el servidor:

### A. Petición: `POST /api/notes` (Registro de Contenido)
*   **Intención:** El usuario guarda una nota de tipo estándar desde el modal móvil.
*   **Respuesta Real del Servidor (HTTP 201):**
```text
HTTP/1.1 201 Created
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
content-type: application/json
Date: Wed, 10 Jun 2026 09:02:15 GMT
Connection: close
Transfer-Encoding: chunked

{
  "id": "quick-1718000000",
  "title": "Recordar ver Interestelar este fin de semana",
  "content": "Me la recomendó Carlos. Dice que la banda sonora es brutal.",
  "type": "standard",
  "color": "blue-electric",
  "created_at": "2026-06-10T09:02:14.218Z",
  "updated_at": "2026-06-10T09:02:14.218Z"
}
```

### B. Petición: `GET /api/notes` (Indexación del Tablón)
*   **Intención:** Hidratar la lista de alto rendimiento `FlashList` en la pestaña `/ideas`.
*   **Respuesta Real del Servidor (HTTP 200):**
```text
HTTP/1.1 200 OK
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
content-type: application/json
Date: Wed, 10 Jun 2026 09:02:58 GMT
Connection: close
Transfer-Encoding: chunked

[
  {
    "id": "quick-1718000000",
    "title": "Recordar ver Interestelar este fin de semana",
    "content": "Me la recomendó Carlos. Dice que la banda sonora es brutal.",
    "type": "standard",
    "color": "blue-electric",
    "created_at": "2026-06-10T09:02:14.218Z",
    "updated_at": "2026-06-10T09:02:14.218Z"
  }
]
```

### C. Petición: `DELETE /api/notes/[id]` (Purga de Registro)
*   **Intención:** El usuario confirma la eliminación definitiva mediante un toque largo.
*   **Respuesta Real del Servidor (HTTP 204):**
```text
HTTP/1.1 204 No Content
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
Date: Wed, 10 Jun 2026 09:03:15 GMT
Connection: close
```
*(Cuerpo vacío devuelto de forma nativa por el servidor de Next.js acorde a las especificaciones del enunciado).*


## 8. Endpoints Relacionales Avanzados y Agregación JSON

Para dar soporte a la gestión interactiva de listas de tareas completables (`ChecklistNote`), se han implementado endpoints relacionales que explotan el potencial de las cláusulas de acoplamiento de PostgreSQL (`LEFT JOIN`) combinadas con funciones de agregación JSON nativas en el motor de Neon.

### A. Petición: `POST /api/notes/[id]/checklist-items` (Inyección de Sub-recurso)
*   **Intención:** El usuario añade un capítulo o tarea a una lista desde la app móvil.
*   **Respuesta Real de Neon (HTTP 201):**
```text
HTTP/1.1 201 Created
content-type: application/json

{
  "id": "item-111111",
  "note_id": "chk-999999",
  "text": "Episodio 1: Anjin",
  "is_completed": false
}
```

### B. Petición: `PATCH /api/checklist-items/[itemId]` (Mutación de Estado Binario)
*   **Intención:** Marcar o desmarcar un ítem para recalcular la barra de progreso morada.
*   **Respuesta Real de Neon (HTTP 200):**
```text
HTTP/1.1 200 OK
content-type: application/json

{
  "id": "item-111111",
  "note_id": "chk-999999",
  "text": "Episodio 1: Anjin",
  "is_completed": true
}
```

### C. La Joya de la Corona: El Resultado del `LEFT JOIN` y `json_agg`
Al ejecutar la petición unificada de lectura general (`GET /api/notes`), el backend no realiza múltiples consultas lentas en bucle. En su lugar, ejecuta una única consulta relacional estructurada con un `LEFT JOIN` hacia `checklist_items` y agrupa los sub-recursos en un array JSON virtual. 

A continuación se muestra el JSON real devuelto por la API REST que nutre de forma instantánea a las tarjetas del frontend móvil:

```json
[
  {
    "id": "chk-999999",
    "title": "Lista de episodios de Shogun",
    "content": "Temporada 1 en Disney+",
    "type": "checklist",
    "color": "checklist-purple",
    "created_at": "2026-06-10T09:32:08.969Z",
    "updated_at": "2026-06-10T09:32:08.969Z",
    "items": [
      {
        "id": "item-111111",
        "note_id": "chk-999999",
        "text": "Episodio 1: Anjin",
        "is_completed": true
      }
    ]
  }
]
```

## 9. Anatomía de Acoplamientos Relacionales: INNER JOIN vs. LEFT JOIN

Para la extracción de conjuntos de datos combinados en motores PostgreSQL, es fundamental discriminar el comportamiento y la teoría de conjuntos detrás de las cláusulas de acoplamiento:

### A. LEFT JOIN (Acoplamiento Externo Izquierdo)
*   **Comportamiento:** Devuelve **todas las filas** de la tabla izquierda (tabla origen), junto con las filas coincidentes de la tabla derecha. Si no existe ninguna coincidencia en la tabla derecha, el motor relacional rellena esos campos con valores `NULL`.
*   **Cuándo usarlo en Page & Frame:** Es la opción obligatoria para renderizar el tablón unificado de la pestaña `/ideas`. Necesitamos que la API devuelva **todas las notas y pensamientos** (tabla izquierda `notes`), independientemente de si tienen tareas hijas o no. Si usáramos otra cláusula, las notas estándar o los pensamientos verdes (que nacen sin tareas) desaparecerían del mapa por no tener registros en `checklist_items`.

### B. INNER JOIN (Acoplamiento Interno)
*   **Comportamiento:** Devuelve **única y exclusivamente las filas que tienen una coincidencia exacta** en ambas tablas. Si una fila de la tabla izquierda no encuentra un registro relacionado con su misma clave en la tabla derecha, esa tupla queda completamente excluida del resultado de la consulta.
*   **Cuándo usarlo en Page & Frame:** Se utilizaría en un módulo de auditoría o analítica interna del servidor. Por ejemplo, si el frontend necesitara pintar una pantalla exclusiva llamada *"Mis listas activas con subtareas asignadas"*, un `INNER JOIN` entre `notes` y `checklist_items` descartaría automáticamente los pensamientos y las notas estándar aisladas, devolviendo solo las checklists que poseen como mínimo una tarea física registrada en la base de datos de Neon.


## 10. Diagrama Entidad-Relación (DER) del Esquema de Datos

La arquitectura de la base de datos relacional en Neon está compuesta por tres entidades principales indexadas mediante claves foráneas y restricciones de integridad referencial:

```text
  ┌──────────────────────────────────┐
  │              NOTES               │
  ├──────────────────────────────────┤
  │ id (VARCHAR PRIMARY KEY)         │◄───┐
  │ title (VARCHAR)                  │    │
  │ content (TEXT)                   │    │
  │ type (VARCHAR CHECK)             │    │
  │ color (VARCHAR)                  │    │
  │ created_at (TIMESTAMPTZ)         │    │
  │ updated_at (TIMESTAMPTZ)         │    │
  └──────────────────────────────────┘    │
                   ▲                      │
                   │ (1:N)                │ (1:N)
                   │                      │
  ┌──────────────────────────────────┐    │ ┌──────────────────────────────────┐
  │         CHECKLIST_ITEMS          │    │ │            NOTE_TAGS             │
  ├──────────────────────────────────┤    │ ├──────────────────────────────────┤
  │ id (VARCHAR PRIMARY KEY)         │    └─│ id (VARCHAR PRIMARY KEY)         │
  │ note_id (VARCHAR FOREIGN KEY) ───┘      │ note_id (VARCHAR FOREIGN KEY) ───┘
  │ text (VARCHAR)                   │      │ tag (VARCHAR)                    │
  │ is_completed (BOOLEAN)           │      └──────────────────────────────────┘
  └──────────────────────────────────┘
```

### Relaciones y Restricciones del Modelo:
1.  **`notes` a `checklist_items` (Relación 1 a Muchos / 1:N)**: Una fila de la entidad raíz `notes` puede albergar múltiples subtareas hijas. Cada registro en `checklist_items` depende existencialmente de su nota contenedora mediante el atributo `note_id`.
2.  **`notes` a `note_tags` (Relación 1 a Muchos / 1:N)**: Estructura diseñada para categorizar el contenido. Una nota es susceptible de poseer múltiples etiquetas dinámicas indexadas por la clave foránea `note_id`.
3.  **Cláusula ON DELETE CASCADE**: Aplicada de forma estricta en ambas restricciones de clave externa. Garantiza que la eliminación física de un registro en `notes` desencadene de forma atómica y automática la purga de sus ítems y etiquetas vinculadas en el motor PostgreSQL, mitigando la persistencia de registros huérfanos y manteniendo la consistencia e integridad referencial del sistema.
