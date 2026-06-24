// src/store/noteStore.ts
import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { Note, ChecklistNote, IdeaNote, CustomMediaList, ChecklistItem } from '../types/index';
import { getNotes, createNote as apiCreateNote } from '../lib/api';

interface NotesStore {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  archivedIds: string[];
  lists: CustomMediaList[]; 
  isLoading: boolean;
  error: string | null;

  fetchNotes: () => Promise<void>;
  addNote: (note: Note) => void;
  addChecklist: (checklist: ChecklistNote) => void;
  addIdea: (idea: IdeaNote) => void;
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

export const useNotesStore = create<NotesStore>()((set, get) => ({
  notes: [],
  checklists: [],
  ideas: [],
  archivedIds: [],
  lists: defaultLists,
  isLoading: false,
  error: null,

    fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const allNotesFromBackend = await getNotes();

      const standardNotes: Note[] = [];
      const checklistNotes: ChecklistNote[] = [];
      const ideaNotes: IdeaNote[] = [];

      allNotesFromBackend.forEach((raw: any) => {
        const base = {
          id: raw.id,
          title: raw.title,
          createdAt: raw.created_at,
          updatedAt: raw.updated_at,
        };

        if (raw.type === 'standard') {
          standardNotes.push({
            ...base,
            content: raw.content ?? '',
            listId: raw.list_id
          });
        } else if (raw.type === 'checklist') {
          // SOLUCIÓN: Si raw.items es null o undefined, usamos un array vacío seguro
          const rawItems = raw.items && Array.isArray(raw.items) ? raw.items : [];
          
          // Además, filtramos por si acaso la base de datos metió un objeto vacío debido al LEFT JOIN
          const validItems = rawItems.filter((item: any) => item && item.id);

          const formattedItems: ChecklistItem[] = validItems.map((item: any) => ({
            id: item.id,
            text: item.text,
            isCompleted: !!item.is_completed
          }));

          checklistNotes.push({
            ...base,
            items: formattedItems
          });
        } else if (raw.type === 'idea') {
          ideaNotes.push({
            ...base,
            tags: raw.tags && Array.isArray(raw.tags) ? raw.tags : [],
            color: raw.color ?? '#FFFFFF'
          });
        }
      });

      set({
        notes: standardNotes,
        checklists: checklistNotes,
        ideas: ideaNotes,
        isLoading: false
      });
    } catch (err) {
      console.error("Error real interceptado:", err);
      set({ error: 'Error al conectar con el servidor', isLoading: false });
    }
  },

  addNote: (note) => set((state) => ({ 
    notes: [note, ...state.notes] 
  })),

  addChecklist: (checklist) => set((state) => ({
    checklists: [checklist, ...state.checklists]
  })),

  addIdea: (idea) => set((state) => ({
    ideas: [idea, ...state.ideas]
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
}));
