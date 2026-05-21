// app/(tabs)/add-content.tsx
import React from 'react';
import { View, Text, StyleSheet, ListRenderItemInfo } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import { ChecklistNote } from '../../src/types';
import ChecklistCard from '../../components/items/ChecklistCard';

interface AcademicChecklistProps {
  data: ChecklistNote[];
  renderItem: (info: ListRenderItemInfo<ChecklistNote>) => React.ReactElement;
  estimatedItemSize: number;
  ListEmptyComponent?: React.ReactElement;
}

const EvaluatedChecklistList = FlashList as unknown as React.ComponentType<AcademicChecklistProps>;

export default function AddContentScreen() {
  const { checklists } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.m }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.m }]}>
        Watchlists & Progress
      </Text>
      <EvaluatedChecklistList
        data={checklists}
        renderItem={({ item }: ListRenderItemInfo<ChecklistNote>) => <ChecklistCard note={item} />}
        estimatedItemSize={65} // Metric row size budget specification allocation
        ListEmptyComponent={
          <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginTop: 40 }]}>
            No progress watchlists found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold' },
  subtitle: { textAlign: 'center' },
});
