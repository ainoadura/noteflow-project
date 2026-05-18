import { useColorScheme } from 'react-native';

// Design Tokens: Spacing Scale (Multiples of 4/8)
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

// Design Tokens: Typography Scale
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

// Design Tokens: Border Radius
export const borderRadius = {
  s: 4,
  m: 8,
  l: 12,
  full: 9999,
};

// Semantic Category Colors (Universal for both themes)
export const categoryColors = {
  books: '#FBC02D',   // Amarillo temporal
  movies: '#E53935',  // Rojo temporal
  series: '#43A047',  // Verde temporal
  star: '#FFB300',
};

// Theme Palettes (Light vs Dark)
const lightPalette = {
  primary: '#1A1A1A',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#EEEEEE',
};

const darkPalette = {
  primary: '#FFFFFF',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  border: '#2C2C2C',
};

// Custom Hook to dynamically get the active theme tokens
export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
