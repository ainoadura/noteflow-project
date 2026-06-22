# Seguridad en la API: Vectores de Ataque y Protección de Secretos

## 1. Inyección SQL (SQL Injection)

La inyección SQL es una de las vulnerabilidades más críticas en aplicaciones web y APIs. Ocurre cuando los datos proporcionados por el usuario se concatenan directamente dentro de una consulta SQL de texto plano sin ningún tipo de filtrado o saneamiento. Esto permite a un atacante inyectar comandos SQL maliciosos que el motor de la base de datos ejecutará como si fuesen instrucciones legítimas.

### Ejemplo Práctico de Vulnerabilidad (Código No Seguro)
Imaginemos que para buscar una nota por su título en nuestra API concatenamos directamente el cuerpo de la petición (`request.json()`):

```typescript
// VULNERABLE: Concatenación directa de strings
const userTitle = body.title; 
const query = `SELECT * FROM notes WHERE title = '${userTitle}'`;
const result = await db.query(query);
```

Si un usuario malintencionado envía en el campo `title` el siguiente texto (vector de ataque):
`'; DROP TABLE notes;--`

La consulta final que compila y ejecuta PostgreSQL se convierte en:
```sql
SELECT * FROM notes WHERE title = ''; DROP TABLE notes;--'
```

*   **Consecuencia:** El carácter `'` cierra prematuramente la condición de búsqueda, el `;` finaliza la primera instrucción, y ejecuta inmediatamente un comando destructivo (`DROP TABLE notes;`). El operador `--` convierte el resto de la consulta original en un comentario, anulando cualquier error de sintaxis y destruyendo la base de datos por completo.

---

## 2. Prevención mediante Consultas Parametrizadas

Las consultas parametrizadas (o *Prepared Statements*) resuelven este vector de ataque separando estrictamente la **estructura lógica de la consulta** de los **datos introducidos por el usuario**. 

### Ejemplo de Implementación Segura en Page & Frame
En nuestra API, utilizamos este enfoque enviando marcadores de posición (`$1`, `$2`, etc.) junto con un array independiente de valores:

```typescript
// SEGURO: Consulta parametrizada con marcadores de posición
const query = "SELECT * FROM notes WHERE title = \$1";
await db.query(query, [body.title]);
```

### ¿Cómo lo previene el motor de la base de datos?
Cuando el backend envía la consulta parametrizada a Neon (PostgreSQL):
1. El motor precompila el SQL (`SELECT * FROM notes WHERE title = $1`) y define de antemano el plano de ejecución exacto de la consulta.
2. Posteriormente, el valor de `body.title` se inyecta en el marcador `$1`.
3. Incluso si el parámetro contiene instrucciones como `DROP TABLE`, el motor lo trata **estrictamente como una cadena de texto literal (un dato)** dentro de la condición `WHERE`, nunca como código ejecutable. La base de datos simplemente buscará una nota cuyo título sea literalmente `'; DROP TABLE notes;--`, abortando el ataque por completo.

---

## 3. Gestión Segura de Credenciales y Variables de Entorno

El *Connection String* de PostgreSQL (como el de Neon) contiene el usuario, el host, el puerto y la **contraseña maestra** de acceso a toda la base de datos. Bajo ninguna circunstancia este string de conexión debe estar embebido directamente en el código fuente de la aplicación.

### Riesgos de la Exposición del Código (Hardcoding)
*   **Fugas en Repositorios:** Si la cadena de conexión se escribe directamente en el código y el proyecto se sube a un repositorio de Git (Público o Privado), cualquier persona con acceso al historial de confirmaciones (*commits*) tendrá control absoluto sobre los datos.
*   **Inflexibilidad:** Hardcodear credenciales impide cambiar entre entornos de desarrollo, pruebas y producción sin tener que refactorizar y recompilar la aplicación.

### Solución mediante Variables de Entorno (`.env.local`)
Para mitigar esto, externalizamos las credenciales confidenciales utilizando variables de entorno en el servidor de Next.js:

1.  **Aislamiento Local (`.env.local`):** Almacena de forma exclusiva la credenciales del entorno de desarrollo local. Este archivo **nunca** se sube al control de versiones de Git gracias a estar explícitamente añadido en el archivo `.gitignore`.
    ```env
    DATABASE_URL=postgres://alex:mi_password_secreta@ep-cool-stream-123456.eu-central-1.aws.neon.tech/neondb
    ```
2.  **Plantilla Pública (`.env.example`):** Actúa como un molde limpio y descriptivo para que otros desarrolladores del equipo sepan qué variables necesita el backend para funcionar, manteniendo los valores completamente vacíos o con ejemplos genéricos.
    ```env
    DATABASE_URL=
    ```
3.  **Consumo en Código:** En nuestro módulo `lib/db.ts`, el backend extrae el secreto dinámicamente mediante el objeto global del entorno de ejecución de Node.js (`process.env.DATABASE_URL`), garantizando que las contraseñas reales queden totalmente invisibles dentro del repositorio.
