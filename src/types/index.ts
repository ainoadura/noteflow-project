// src/types/index.ts

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface BaseNote {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Añadimos el tipo de categorías que usa tu formulario dinámico
export type MediaCategory = 'movie' | 'tv-show' | 'book';

// Extended strictly to support real movie/book metadata criteria for Page & Frame
export interface Note extends BaseNote {
  content: string;
  category?: MediaCategory;    // <-- LA HACEMOS LEGAL AQUÍ COMO OPCIONAL
  creatorName?: string;         // Author for books, Director for movies
  rating?: number;              // Score from 1 to 5 stars
  durationOrPages?: string;     // e.g., "120 min" or "350 pages"
  listId?: string;              // Soportar el mapeo de colecciones
}

export interface ChecklistNote extends BaseNote {
  items: ChecklistItem[];
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
}

// Añadimos la interfaz de tus listas personalizadas
export interface CustomMediaList {
  id: string;
  name: string;
  isDefault: boolean;
}

export type AnyNote = Note | ChecklistNote | IdeaNote;

export function isChecklistNote(note: AnyNote): note is ChecklistNote {
  return 'items' in note;
}

export function isIdeaNote(note: AnyNote): note is IdeaNote {
  return 'tags' in note;
}

export function isStandardNote(note: AnyNote): note is Note {
  return !('items' in note) && !('tags' in note);
}
