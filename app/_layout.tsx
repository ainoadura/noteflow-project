// app/_layout.tsx
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useTheme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; 

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <GluestackUIProvider>
      <StatusBar style={colors.background === '#FFFFFF' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background === '#FFFFFF' ? '#1A1A1A' : colors.surface,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Usamos el enrutado limpio nativo de las pestañas */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ title: 'Media Detail' }} />
        <Stack.Screen 
          name="new-note" 
          options={{ 
            title: 'Create New Content', 
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
      </Stack>
    </GluestackUIProvider>
  );
}
