// app/_layout.tsx
// @ts-expect-error - Expo Router native bundle mapping handled by Metro
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '../src/components/ui/gluestack-ui-provider';
import { useTheme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';

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
        {/* Main Tab Navigation group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Dynamic Detail route */}
        <Stack.Screen name="note/[id]" options={{ title: 'Media Detail' }} />
        
        {/* Creation Modal route */}
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
