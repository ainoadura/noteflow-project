// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/constants/theme'; 

type TabBarIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

export default function TabsLayout() {
  const { colors } = useTheme();

  // Red de seguridad: si colors viene vacío, evitamos el pantallazo en blanco
  const safeColors = {
    primary: colors?.primary || '#007AFF',
    textSecondary: colors?.textSecondary || '#8E8E93',
    background: colors?.background || '#000000',
    border: colors?.border || '#38383A',
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: safeColors.primary,
        tabBarInactiveTintColor: safeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: safeColors.background,
          borderTopColor: safeColors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-content"
        options={{
          title: 'Add Content',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'Quick Ideas',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <Ionicons name={focused ? 'bulb' : 'bulb-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
