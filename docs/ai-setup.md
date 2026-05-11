# Configuración de herramientas de IA

Para asegurar la consistencia del código y evitar que las herramientas de IA generen soluciones contradictorias, se han aplicado las siguientes configuraciones.

## Cursor (.cursorrules)
Se ha creado un archivo `.cursorrules` en la raíz que define:

*   Contexto técnico: Uso de Expo Router, Zustand y FlashList.
*   Convenciones: Código en inglés, arquitectura modular y tipado estricto con TypeScript.
*   Restricciones: Uso obligatorio de los tokens de diseño definidos en el tema.

## Prompt de Sistema (Gemini/Claude)
Se ha establecido un contexto persistente para que la IA recuerde que:

1.  El proyecto se llama Page & Frame.
2.  Las categorías tienen colores específicos (Amarillo, Rojo, Verde).
3.  Todo el código técnico debe estar en inglés, mientras que la documentación es en español.

## Justificación
Estas reglas permiten que la IA genere componentes que ya respetan la arquitectura y el sistema de tipos, reduciendo errores de refactorización y manteniendo el proyecto limpio.
