export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  isPreviewMode: boolean;
  
  // Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  togglePreviewMode: () => void;
  getFilteredNotes: () => Note[];
  getActiveNote: () => Note | null;
}
