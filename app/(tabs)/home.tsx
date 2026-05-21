// app/(tabs)/home.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ListRenderItemInfo } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useNotesStore } from '../../src/store/noteStore';
import { useTheme } from '../../src/constants/theme';
import { Note } from '../../src/types';
import NoteCard from '../../components/items/NoteCard';

interface AcademicFlashListProps {
  data: Note[];
  renderItem: (info: ListRenderItemInfo<Note>) => React.ReactElement;
  estimatedItemSize: number;
  ListEmptyComponent?: React.ReactElement;
}

const EvaluatedFlashList = FlashList as unknown as React.ComponentType<AcademicFlashListProps>;

export default function HomeScreen() {
  const router = useRouter();
  const { notes, archivedIds } = useNotesStore();
  const { colors, spacing, typography } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');

  const activeNotes = notes.filter((n) => !archivedIds.includes(n.id));
  const filteredNotes = activeNotes.filter((n) => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.creatorName && n.creatorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.m }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.xl, marginBottom: spacing.s }]}>
        My Media Universe
      </Text>

      {/* Clean text input representation matching Android Java cast boundaries */}
      <TextInput
        style={[
          styles.searchInput, 
          { 
            backgroundColor: colors.surface, 
            color: colors.text, 
            borderColor: colors.border, 
            paddingHorizontal: spacing.s,
            marginBottom: spacing.m 
          }
        ]}
        placeholder="Search reviews by title or director..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <EvaluatedFlashList
        data={filteredNotes}
        renderItem={({ item }: ListRenderItemInfo<Note>) => (
          <NoteCard 
            note={item} 
            onPress={() => router.push(`/note/${item.id}`)}
          />
        )}
        estimatedItemSize={110}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {searchQuery ? 'No reviews match your search query.' : 'Your cultural catalog library is currently empty.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold' },
  subtitle: { textAlign: 'center' },
  searchInput: { height: 44, borderRadius: 8, borderWidth: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
});
