// app/(tabs)/ideas.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import IdeaCard from '../../components/items/IdeaCard'; 
import ChecklistCard from '../../components/items/ChecklistCard'; 
import { IdeaNote, ChecklistNote } from '../../src/types/index';

type CombinedQuickNoteItem = 

  | (IdeaNote & { itemType: 'idea' })
  | (ChecklistNote & { itemType: 'checklist' });

export default function IdeasScreen() {
  const router = useRouter();
  const { ideas, checklists, deleteNote } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  const combinedQuickNotes: CombinedQuickNoteItem[] = [
    ...ideas.map((idea): CombinedQuickNoteItem => ({ ...idea, itemType: 'idea' })),
    ...checklists.map((chk): CombinedQuickNoteItem => ({ ...chk, itemType: 'checklist' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleLongPressDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Quick Registration',
      `Are you sure you want to permanently delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteNote(id) 
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'left', 'right']}>
        <View style={{ height: '100%', width: '100%' }}>
          
          {/* Cabecera */}
          <View style={{ paddingHorizontal: spacing.m, paddingTop: spacing.s }}>
            <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.xs }]}>
              Page & Frame
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: spacing.m }]}>
              Quick recommendations, thoughts and checklists captured
            </Text>
          </View>
          
          {/* Listado Unificado Estricto */}
          <View style={{ flex: 1, paddingHorizontal: spacing.m, paddingBottom: 120 }}>
            <FlashList
              data={combinedQuickNotes}
              estimatedItemSize={90}
              keyExtractor={(item: CombinedQuickNoteItem) => item.id}
              renderItem={({ item }: { item: CombinedQuickNoteItem }) => {
                if (item.itemType === 'checklist') {
                  return (
                    <ChecklistCard 
                      note={item} 
                      onPress={() => router.push(`/note/${item.id}`)}
                      onLongPress={() => handleLongPressDelete(item.id, item.title)}
                    />
                  );
                }
                return (
                  <IdeaCard 
                    note={item} 
                    onPress={() => router.push(`/note/${item.id}`)} 
                    onLongPress={() => handleLongPressDelete(item.id, item.title)}
                  />
                );
              }}
              ListEmptyComponent={
                <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginTop: 40 }]}>
                  No quick notes captured yet.
                </Text>
              }
            />
          </View>

          {/* Botón Flotante "+" Circular */}
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={() => {
              router.push('/new-note');
            }}
          >
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 13 },
  fabButton: {
    position: 'absolute',
    bottom: 80, 
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
