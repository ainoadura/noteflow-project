// app/new-note.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../src/constants/theme';

export default function NewNoteModal() {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.xl }]}>
        Add Content Modal
      </Text>
      <Text style={{ color: colors.textSecondary, marginTop: spacing.s }}>
        Form to add books, movies, or series will go here.
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
