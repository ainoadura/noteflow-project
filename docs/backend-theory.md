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
