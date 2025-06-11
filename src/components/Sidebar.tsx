'use client';

import { useState } from 'react';
import { useNoteStore } from '@/store/useNoteStore';
import { extractTitle, formatDate } from '@/utils/markdown';
import { 
  Search, 
  Plus, 
  FileText, 
  X, 
  Star, 
  SortAsc, 
  SortDesc,
  Clock,
  Calendar,
  Type,
  Menu
} from 'lucide-react';
import { SortOption } from '@/types';

export const Sidebar = () => {
  const {
    notes,
    activeNoteId,
    searchQuery,
    sortBy,
    sortDirection,
    setSearchQuery,
    setActiveNote,
    addNote,
    deleteNote,
    toggleFavorite,
    setSortBy,
    setSortDirection,
    getFilteredNotes,
  } = useNoteStore();

  const [showSortMenu, setShowSortMenu] = useState(false);
  const filteredNotes = getFilteredNotes();

  const handleNewNote = () => {
    addNote({
      title: 'New Note',
      content: '# New Note\n\nStart writing your markdown here...',
    });
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    const note = notes.find(n => n.id === noteId);
    const noteName = note ? extractTitle(note.content) : 'this note';
    
    if (confirm(`Are you sure you want to delete "${noteName}"? This action cannot be undone.`)) {
      deleteNote(noteId);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    toggleFavorite(noteId);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
    setShowSortMenu(false);
  };

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'title':
        return <Type size={16} />;
      case 'createdAt':
        return <Calendar size={16} />;
      case 'updatedAt':
      default:
        return <Clock size={16} />;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'title':
        return 'Title';
      case 'createdAt':
        return 'Created';
      case 'updatedAt':
      default:
        return 'Modified';
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
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            title="Create new note (Ctrl+N)"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              title="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <div className="flex items-center gap-2">
              {getSortIcon(sortBy)}
              <span>Sort by {getSortLabel(sortBy)}</span>
            </div>
            <div className="flex items-center gap-1">
              {sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
              <Menu size={14} />
            </div>
          </button>

          {showSortMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {(['updatedAt', 'createdAt', 'title'] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 ${
                    sortBy === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {getSortIcon(option)}
                  <span>Sort by {getSortLabel(option)}</span>
                  {sortBy === option && (
                    <div className="ml-auto">
                      {sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
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
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            ) : (
              <div>
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No notes yet</p>
                <p className="text-sm mt-1">Create your first note!</p>
                <button
                  onClick={handleNewNote}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Get started →
                </button>
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
                  className={`relative group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 border-blue-200 border shadow-sm'
                      : 'hover:bg-gray-100 border border-transparent hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        {note.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                        <h3 className={`text-sm font-medium truncate ${
                          isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDate(new Date(note.updatedAt))}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {note.content
                          .replace(/#+\s/g, '')
                          .replace(/\*\*/g, '')
                          .replace(/\*/g, '')
                          .replace(/`/g, '')
                          .substring(0, 80)}
                        {note.content.length > 80 ? '...' : ''}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleToggleFavorite(e, note.id)}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                          note.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                        title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star size={14} className={note.isFavorite ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(e, note.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete note"
                        aria-label="Delete note"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
          {filteredNotes.length !== notes.length && (
            <span>{filteredNotes.length} shown</span>
          )}
        </div>
      </div>
    </div>
  );
};
