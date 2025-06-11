export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isFavorite?: boolean;
}

export type SortOption = 'updatedAt' | 'createdAt' | 'title' | 'favorite';
export type SortDirection = 'asc' | 'desc';

export interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  isPreviewMode: boolean;
  sortBy: SortOption;
  sortDirection: SortDirection;
  lastSaved: Date | null;
  isAutoSaving: boolean;
  showWelcome: boolean;
  
  // Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  togglePreviewMode: () => void;
  setSortBy: (sortBy: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleFavorite: (id: string) => void;
  setAutoSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  dismissWelcome: () => void;
  getFilteredNotes: () => Note[];
  getActiveNote: () => Note | null;
  getSortedNotes: (notes: Note[]) => Note[];
}
