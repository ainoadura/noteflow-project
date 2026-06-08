// app/_layout.tsx
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useTheme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; 


export default function RootLayout() {
  const { colors } = useTheme();

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

