// app/note/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';

export default function MediaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { notes, deleteNote, toggleArchiveNote, archivedIds } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  const currentNote = notes.find((n) => n.id === id);
  const isArchived = archivedIds.includes(id || '');

  if (!currentNote) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Review content entry not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you absolutely sure you want to permanently erase this review from your catalog?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            router.back();
            deleteNote(currentNote.id);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: spacing.m }}>
      <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.xl }]}>
        {currentNote.title}
      </Text>
      
      <View style={[styles.metadataContainer, { backgroundColor: colors.surface, padding: spacing.m, marginTop: spacing.m, borderRadius: 10 }]}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Director/Author: {currentNote.creatorName}</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 4 }}>Length: {currentNote.durationOrPages}</Text>
        <Text style={{ color: colors.primary, fontWeight: 'bold', marginTop: 4 }}>Score: {currentNote.rating} / 5 ★</Text>
      </View>

      <Text style={[styles.bodyText, { color: colors.text, marginTop: spacing.l, fontSize: typography.sizes.m }]}>
        {currentNote.content}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => {
            router.back();
            toggleArchiveNote(currentNote.id);
          }}
        >
          <Text style={{ color: colors.text, fontWeight: '600' }}>{isArchived ? 'UNARCHIVE' : 'ARCHIVE'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EF4444' }]} onPress={handleDelete}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>DELETE POST</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: 'bold' },
  metadataContainer: { borderWidth: 1, borderColor: 'transparent' },
  bodyText: { lineHeight: 24 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 40 },
  actionButton: { flex: 1, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
});
