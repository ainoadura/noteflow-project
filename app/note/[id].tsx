// app/note/[id].tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/constants/theme';

export default function MediaDetailScreen() {
  // Expo Router strictly infers parameters based on the file name [id].tsx
  const { id } = useLocalSearchParams();
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.xl }]}>
        Media Detail Screen
      </Text>
      <Text style={{ color: colors.textSecondary, marginTop: spacing.s }}>
        Viewing item ID: {id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
});
