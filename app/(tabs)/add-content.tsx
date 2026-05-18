// app/(tabs)/add-content.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/constants/theme';

export default function AddContentScreen() {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl }]}>
        Add New Media
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: spacing.s }]}>
        Form to register items into your catalog.
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
