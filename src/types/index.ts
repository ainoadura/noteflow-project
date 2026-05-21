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

// Extended to support real movie/book metadata criteria for Page & Frame
export interface Note extends BaseNote {
  content: string;
  creatorName?: string;    // Author for books, Director for movies
  rating?: number;         // Score from 1 to 5 stars
  durationOrPages?: string; // e.g., "120 min" or "350 pages"
}

export interface ChecklistNote extends BaseNote {
  items: ChecklistItem[];
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
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
