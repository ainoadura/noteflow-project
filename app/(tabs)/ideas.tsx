// app/(tabs)/ideas.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';

export default function IdeasScreen() {
  const { ideas } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
        
        <View style={{ paddingHorizontal: spacing.m, paddingTop: spacing.s }}>
          <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.xs }]}>
            Page & Frame
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: spacing.m }]}>
            Quick recommendations, recommendations and brainstorms
          </Text>
        </View>
        
        <View style={{ flex: 1, paddingHorizontal: spacing.m }}>
          <FlashList
            data={ideas}
            estimatedItemSize={75}
            renderItem={({ item }) => <View><Text style={{ color: colors.text }}>{item.title}</Text></View>}
            ListEmptyComponent={
              <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginTop: 40 }]}>
                No quick recommendations captured.
              </Text>
            }
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 13 },
});
