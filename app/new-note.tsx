// app/new-note.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useNotesStore } from '../src/store/noteStore';
import { useTheme } from '../src/constants/theme';
import { ChecklistItem, IdeaNote, ChecklistNote } from '../src/types/index'; 

const standardSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(1, 'La nota rápida no puede estar vacía'),
});

const checklistSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
});

const ideaSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(1, 'El pensamiento no puede estar vacío'),
});

type FormType = 'standard' | 'checklist' | 'idea';

export default function NewNoteModal() {
  const router = useRouter();
  const { addIdea, addChecklist } = useNotesStore();
  const theme = useTheme();
  const colors = {
    background: theme?.colors?.background || '#0F0F10',
    surface: theme?.colors?.surface || '#1C1C1E',
    primary: theme?.colors?.primary || '#F59E0B',
    border: theme?.colors?.border || '#2C2C2E',
    text: theme?.colors?.text || '#FFFFFF',
    textSecondary: theme?.colors?.textSecondary || '#9CA3AF',
  };

  const spacing = {
    xs: theme?.spacing?.xs || 4,
    s: theme?.spacing?.s || 8,
    m: theme?.spacing?.m || 16,
    l: theme?.spacing?.l || 24,
  };

  const typography = {
    sizes: {
      s: theme?.typography?.sizes?.s || 14,
      xl: theme?.typography?.sizes?.xl || 22,
    }
  };

  const [formType, setFormType] = useState<FormType>('standard');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [color, setColor] = useState('#DCFCE7');

  const [errors, setErrors] = useState<{ 
    title?: string; 
    content?: string; 
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
      const result = standardSchema.safeParse({ title, content });
      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors;
        setErrors({
          title: formattedErrors.title?.[0],
          content: formattedErrors.content?.[0],
        });
        return;
      }

      const newQuickNote: IdeaNote = {
        id: `quick-${Date.now()}`,
        title: `${title.trim()} — ${content.trim()}`, 
        tags: ['Nota Rápida'],
        color: 'blue-electric',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addIdea(newQuickNote); 
      
    } else if (formType === 'checklist') {
      const result = checklistSchema.safeParse({ title });
      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors;
        setErrors({ title: formattedErrors.title?.[0] });
        return;
      }

      const newChecklistNote: ChecklistNote = {
        id: `chk-${Date.now()}`,
        title: title.trim(),
        items: checklistItems,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addChecklist(newChecklistNote); 
      
    } else if (formType === 'idea') {
      const result = ideaSchema.safeParse({ title, content });
      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors;
        setErrors({
          title: formattedErrors.title?.[0],
          content: formattedErrors.content?.[0],
        });
        return;
      }

      const newIdeaNote: IdeaNote = {
        id: `idea-${Date.now()}`,
        title: `${title.trim()}: ${content.trim()}`, 
        tags: ['Pensamiento'],
        color: color, 
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addIdea(newIdeaNote); 
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background || '#0F0F10' }]}
    >
      <ScrollView contentContainerStyle={{ padding: spacing.m }}>
        
        {/* Selector de Tipo (Standard, Checklist, Idea) */}
        <View style={[styles.selectorRow, { marginBottom: spacing.m }]}>
          {(['standard', 'checklist', 'idea'] as FormType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton, 
                { 
                  backgroundColor: formType === type ? (colors.primary || '#F59E0B') : (colors.surface || '#1C1C1E'),
                  borderColor: colors.border || '#2C2C2E'
                }
              ]}
              onPress={() => setFormType(type)}
            >
              <Text style={{ color: formType === type ? '#FFFFFF' : (colors.text || '#FFFFFF'), fontWeight: '600' }}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campo común: Título de la Nota Rápida */}
        <Text style={[styles.label, { color: colors.text || '#FFFFFF', fontSize: typography?.sizes?.s || 14 }]}>Title / Subject</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface || '#1C1C1E', color: colors.text || '#FFFFFF', borderColor: colors.border || '#2C2C2E', padding: spacing.s }]}
          placeholder="e.g., Quick thought, Watchlist advice, Gym task..."
          placeholderTextColor={colors.textSecondary || '#9CA3AF'}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        {/* RAMA ESTÁNDAR SIMPLIFICADA (Sin director, páginas ni estrellas) */}
        {formType === 'standard' && (
          <View style={{ marginTop: spacing.s }}>
            <Text style={[styles.label, { color: colors.text || '#FFFFFF', fontSize: typography?.sizes?.s || 14 }]}>Quick Note Content</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface || '#1C1C1E', color: colors.text || '#FFFFFF', borderColor: colors.border || '#2C2C2E', padding: spacing.s }]}
              placeholder="Write your rapid thoughts or recommendations here..."
              placeholderTextColor={colors.textSecondary || '#9CA3AF'}
              multiline
              numberOfLines={5}
              value={content}
              onChangeText={setContent}
            />
            {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
          </View>
        )}

        {/* RAMA CHECKLIST (Tareas rápidas) */}
        {formType === 'checklist' && (
          <View style={{ marginTop: spacing.s }}>
            <Text style={[styles.label, { color: colors.text || '#FFFFFF', fontSize: typography?.sizes?.s || 14 }]}>Items / Progress Checklist</Text>
            <View style={styles.addItemRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: colors.surface || '#1C1C1E', color: colors.text || '#FFFFFF', borderColor: colors.border || '#2C2C2E', padding: spacing.s, marginBottom: 0 }]}
                placeholder="e.g., Buy milk, Check episode 2..."
                placeholderTextColor={colors.textSecondary || '#9CA3AF'}
                value={newItemText}
                onChangeText={setNewItemText}
              />
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colors.primary || '#F59E0B', paddingHorizontal: spacing.m }]}
                onPress={handleAddItem}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>

            {checklistItems.map((item) => (
              <View key={item.id} style={[styles.itemBadge, { backgroundColor: colors.surface || '#1C1C1E', borderColor: colors.border || '#2C2C2E', padding: spacing.s }]}>
                <Text style={{ color: colors.text || '#FFFFFF' }}>• {item.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* RAMA IDEA / PENSAMIENTO SIMPLIFICADA */}
        {formType === 'idea' && (
          <View style={{ marginTop: spacing.s }}>
            <Text style={[styles.label, { color: colors.text || '#FFFFFF', fontSize: typography?.sizes?.s || 14 }]}>Brainstorm / Idea Concept</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface || '#1C1C1E', color: colors.text || '#FFFFFF', borderColor: colors.border || '#2C2C2E', padding: spacing.s }]}
              placeholder="Write down your recommendation idea or raw insight parameters..."
              placeholderTextColor={colors.textSecondary || '#9CA3AF'}
              multiline
              numberOfLines={5}
              value={content}
              onChangeText={setContent}
            />
            {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}

            <Text style={[styles.label, { color: colors.text || '#FFFFFF', fontSize: typography?.sizes?.s || 14, marginTop: spacing.s }]}>Visual Theme Color</Text>
            <View style={styles.colorRow}>
              {['#E0F2FE', '#FEF08A', '#FEE2E2', '#DCFCE7'].map((hex) => (
                <TouchableOpacity
                  key={hex}
                  style={[styles.colorCircle, { backgroundColor: hex, borderColor: color === hex ? (colors.primary || '#F59E0B') : '#00000000', borderWidth: 2 }]}
                  onPress={() => setColor(hex)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Botón Unificado de Guardado Rápido */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary || '#F59E0B', marginTop: spacing.l, padding: spacing.m }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  typeButton: { flex: 1, paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
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
});
