// components/items/IdeaCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated'; 
import { IdeaNote } from '../../src/types/index'; 
import { useTheme } from '../../src/constants/theme';

interface IdeaCardProps {
  note: IdeaNote;
  onPress?: () => void;
  onLongPress?: () => void; 
}

const AnimatedCardContainer = Animated.View as React.ComponentType<Record<string, unknown>>;

export default function IdeaCard({ note, onPress, onLongPress }: IdeaCardProps) {
  const { colors, spacing, typography } = useTheme();

  const isBlueElectric = note.color === 'blue-electric';
  const cardBgColor = isBlueElectric ? '#1C1C1E' : (note.color || colors.surface);
  const borderColor = isBlueElectric ? '#007AFF' : (note.color === 'green-flash' ? '#34C759' : colors.border);

  return (
    <AnimatedCardContainer entering={FadeInDown} exiting={FadeOutLeft}>
      <TouchableOpacity
        style={[
          styles.card, 
          { 
            backgroundColor: cardBgColor, 
            padding: spacing.m, 
            marginBottom: spacing.s,
            borderWidth: isBlueElectric || note.color === 'green-flash' ? 1.5 : 1,
            borderColor: borderColor
          }
        ]}
        onPress={onPress}
        onLongPress={onLongPress} 
        activeOpacity={0.8}
      >
        <Text style={[styles.title, { color: isBlueElectric ? colors.text : '#1F2937', fontSize: typography.sizes.m }]}>
          {note.title}
        </Text>

        {note.tags && note.tags.length > 0 && (
          <View style={[styles.tagsContainer, { marginTop: spacing.s }]}>
            {note.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[
                  styles.chip, 
                  { 
                    backgroundColor: isBlueElectric ? colors.border : 'rgba(0, 0, 0, 0.08)', 
                    marginRight: spacing.xs 
                  }
                ]}
              >
                <Text style={[styles.chipText, { color: isBlueElectric ? colors.text : '#4B5563', fontSize: typography.sizes.s }]}>
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
