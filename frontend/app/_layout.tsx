// app/_layout.tsx
/*
import { useEffect, useState } from 'react'; 
import { Stack, useRouter, useSegments } from 'expo-router';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useTheme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useNotesStore } from '../src/store/noteStore'; 
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import '../global.css'; 

export default function RootLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const segments: string[] = useSegments() as string[];
  
  const fetchNotes = useNotesStore((state) => state.fetchNotes);

  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((currentUser: FirebaseAuthTypes.User | null) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return subscriber; 
  }, [initializing]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup: boolean = segments.includes('(auth)');

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, segments, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background || '#121212' }}>
        <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
      </View>
    );
  }

  return (
    <GluestackUIProvider mode="light">
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background || '#121212' }}>
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
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="note/[id]" options={{ title: 'Media Detail' }} />
          <Stack.Screen name="new-note" options={{ title: 'New Note', presentation: 'modal' }} />
        </Stack>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
*/
import { useEffect, useState } from 'react'; 
import { Stack, useRouter, useSegments } from 'expo-router';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useTheme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useNotesStore } from '../src/store/noteStore'; 
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import '../global.css'; 

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MainLayout />
    </SafeAreaProvider>
  );
}

function MainLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments: string[] = useSegments() as string[];
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((currentUser: FirebaseAuthTypes.User | null) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return subscriber; 
  }, [initializing]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup: boolean = segments.includes('(auth)');

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, segments, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background || '#121212' }}>
        <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
      </View>
    );
  }

  return (
    <GluestackUIProvider mode="light">
      <StatusBar style="light" />
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background || '#121212',
        paddingBottom: insets.bottom > 0 ? insets.bottom : 20 // Levanta la interfaz 20px si el sistema no devuelve el valor nativo
      }}>
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
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="note/[id]" options={{ title: 'Media Detail' }} />
          <Stack.Screen name="new-note" options={{ title: 'New Note', presentation: 'modal' }} />
        </Stack>
      </View>
    </GluestackUIProvider>
  );
}
