'use client';

import { useEffect, useRef } from 'react';
import { useNoteStore } from '@/store/useNoteStore';
import { parseMarkdown, extractTitle } from '@/utils/markdown';
import { Eye, Edit, FileText } from 'lucide-react';

export const Editor = () => {
  const {
    activeNoteId,
    isPreviewMode,
    togglePreviewMode,
    updateNote,
    getActiveNote,
  } = useNoteStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeNote = getActiveNote();

  useEffect(() => {
    if (textareaRef.current && !isPreviewMode) {
      textareaRef.current.focus();
    }
  }, [activeNoteId, isPreviewMode]);

  const handleContentChange = (content: string) => {
    if (activeNoteId) {
      const title = extractTitle(content);
      updateNote(activeNoteId, { content, title });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab character
      const newContent = 
        textarea.value.substring(0, start) + 
        '  ' + 
        textarea.value.substring(end);
      
      handleContentChange(newContent);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No note selected
          </h2>
          <p className="text-gray-600">
            Choose a note from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium text-gray-900 truncate max-w-md">
            {extractTitle(activeNote.content)}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePreviewMode}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isPreviewMode
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {isPreviewMode ? (
              <>
                <Edit size={16} />
                Edit
              </>
            ) : (
              <>
                <Eye size={16} />
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`${isPreviewMode ? 'w-1/2' : 'w-full'} flex flex-col`}>          <textarea
            ref={textareaRef}
            value={activeNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your markdown here..."
            className="flex-1 w-full h-full min-h-full p-6 text-gray-900 placeholder-gray-500 border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          />
        </div>        {/* Preview */}
        {isPreviewMode && (
          <div className="w-1/2 border-l border-gray-200">
            <div 
              className="p-6 prose"
              dangerouslySetInnerHTML={{ 
                __html: parseMarkdown(activeNote.content) 
              }}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>
          {activeNote.content.length} characters • {activeNote.content.split('\n').length} lines
        </span>
        <span>
          Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
