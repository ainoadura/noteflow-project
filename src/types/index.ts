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

// 1. Extended strictly to support your dropdown categories inside the academic Note type
export type MediaCategory = 'movie' | 'tv-show' | 'book';

export interface Note extends BaseNote {
  content: string;
  category?: MediaCategory;     // 'movie' | 'tv-show' | 'book'
  creatorName?: string;         // Director for movies/series, Author for books
  durationOrPages?: string;     // e.g., "148 min", "10 episodes" or "400 pages"
  rating?: number;              // 1 to 5 stars
  listId?: string;              // Connects this post to a specific custom playlist container
}

export interface ChecklistNote extends BaseNote {
  items: ChecklistItem[];
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
}

// 2. Structural Custom Playlists supporting creation on the fly
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
