// components/items/NoteCard.tsx
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { Note } from '../../src/types';
import { useTheme } from '../../src/constants/theme';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
}

// Forzamos el tipado limpio para que acepte componentes hijos en las animaciones de Windows
const AnimatedCardContainer = Animated.View as React.ComponentType<any>;

export default function NoteCard({ note, onPress }: NoteCardProps) {
  const { colors, spacing, typography } = useTheme();
  const formattedDate = new Date(note.createdAt).toLocaleDateString();

  return (
    <AnimatedCardContainer entering={FadeInDown} exiting={FadeOutLeft}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, padding: spacing.m, marginBottom: spacing.s }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.m }]}>
          {note.title}
        </Text>
        <Text style={[styles.meta, { color: colors.primary, fontSize: typography.sizes.s, marginTop: 2 }]}>
          {note.creatorName} • {note.durationOrPages} • {note.rating} ★
        </Text>
        <Text style={[styles.content, { color: colors.textSecondary, marginTop: spacing.xs, fontSize: typography.sizes.s }]} numberOfLines={2}>
          {note.content}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary, marginTop: spacing.s }]}>
          {formattedDate}
        </Text>
      </TouchableOpacity>
    </AnimatedCardContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12 },
  title: { fontWeight: 'bold' },
  meta: { fontWeight: '500' },
  content: { lineHeight: 18 },
  date: { fontSize: 11, textAlign: 'right' },
});
