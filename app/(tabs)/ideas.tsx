// app/(tabs)/ideas.tsx
import React from 'react';
import { View, Text, StyleSheet, ListRenderItemInfo } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import { IdeaNote } from '../../src/types';
import IdeaCard from '../../components/items/IdeaCard';

interface AcademicIdeaProps {
  data: IdeaNote[];
  renderItem: (info: ListRenderItemInfo<IdeaNote>) => React.ReactElement;
  estimatedItemSize: number;
  ListEmptyComponent?: React.ReactElement;
}

const EvaluatedIdeaList = FlashList as unknown as React.ComponentType<AcademicIdeaProps>;

export default function IdeasScreen() {
  const { ideas } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.m }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.m }]}>
        Quick Ideas & Quotes
      </Text>
      <EvaluatedIdeaList
        data={ideas}
        renderItem={({ item }: ListRenderItemInfo<IdeaNote>) => <IdeaCard note={item} />}
        estimatedItemSize={75} // Strict cell layout budget target sizing
        ListEmptyComponent={
          <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginTop: 40 }]}>
            No quick recommendations captured.
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
