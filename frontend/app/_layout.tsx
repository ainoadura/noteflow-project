// app/_layout.tsx
import { useEffect } from 'react'; // 1. Importamos useEffect de React
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useTheme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useNotesStore } from '../src/store/noteStore'; // 2. Importamos tu store de Zustand
import '../global.css'; 

export default function RootLayout() {
  const { colors } = useTheme();
  
  // 3. Traemos la función de carga que conecta con el backend de Next.js
  const fetchNotes = useNotesStore((state) => state.fetchNotes);

  // 4. Disparamos la petición a la base de datos de Neon al abrir la app
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <GluestackUIProvider mode="light">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface || '#1C1C1E',
          },
          headerTintColor: colors.text || '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ title: 'Media Detail' }} />
        <Stack.Screen name="new-note" options={{ title: 'New Note', presentation: 'modal' }} />
      </Stack>
    </GluestackUIProvider>
  );
}

