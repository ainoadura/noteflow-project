// app/(tabs)/ideas.tsx
import React from 'react';
import { View, Text, StyleSheet, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: spacing.m }}>
        <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.xs }]}>
          Page & Frame
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: spacing.m }]}>
          Quick recommendations, recommendations and brainstorms
        </Text>
      </View>
      
      <View style={{ flex: 1, paddingHorizontal: spacing.m }}>
        <EvaluatedIdeaList
          data={ideas}
          renderItem={({ item }: ListRenderItemInfo<IdeaNote>) => <IdeaCard note={item} />}
          estimatedItemSize={75}
          ListEmptyComponent={
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginTop: 40 }]}>
              No quick recommendations captured.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 13 },
});
