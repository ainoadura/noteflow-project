-- backend/sql/queries.sql
-- Consultas avanzadas de agregación relacional para Page & Frame

-- Consulta unificada con LEFT JOIN y Agregación JSON
SELECT 
  n.*, -- Selecciona todas las columnas de la tabla madre 'notes'
  
  -- json_agg transforma las filas coincidentes de la derecha en un array de objetos JSON.
  -- FILTER asegura que si una nota no tiene tareas, no meta un objeto vacío en el array.
  -- COALESCE transforma el resultado final en un array vacío '[]' en lugar de un valor NULL.
  COALESCE(json_agg(ci.*) FILTER (WHERE ci.id IS NOT NULL), '[]') as items

FROM notes n -- Tabla izquierda ('n' es el alias para la entidad madre)

-- LEFT JOIN garantiza que se mantengan TODAS las notas de la tabla izquierda,
-- aunque no tengan ninguna tarea asociada en la tabla de la derecha.
LEFT JOIN checklist_items ci ON n.id = ci.note_id

GROUP BY n.id -- Agrupa los resultados por el identificador de la nota para que json_agg funcione por cada tarjeta

ORDER BY n.created_at DESC; -- Ordena el tablón de la pestaña /ideas mostrando las más recientes primero
