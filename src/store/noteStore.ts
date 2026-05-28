// src/store/noteStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Note, ChecklistNote, IdeaNote, CustomMediaList } from '../types';

interface NotesStore {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  archivedIds: string[];
  lists: CustomMediaList[]; 
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  toggleArchiveNote: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  createCustomList: (name: string) => string; 
  deleteCustomList: (id: string) => void; 
}

const defaultLists: CustomMediaList[] = [
  { id: 'list-all', name: 'General Library', isDefault: true },
  { id: 'list-favs', name: 'Favorites Collection', isDefault: true },
  { id: 'list-pending', name: 'Pending Watchlist', isDefault: true },
];

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      checklists: [],
      ideas: [],
      archivedIds: [],
      lists: defaultLists,
      
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

          const total = updatedItems.length;
          const completed = updatedItems.filter((i) => i.isCompleted).length;
          if (total > 0 && completed === total) {
            isNowFullyCompleted = true;
          }

          return { ...c, items: updatedItems };
        });

        if (isNowFullyCompleted) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }

        return { checklists: updatedChecklists };
      }),

      createCustomList: (name) => {
        const newId = `list-${Date.now()}`;
        set((state) => ({
          lists: [...state.lists, { id: newId, name, isDefault: false }]
        }));
        return newId; 
      },

      deleteCustomList: (id) => set((state) => {
        if (id === 'list-all') return {};

        return {
          lists: state.lists.filter((l) => l.id !== id),
          notes: state.notes.map((n) => 
            n.listId === id ? { ...n, listId: 'list-all' } : n
          )
        };
      })
    }),
    {
      name: 'noteflow-universe-storage-final', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

