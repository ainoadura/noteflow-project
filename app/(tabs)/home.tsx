// app/(tabs)/home.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    // SafeAreaView solves the cut-off title bug by applying an automatic system top margin inset
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: spacing.m }}>
        {/* Strictly enforce your custom product name branding header */}
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
      </View>
      
      <View style={{ flex: 1, paddingHorizontal: spacing.m }}>
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
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'No reviews match your search query.' : 'Your movie and book critique list is empty.'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold' },
  subtitle: { fontSize: 13 },
  searchInput: { height: 44, borderRadius: 8, borderWidth: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { textAlign: 'center' }
});
