// Item structure for checklists (e.g., episodes of a series)
export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

// 1. Base interface with strict common fields
export interface BaseNote {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Standard Note interface for movie/book reviews
export interface Note extends BaseNote {
  content: string;
}

// 3. Checklist interface for tracking episodes or reading progress
export interface ChecklistNote extends BaseNote {
  items: ChecklistItem[];
}

// 4. Quick Idea interface with tags and colors for recommendations
export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
}

// 5. Explicit Union Type required by the specification
export type AnyNote = Note | ChecklistNote | IdeaNote;

/**
 * 6. Official Type Guards to distinguish note models at runtime
 * As required by the guidelines, these functions return a type predicate
 */
export function isChecklistNote(note: AnyNote): note is ChecklistNote {
  return 'items' in note;
}

export function isIdeaNote(note: AnyNote): note is IdeaNote {
  return 'tags' in note;
}

export function isStandardNote(note: AnyNote): note is Note {
  return !('items' in note) && !('tags' in note);
}
