// components/items/ChecklistCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { ChecklistNote } from '../../src/types/index'; 
import { useTheme } from '../../src/constants/theme';

interface ChecklistCardProps {
  note: ChecklistNote;
  onPress?: () => void;
  onLongPress?: () => void; // 🌟 Paso B: Añadido a la interfaz
}

const AnimatedCardContainer = Animated.View as React.ComponentType<Record<string, unknown>>;

export default function ChecklistCard({ note, onPress, onLongPress }: ChecklistCardProps) {
  const { colors, spacing, typography } = useTheme();

  const totalItems = note.items.length;
  const completedItems = note.items.filter(i => i.isCompleted).length;
  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const purpleThemeColor = '#8B5CF6'; 

  return (
    <AnimatedCardContainer entering={FadeInDown} exiting={FadeOutLeft}>
      <TouchableOpacity
        style={[
          styles.card, 
          { 
            backgroundColor: colors.surface || '#1C1C1E', 
            padding: spacing.m, 
            marginBottom: spacing.s,
            borderWidth: 1.5,
            borderColor: purpleThemeColor
          }
        ]}
        onPress={onPress}
        onLongPress={onLongPress} // 🌟 Paso B: Pasado al botón real
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

        <View style={[styles.progressTrack, { backgroundColor: colors.border, marginTop: spacing.s }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: purpleThemeColor, 
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
