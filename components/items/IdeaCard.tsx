// components/items/IdeaCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { IdeaNote } from '../../src/types';
import { useTheme } from '../../src/constants/theme';

interface IdeaCardProps {
  note: IdeaNote;
  onPress?: () => void;
}

const AnimatedCardContainer = Animated.View as React.ComponentType<any>;

export default function IdeaCard({ note, onPress }: IdeaCardProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <AnimatedCardContainer entering={FadeInDown} exiting={FadeOutLeft}>
      <TouchableOpacity
        style={[
          styles.card, 
          { 
            backgroundColor: note.color || colors.surface, 
            padding: spacing.m, 
            marginBottom: spacing.s 
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.m }]}>
          {note.title}
        </Text>

        {/* Render Tags as Chips if present */}
        {note.tags && note.tags.length > 0 && (
          <View style={[styles.tagsContainer, { marginTop: spacing.s }]}>
            {note.tags.map((tag, index) => (
              <View 
                key={index} 
                /* Eliminamos la concatenación conflictiva de strings y aplicamos un color plano con opacidad limpia */
                style={[styles.chip, { backgroundColor: colors.border, opacity: 0.8, marginRight: spacing.xs }]}
              >
                <Text style={[styles.chipText, { color: colors.text, fontSize: typography.sizes.s }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </AnimatedCardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontWeight: '500',
  },
});
