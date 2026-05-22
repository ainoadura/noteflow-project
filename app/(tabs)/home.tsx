// app/(tabs)/home.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import NoteCard from '../../components/items/NoteCard';

export default function HomeScreen() {
  const router = useRouter();
  // Nos traemos las notas, las listas y la nueva acción de borrado del store global
  const { notes, archivedIds, lists, deleteCustomList } = useNotesStore();
  const { colors, spacing, typography } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState('list-all');

  const activeNotes = notes.filter((n) => !archivedIds.includes(n.id));
  
  const collectionNotes = activeNotes.filter((n) => {
    if (selectedListId === 'list-all') return true; 
    return n.listId === selectedListId;
  });

  const filteredNotes = collectionNotes.filter((n) => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.creatorName && n.creatorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Función para gestionar el borrado con la alerta emergente nativa
  const handleLongPressList = (listId: string, listName: string) => {
    // No permitimos borrar la librería general para que siempre haya un contenedor base seguro
    if (listId === 'list-all') return;

    Alert.alert(
      'Delete Library',
      `Are you sure you want to delete "${listName}"? Any reviews inside will be moved back to General Library.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Si borramos la lista que está actualmente seleccionada, devolvemos el foco a 'list-all'
            if (selectedListId === listId) {
              setSelectedListId('list-all');
            }
            deleteCustomList(listId);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
        
        <View style={{ paddingHorizontal: spacing.m, paddingTop: spacing.s }}>
          <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.xs }]}>
            Page & Frame
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: spacing.m }]}>
            Your comprehensive cultural review catalog
          </Text>

          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, paddingHorizontal: spacing.s, marginBottom: spacing.m }]}
            placeholder="Search reviews by title or director..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Selector Horizontal de Listas / Playlists */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listsScroll}>
            {lists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={[
                  styles.listChip, 
                  { 
                    backgroundColor: selectedListId === list.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderRadius: 20,
                    marginRight: spacing.s
                  }
                ]}
                onPress={() => setSelectedListId(list.id)}
                onLongPress={() => handleLongPressList(list.id, list.name)} // <-- SE ACTIVA AL MANTENER PULSADO
                delayLongPress={600} // Tiempo en milisegundos que el usuario debe dejar el dedo puesto
                activeOpacity={0.7}
              >
                <Text style={{ color: selectedListId === list.id ? colors.background : colors.text, fontSize: 12, fontWeight: '600' }}>
                  {list.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={{ flex: 1, paddingHorizontal: spacing.m }}>
          <FlashList
            data={filteredNotes}
            estimatedItemSize={110}
            renderItem={({ item }) => (
              <NoteCard 
                note={item} 
                onPress={() => router.push(`/note/${item.id}`)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {searchQuery 
                    ? 'No reviews match your search query.' 
                    : 'This collection playlist is empty.'}
                </Text>
              </View>
            }
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 13 },
  searchInput: { height: 44, borderRadius: 8, borderWidth: 1 },
  listsScroll: { flexDirection: 'row', marginBottom: 16, marginTop: 4 },
  listChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { textAlign: 'center' }
});
