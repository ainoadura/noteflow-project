// src/store/noteStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Note, ChecklistNote, IdeaNote } from '../types';

interface NotesStore {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  archivedIds: string[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  toggleArchiveNote: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      checklists: [],
      ideas: [],
      archivedIds: [],
      
      addNote: (note) => set((state) => ({ 
        notes: [note, ...state.notes] 
      })),
      
      deleteNote: (id) => set((state) => ({ 
        notes: state.notes.filter((n) => n.id !== id),
        checklists: state.checklists.filter((c) => c.id !== id),
        ideas: state.ideas.filter((i) => i.id !== id),
        archivedIds: state.archivedIds.filter((aid) => aid !== id)
      })),

      toggleArchiveNote: (id) => set((state) => {
        const isArchived = state.archivedIds.includes(id);
        const updatedArchived = isArchived 
          ? state.archivedIds.filter((aid) => aid !== id)
          : [...state.archivedIds, id];
        return { archivedIds: updatedArchived };
      }),
      
      toggleChecklistItem: (checklistId, itemId) => set((state) => {
        let isNowFullyCompleted = false;

        const updatedChecklists = state.checklists.map((c) => {
          if (c.id !== checklistId) return c;

          const updatedItems = c.items.map((i) => 
            i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
          );

          // Check if all criteria objects are marked true following the execution rule
          const total = updatedItems.length;
          const completed = updatedItems.filter((i) => i.isCompleted).length;
          if (total > 0 && completed === total) {
            isNowFullyCompleted = true;
          }

          return { ...c, items: updatedItems };
        });

        // Trigger native notification feedback asynchronously upon success conditions
        if (isNowFullyCompleted) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }

        return { checklists: updatedChecklists };
      }),
    }),
    {
      name: 'noteflow-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
