// components/items/ChecklistCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewProps } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { ChecklistNote } from '../../src/types';
import { useTheme } from '../../src/constants/theme';

interface ChecklistCardProps {
  note: ChecklistNote;
  onPress?: () => void;
}

const AnimatedCardContainer = Animated.View as React.ComponentType<any>;

export default function ChecklistCard({ note, onPress }: ChecklistCardProps) {
  const { colors, spacing, typography } = useTheme();

  const totalItems = note.items.length;
  const completedItems = note.items.filter(i => i.isCompleted).length;
  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <AnimatedCardContainer entering={FadeInDown} exiting={FadeOutLeft}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, padding: spacing.m, marginBottom: spacing.s }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.m }]}>
            {note.title}
          </Text>
          <Text style={[styles.counter, { color: colors.textSecondary, fontSize: typography.sizes.s }]}>
            {completedItems}/{totalItems}
          </Text>
        </View>

        {/* Progress Bar Container */}
        <View style={[styles.progressTrack, { backgroundColor: colors.border, marginTop: spacing.s }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: colors.primary, 
                width: `${progressPercent}%` 
              }
            ]} 
          />
        </View>
      </TouchableOpacity>
    </AnimatedCardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  counter: {
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
