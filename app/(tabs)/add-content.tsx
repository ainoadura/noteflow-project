// app/(tabs)/add-content.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import { MediaCategory, Note } from '../../src/types/index';
import { useRouter } from 'expo-router';

const RATING_STARS = [1, 2, 3, 4, 5];

export default function AddContentScreen() {
  const router = useRouter();
  const { colors, spacing, typography, borderRadius } = useTheme();
  const { lists, addNote, createCustomList } = useNotesStore();

  const [category, setCategory] = useState<MediaCategory>('movie');
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState(''); 
  const [durationOrPages, setDurationOrPages] = useState(''); 
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [selectedListId, setSelectedListId] = useState('list-all');

  const [newListName, setNewListName] = useState('');

  const handleCreateListOnTheFly = () => {
    if (!newListName.trim()) return;
    const generatedId = createCustomList(newListName.trim());
    setSelectedListId(generatedId); 
    setNewListName('');
  };

  const handleSaveMedia = () => {
    if (!title.trim() || !content.trim()) return;

    const newMediaPost: Note = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      creatorName: creatorName.trim(),
      durationOrPages: durationOrPages.trim(),
      rating,
      listId: selectedListId, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addNote(newMediaPost);
    
    setTitle('');
    setCreatorName('');
    setDurationOrPages('');
    setContent('');

    router.replace('/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background || '#0F0F10' }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.m }} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.xs }]}>
              Page & Frame
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: spacing.m }]}>
              Catalog and review your books, movies and series
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>CATEGORY</Text>
          <View style={[styles.selectorRow, { marginBottom: spacing.m }]}>
            {(['movie', 'tv-show', 'book'] as MediaCategory[]).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.typeButton, 
                  { 
                    backgroundColor: category === cat ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.m  
                  }
                ]}
                onPress={() => {
                  setCategory(cat);
                  setCreatorName('');
                  setDurationOrPages('');
                }}
              >
                <Text style={{ color: category === cat ? colors.background : colors.text, fontWeight: 'bold', fontSize: 12 }}>
                  {cat === 'tv-show' ? 'TV SHOW' : cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>TITLE</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s, borderRadius: borderRadius.m }]}
            placeholder="e.g., Inception, Breaking Bad, Drácula..."
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
          />

          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>
            {category === 'book' ? 'AUTHOR' : 'DIRECTOR'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s, borderRadius: borderRadius.m }]}
            placeholder={category === 'book' ? "e.g., Bram Stoker" : "e.g., Christopher Nolan"}
            placeholderTextColor={colors.textSecondary}
            value={creatorName}
            onChangeText={setCreatorName}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>
            {category === 'movie' ? 'DURATION (MINUTES)' : category === 'tv-show' ? 'NUMBER OF EPISODES' : 'TOTAL PAGES'}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s, borderRadius: borderRadius.m }]}
            placeholder={category === 'movie' ? "e.g., 148 min" : category === 'tv-show' ? "e.g., 62 episodes" : "e.g., 418 pages"}
            placeholderTextColor={colors.textSecondary}
            value={durationOrPages}
            onChangeText={setDurationOrPages}
          />
          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>RATING SCORE</Text>
          <View style={[styles.ratingRow, { marginBottom: spacing.m }]}>
            {RATING_STARS.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.ratingButton, 
                  { 
                    backgroundColor: rating === num ? colors.primary : colors.surface, 
                    borderColor: colors.border,
                    borderRadius: borderRadius.m
                  }
                ]}
                onPress={() => setRating(num)}
              >
                <Text style={{ color: rating === num ? colors.background : colors.text, fontWeight: 'bold' }}>{num} ★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>ASSIGN TO PLAYLIST / COLLECTION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listsScroll}>
            {lists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={[
                  styles.listChip, 
                  { 
                    backgroundColor: selectedListId === list.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.full,
                    marginRight: spacing.s
                  }
                ]}
                onPress={() => setSelectedListId(list.id)}
              >
                <Text style={{ color: selectedListId === list.id ? colors.background : colors.text, fontSize: 12, fontWeight: '600' }}>
                  {list.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.inlineListContainer, { backgroundColor: colors.surface, padding: spacing.s, borderRadius: borderRadius.m, marginBottom: spacing.m, borderColor: colors.border, borderWidth: 1 }]}>
            <TextInput
              style={[styles.smallInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, padding: spacing.s, borderRadius: borderRadius.m }]}
              placeholder="New playlist name..."
              placeholderTextColor={colors.textSecondary}
              value={newListName}
              onChangeText={setNewListName}
            />
            <TouchableOpacity 
              style={[styles.inlineAddButton, { backgroundColor: colors.primary, borderRadius: borderRadius.m }]}
              onPress={handleCreateListOnTheFly}
            >
              <Text style={[styles.inlineAddButtonText, { color: colors.background }]}>CREATE LIST</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>CRITIQUE REVIEW NOTES</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s, borderRadius: borderRadius.m }]}
            placeholder="Write your review insights parameters here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={setContent}
          />

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary, marginTop: spacing.s, borderRadius: borderRadius.m, padding: spacing.m }]}
            onPress={handleSaveMedia}
          >
            <Text style={[styles.saveButtonText, { color: colors.background }]}>SAVE</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { marginTop: 8 },
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 13 },
  label: { fontWeight: 'bold', marginBottom: 6, marginTop: 4, letterSpacing: 0.3 },
  input: { height: 44, borderWidth: 1, marginBottom: 12, fontSize: 14 },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  typeButton: { flex: 1, height: 42, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  ratingRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  ratingButton: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  listsScroll: { flexDirection: 'row', marginBottom: 12, marginTop: 4 },
  listChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  inlineListContainer: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  smallInput: { flex: 1, height: 38, borderWidth: 1 },
  inlineAddButton: { height: 38, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center' },
  inlineAddButtonText: { fontSize: 11, fontWeight: 'bold' },
  textArea: { height: 90, borderWidth: 1, textAlignVertical: 'top', marginBottom: 12 },
  saveButton: { alignItems: 'center' },
  saveButtonText: { fontWeight: 'bold', fontSize: 14 },
});
