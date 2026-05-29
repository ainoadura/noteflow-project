// components/items/NoteCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { Note } from '../../src/types/index'; // Sincronizado con tu archivo index
import { useTheme } from '../../src/constants/theme';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
}

// 📐 ELIMINADO EL ÚLTIMO ANY: Tipado genérico estricto y compatible de Reanimated
const AnimatedCardContainer = Animated.View as React.ComponentType<Record<string, unknown>>;

export default function NoteCard({ note, onPress }: NoteCardProps) {
  const { colors, spacing, typography, borderRadius } = useTheme();
  
  // Salvaguarda para asegurar que la fecha no rompa el tipado si viene en formato string
  const formattedDate = new Date(note.createdAt).toLocaleDateString();

  const getCategoryColor = (): string => {
    if (note.category === 'movie') return colors.movies || '#FF4B4B';
    if (note.category === 'tv-show') return colors.series || '#8B5CF6';
    return colors.books || '#10B981';
  };

  const getCategoryLabel = () => {
    if (note.category === 'tv-show') return 'TV SHOW';
    return note.category?.toUpperCase() || 'GENERAL';
  };

  const cardTitleSize = typography?.sizes?.m || 16;
  const cardMetaSize = typography?.sizes?.s || 14;

  return (
    <AnimatedCardContainer entering={FadeInDown} exiting={FadeOutLeft}>
      <TouchableOpacity
        style={[
          styles.card, 
          { 
            backgroundColor: colors.surface || '#1C1C1E', 
            padding: spacing.m, 
            marginBottom: spacing.s, 
            borderRadius: borderRadius.m,
            borderWidth: 1,
            borderColor: colors.border || '#2C2C2E'
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text, fontSize: cardTitleSize }]} numberOfLines={1}>
            {note.title}
          </Text>
          <View style={[styles.tag, { borderColor: getCategoryColor() }]}>
            <Text style={[styles.tagText, { color: getCategoryColor() }]}>
              {getCategoryLabel()}
            </Text>
          </View>
        </View>

        <Text style={[styles.meta, { color: colors.textSecondary, fontSize: cardMetaSize, marginTop: 4 }]}>
          {note.creatorName} • {note.durationOrPages} • <Text style={{ color: colors.star || '#F59E0B' }}>{note.rating} ★</Text>
        </Text>

        <Text style={[styles.content, { color: colors.textSecondary, marginTop: spacing.s, fontSize: cardMetaSize }]} numberOfLines={2}>
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
  card: { width: '100%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontWeight: 'bold', flex: 1 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  tagText: { fontSize: 10, fontWeight: 'bold' },
  meta: { fontWeight: '500' },
  content: { lineHeight: 18 },
  date: { fontSize: 11, textAlign: 'right' },
});
