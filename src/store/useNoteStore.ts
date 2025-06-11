import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteStore, SortOption, SortDirection } from '@/types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      searchQuery: '',
      isPreviewMode: false,
      sortBy: 'updatedAt' as SortOption,
      sortDirection: 'desc' as SortDirection,
      lastSaved: null,
      isAutoSaving: false,
      showWelcome: true,

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
          showWelcome: false,
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
          lastSaved: new Date(),
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

      setSortBy: (sortBy) => {
        set({ sortBy });
      },

      setSortDirection: (direction) => {
        set({ sortDirection: direction });
      },

      toggleFavorite: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isFavorite: !note.isFavorite, updatedAt: new Date() }
              : note
          ),
        }));
      },

      setAutoSaving: (saving) => {
        set({ isAutoSaving: saving });
      },

      setLastSaved: (date) => {
        set({ lastSaved: date });
      },

      dismissWelcome: () => {
        set({ showWelcome: false });
      },

      getSortedNotes: (notes) => {
        const { sortBy, sortDirection } = get();
        
        return [...notes].sort((a, b) => {
          // Favorites always come first
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          
          let aValue: any;
          let bValue: any;
          
          switch (sortBy) {
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            case 'updatedAt':
            default:
              aValue = new Date(a.updatedAt).getTime();
              bValue = new Date(b.updatedAt).getTime();
              break;
          }
          
          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      },

      getFilteredNotes: () => {
        const { notes, searchQuery, getSortedNotes } = get();
        let filteredNotes = notes;
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filteredNotes = notes.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        }
        
        return getSortedNotes(filteredNotes);
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
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
        showWelcome: state.showWelcome,
      }),
    }
  )
);
