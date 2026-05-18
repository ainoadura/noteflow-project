// app/(tabs)/home.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/constants/theme';

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl }]}>
        My Media Universe
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: spacing.s }]}>
        Your custom book, movie, and series lists will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
  },
});
