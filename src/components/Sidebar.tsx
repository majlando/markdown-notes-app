'use client';

import { useNoteStore } from '@/store/useNoteStore';
import { extractTitle, formatDate } from '@/utils/markdown';
import { Search, Plus, FileText, X } from 'lucide-react';

export const Sidebar = () => {
  const {
    notes,
    activeNoteId,
    searchQuery,
    setSearchQuery,
    setActiveNote,
    addNote,
    deleteNote,
    getFilteredNotes,  } = useNoteStore();

  const filteredNotes = getFilteredNotes();

  const handleNewNote = () => {
    addNote({
      title: 'New Note',
      content: '# New Note\n\nStart writing your markdown here...',
    });
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Markdown Notes
          </h1>
          <button
            onClick={handleNewNote}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? (
              <div>
                <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No notes match your search</p>
              </div>
            ) : (
              <div>
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No notes yet</p>
                <p className="text-sm mt-1">Create your first note!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredNotes.map((note) => {
              const title = extractTitle(note.content);
              const isActive = note.id === activeNoteId;
              
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={`relative group p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-100 border-blue-200 border'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(new Date(note.updatedAt))}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {note.content
                          .replace(/#+\s/g, '')
                          .replace(/\*\*/g, '')
                          .replace(/\*/g, '')
                          .substring(0, 60)}
                        {note.content.length > 60 ? '...' : ''}
                      </p>
                    </div>
                      <button
                      onClick={(e) => handleDeleteNote(e, note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
      </div>
    </div>
  );
};
