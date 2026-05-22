// src/constants/theme.ts
import { useColorScheme } from 'react-native';

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

// Enhanced brand categorization category colors
export const categoryColors = {
  books: '#F59E0B',   // Elegant Amber Gold for literature core
  movies: '#EF4444',  // Cinematic Premium Crimson Red
  series: '#10B981',  // Emerald Modern Green
  star: '#FFB300',
};

// 🎨 REDISEÑO: Paleta Oscura e Inmersiva por Defecto para Page & Frame
const darkPalette = {
  primary: '#F59E0B',       // Golden Amber for highlights and key elements
  background: '#121212',    // Deep cinematic midnight background
  surface: '#1E1E1E',       // Smooth anthracite container card fill
  text: '#FFFFFF',          // Pure crisp white for readable titles
  textSecondary: '#9CA3AF', // Light silver gray for metadata details
  border: '#2D2D2D',        // Subdued elegant outline borders
};

// Fallback light theme with sleek design adjustments
const lightPalette = {
  primary: '#D97706',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
};

export function useTheme() {
  const colorScheme = useColorScheme();
  
  // For validation and assignment phase, we enforce the dark mode layout directly
  // Change to 'isDark = colorScheme === "dark"' later if system mirroring is required
  const isDark = true; 
  const colors = isDark ? darkPalette : lightPalette;

  return {
    isDark,
    colors: {
      ...colors,
      ...categoryColors,
    },
    spacing,
    typography,
    borderRadius,
  };
}
