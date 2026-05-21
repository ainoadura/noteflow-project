// components/items/NoteCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Note } from '../../src/types';
import { useTheme } from '../../src/constants/theme';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
}

export default function NoteCard({ note, onPress }: NoteCardProps) {
  const { colors, spacing, typography } = useTheme();
  
  // Format the Date safely for display
  const formattedDate = new Date(note.createdAt).toLocaleDateString();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, padding: spacing.m, marginBottom: spacing.s }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.m }]}>
        {note.title}
      </Text>
      
      {/* Show only the beginning of the review content (truncated) */}
      <Text 
        style={[styles.content, { color: colors.textSecondary, marginTop: spacing.xs, fontSize: typography.sizes.s }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {note.content || 'No review content added yet.'}
      </Text>
      
      <Text style={[styles.date, { color: colors.textSecondary, marginTop: spacing.s }]}>
        {formattedDate}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    textAlign: 'right',
  },
});
