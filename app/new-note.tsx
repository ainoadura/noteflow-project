// app/new-note.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useNotesStore } from '../src/store/noteStore';
import { useTheme } from '../src/constants/theme';
import { Note, ChecklistNote, IdeaNote, ChecklistItem } from '../src/types';

// 1. Extended Zod schema validation to enforce the new catalog parameters
const noteSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(1, 'La reseña no puede estar vacía'),
  creatorName: z.string().min(1, 'El nombre del autor o director es obligatorio'),
  durationOrPages: z.string().min(1, 'Especifica la duración o número de páginas'),
  rating: z.number().min(1, 'La puntuación debe ser entre 1 y 5').max(5),
});

const checklistSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
});

const ideaSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  tagsString: z.string().min(1, 'Añade al menos una etiqueta separada por comas'),
  color: z.string().min(1, 'Selecciona un color de fondo'),
});

type FormType = 'standard' | 'checklist' | 'idea';

export default function NewNoteModal() {
  const router = useRouter();
  const { addNote } = useNotesStore();
  const { colors, spacing, typography } = useTheme();

  // Form local state management
  const [formType, setFormType] = useState<FormType>('standard');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // New specific culture metadata states
  const [creatorName, setCreatorName] = useState('');
  const [durationOrPages, setDurationOrPages] = useState('');
  const [rating, setRating] = useState<number>(5); // Default 5 stars

  const [color, setColor] = useState('#E0F2FE');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [tagsString, setTagsString] = useState('');

  // Local validation error message capture tracking state
  const [errors, setErrors] = useState<{ 
    title?: string; 
    content?: string; 
    creatorName?: string; 
    durationOrPages?: string;
    tagsString?: string;
  }>({});

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      text: newItemText.trim(),
      isCompleted: false
    };
    setChecklistItems([...checklistItems, newItem]);
    setNewItemText('');
  };

  const handleSave = () => {
    setErrors({});
    
    if (formType === 'standard') {
      // Validate including the new specific metadata keys strictly
      const result = noteSchema.safeParse({ title, content, creatorName, durationOrPages, rating });
      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors;
        setErrors({
          title: formattedErrors.title?.[0],
          content: formattedErrors.content?.[0],
          creatorName: formattedErrors.creatorName?.[0],
          durationOrPages: formattedErrors.durationOrPages?.[0],
        });
        return;
      }

      const newStandardNote: Note = {
        id: `note-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        creatorName: creatorName.trim(),
        durationOrPages: durationOrPages.trim(),
        rating,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addNote(newStandardNote);
      
    } else if (formType === 'checklist') {
      const result = checklistSchema.safeParse({ title });
      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors;
        setErrors({ title: formattedErrors.title?.[0] });
        return;
      }
      console.log('Saving Checklist Note', { title, checklistItems });
      
    } else if (formType === 'idea') {
      const result = ideaSchema.safeParse({ title, tagsString, color });
      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors;
        setErrors({
          title: formattedErrors.title?.[0],
          tagsString: formattedErrors.tagsString?.[0],
        });
        return;
      }
      const tagsArray = tagsString.split(',').map(t => t.trim()).filter(t => t !== '');
      console.log('Saving Idea Note', { title, tags: tagsArray, color });
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={{ padding: spacing.m }}>
        
        {/* Type Selector Tabs Segment */}
        <View style={[styles.selectorRow, { marginBottom: spacing.m }]}>
          {(['standard', 'checklist', 'idea'] as FormType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton, 
                { 
                  backgroundColor: formType === type ? colors.primary : colors.surface,
                  borderColor: colors.border 
                }
              ]}
              onPress={() => setFormType(type)}
            >
              <Text style={{ color: formType === type ? '#FFFFFF' : colors.text, fontWeight: '600' }}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Common Title Input Field */}
        <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s }]}
          placeholder="e.g., Inception, Dune..."
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        {/* Dynamic Branch Rendering: Standard Review Form with Media Metadata */}
        {formType === 'standard' && (
          <View style={{ marginTop: spacing.s }}>
            
            {/* Input for Director / Author */}
            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>Director / Author</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s }]}
              placeholder="e.g., Christopher Nolan, Frank Herbert..."
              placeholderTextColor={colors.textSecondary}
              value={creatorName}
              onChangeText={setCreatorName}
            />
            {errors.creatorName && <Text style={styles.errorText}>{errors.creatorName}</Text>}

            {/* Input for Duration / Pages */}
            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>Duration / Total Pages</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s }]}
              placeholder="e.g., 148 min, 600 pages..."
              placeholderTextColor={colors.textSecondary}
              value={durationOrPages}
              onChangeText={setDurationOrPages}
            />
            {errors.durationOrPages && <Text style={styles.errorText}>{errors.durationOrPages}</Text>}

            {/* Rating Selector Component Section */}
            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>Rating Score (1-5 Stars)</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.ratingButton, 
                    { backgroundColor: rating === num ? colors.primary : colors.surface, borderColor: colors.border }
                  ]}
                  onPress={() => setRating(num)}
                >
                  <Text style={{ color: rating === num ? '#FFFFFF' : colors.text, fontWeight: 'bold' }}>{num} ★</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Content Text Area */}
            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s, marginTop: spacing.s }]}>Review Analysis</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s }]}
              placeholder="Write your movie/book detailed critique..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={5}
              value={content}
              onChangeText={setContent}
            />
            {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
          </View>
        )}

        {/* Dynamic Branch Rendering: Checklist Watchlist Form */}
        {formType === 'checklist' && (
          <View style={{ marginTop: spacing.s }}>
            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>Episodes / Progress Checklist</Text>
            <View style={styles.addItemRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s, marginBottom: 0 }]}
                placeholder="e.g., Episode 1: Pilot"
                placeholderTextColor={colors.textSecondary}
                value={newItemText}
                onChangeText={setNewItemText}
              />
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colors.primary, paddingHorizontal: spacing.m }]}
                onPress={handleAddItem}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>

            {checklistItems.map((item) => (
              <View key={item.id} style={[styles.itemBadge, { backgroundColor: colors.surface, borderColor: colors.border, padding: spacing.s }]}>
                <Text style={{ color: colors.text }}>• {item.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Dynamic Branch Rendering: Quick Recommendation Idea Form */}
        {formType === 'idea' && (
          <View style={{ marginTop: spacing.s }}>
            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s }]}>Tags (Comma Separated)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, padding: spacing.s }]}
              placeholder="e.g., hidden-gem, scifi, masterpiece"
              placeholderTextColor={colors.textSecondary}
              value={tagsString}
              onChangeText={setTagsString}
            />
            {errors.tagsString && <Text style={styles.errorText}>{errors.tagsString}</Text>}

            <Text style={[styles.label, { color: colors.text, fontSize: typography.sizes.s, marginTop: spacing.s }]}>Visual Theme Color</Text>
            <View style={styles.colorRow}>
              {['#E0F2FE', '#FEF08A', '#FEE2E2', '#DCFCE7'].map((hex) => (
                <TouchableOpacity
                  key={hex}
                  style={[styles.colorCircle, { backgroundColor: hex, borderColor: color === hex ? colors.primary : 'transparent', borderWidth: 2 }]}
                  onPress={() => setColor(hex)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary, marginTop: spacing.l, padding: spacing.m }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>SAVE REGISTRATION</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  typeButton: { flex: 1, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  label: { fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: { height: 44, borderRadius: 8, borderWidth: 1, marginBottom: 4 },
  textArea: { height: 110, borderRadius: 8, borderWidth: 1, textAlignVertical: 'top', marginBottom: 4 },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '500', marginBottom: 8 },
  addItemRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  addButton: { height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  itemBadge: { borderRadius: 6, borderWidth: 1, marginBottom: 4 },
  colorRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  saveButton: { borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  ratingRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  ratingButton: { flex: 1, height: 38, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
});
