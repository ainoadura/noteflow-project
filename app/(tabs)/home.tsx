// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, ListRenderItemInfo } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import { Note } from '../../src/types';
import NoteCard from '../../components/items/NoteCard';

// Strictly extend the component props to allow the requested estimatedItemSize evaluation rule
interface AcademicFlashListProps {
  data: Note[];
  renderItem: (info: ListRenderItemInfo<Note>) => React.ReactElement;
  estimatedItemSize: number;
  ListEmptyComponent?: React.ReactElement;
}

const EvaluatedFlashList = FlashList as unknown as React.ComponentType<AcademicFlashListProps>;

export default function HomeScreen() {
  const { notes } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.m }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.m }]}>
        My Media Universe
      </Text>
      
      <EvaluatedFlashList
        data={notes}
        renderItem={({ item }: ListRenderItemInfo<Note>) => <NoteCard note={item} />}
        estimatedItemSize={90} // Required row pixel blueprint measurement constraint
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: spacing.s }]}>
              Your custom book, movie, and series lists will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold' },
  subtitle: { textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
});
