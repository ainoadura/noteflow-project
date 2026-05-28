// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useRouter } from 'expo-router';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import { Note } from '../../src/types'; 
import NoteCard from '../../components/items/NoteCard';

export default function HomeScreen() {
  const router = useRouter();
  const { notes, archivedIds, lists, deleteCustomList } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  const fontSizeXL = typography?.sizes?.xl || 28;
  const fontSizeM = typography?.sizes?.m || 16;

  const activeNotes = notes.filter((n) => !archivedIds.includes(n.id));

  const handleLongPressList = (listId: string, listName: string) => {
    if (listId === 'list-all') return;

    Alert.alert(
      'Delete Library',
      `Are you sure you want to delete "${listName}"? Any reviews inside will be moved back to General Library.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteCustomList(listId)
        }
      ]
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
        
        <View style={{ paddingHorizontal: spacing.m, paddingTop: spacing.s, marginBottom: spacing.m }}>
          <Text style={[styles.title, { color: colors.primary, fontSize: fontSizeXL }]}>
            Page & Frame
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 140 }} 
          showsVerticalScrollIndicator={false}
        >
          {lists.map((list) => {
            const currentCollectionNotes = activeNotes.filter((n) => {
              if (list.id === 'list-all') return true; 
              const noteListId = n.listId || 'list-all'; 
              return noteListId === list.id;
            });

            return (
              <View key={list.id} style={styles.listSection}>
                
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onLongPress={() => handleLongPressList(list.id, list.name)}
                  delayLongPress={600}
                  style={{ paddingHorizontal: spacing.m, marginBottom: spacing.s }}
                >
                  <Text style={[styles.listTitle, { color: colors.text, fontSize: fontSizeM }]}>
                    {list.name} <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '400' }}>({currentCollectionNotes.length})</Text>
                  </Text>
                </TouchableOpacity>

                {currentCollectionNotes.length > 0 ? (
                  <View style={{ paddingHorizontal: spacing.m }}>
                    {currentCollectionNotes.map((item: Note) => (
                      <NoteCard 
                        key={item.id}
                        note={item} 
                        onPress={() => router.push(`/note/${item.id}`)}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={{ paddingHorizontal: spacing.m }}>
                    <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        This collection playlist is currently empty.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontWeight: 'bold' 
  },
  listSection: { 
    marginBottom: 24 
  },
  listTitle: { 
    fontWeight: 'bold', 
    letterSpacing: 0.3 
  },
  emptyBox: { 
    padding: 16, 
    borderRadius: 8, 
    borderWidth: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emptyText: { 
    fontSize: 13, 
    textAlign: 'center' 
  }
});
