import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteStore } from '@/types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      searchQuery: '',
      isPreviewMode: false,

      addNote: (noteData) => {
        const newNote: Note = {
          id: generateId(),
          ...noteData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => {
          const remainingNotes = state.notes.filter((note) => note.id !== id);
          const newActiveId = state.activeNoteId === id 
            ? (remainingNotes.length > 0 ? remainingNotes[0].id : null)
            : state.activeNoteId;
          
          return {
            notes: remainingNotes,
            activeNoteId: newActiveId,
          };
        });
      },

      setActiveNote: (id) => {
        set({ activeNoteId: id });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      togglePreviewMode: () => {
        set((state) => ({ isPreviewMode: !state.isPreviewMode }));
      },

      getFilteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery.trim()) return notes;
        
        const query = searchQuery.toLowerCase();
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      },

      getActiveNote: () => {
        const { notes, activeNoteId } = get();
        return notes.find((note) => note.id === activeNoteId) || null;
      },
    }),
    {
      name: 'markdown-notes-storage',
      // Only persist certain fields
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
      }),
    }
  )
);
