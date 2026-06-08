// src/constants/theme.ts
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const typography = {
  sizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 20,
    xl: 28,
    xxl: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

export const borderRadius = {
  s: 4,
  m: 8,
  l: 12,
  full: 9999,
};

// 🎨 REDISEÑO: Colores temáticos por categoría decididos para Page & Frame
export const categoryColors = {
  books: '#10B981',   // Verde esmeralda editorial para libros
  movies: '#FF4B4B',  // Rojo cinematográfico potente para películas
  series: '#8B5CF6',  // Morado streaming eléctrico para series de TV
  star: '#F59E0B',    // Ámbar/Naranja cálido para las estrellas de puntuación
};

// 🎨 REDISEÑO: Paleta Oscura e Inmersiva Premium definitiva
const darkPalette = {
  primary: '#F59E0B',       // Ámbar para destacados principales
  background: '#0F0F10',    // Negro azabache profundo (evita fatiga visual)
  surface: '#1C1C1E',       // Gris grafito oscuro para las tarjetas contenedoras
  text: '#FFFFFF',          // Blanco puro para títulos legibles
  textSecondary: '#9CA3AF', // Gris claro para los metadatos secundarios
  border: '#2C2C2E',        // Gris sutil para las líneas y divisiones discretas
};

// Fallback light theme adaptado de forma limpia
const lightPalette = {
  primary: '#D97706',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
};

export function useTheme() {
  const isDark = true; 
  const selectedPalette = isDark ? darkPalette : lightPalette;

  return {
    isDark,
    colors: {
      ...selectedPalette, 
      ...categoryColors,
    },
    spacing,
    typography,
    borderRadius,
  };
}
