'use client';

import { useEffect, useRef, useState } from 'react';
import { useNoteStore } from '@/store/useNoteStore';
import { parseMarkdown, extractTitle } from '@/utils/markdown';
import { 
  Eye, 
  Edit, 
  FileText, 
  Save, 
  Download, 
  Bold, 
  Italic, 
  Link2, 
  List, 
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

export const Editor = () => {
  const {
    activeNoteId,
    isPreviewMode,
    lastSaved,
    isAutoSaving,
    togglePreviewMode,
    updateNote,
    getActiveNote,
    setAutoSaving,
    setLastSaved,
  } = useNoteStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const activeNote = getActiveNote();

  useEffect(() => {
    if (textareaRef.current && !isPreviewMode) {
      textareaRef.current.focus();
    }
  }, [activeNoteId, isPreviewMode]);

  useEffect(() => {
    if (activeNote) {
      const words = activeNote.content.trim().split(/\s+/).filter(word => word.length > 0).length;
      const chars = activeNote.content.length;
      setWordCount(words);
      setCharCount(chars);
    }
  }, [activeNote?.content]);

  const handleContentChange = (content: string) => {
    if (activeNoteId) {
      setAutoSaving(true);
      const title = extractTitle(content);
      updateNote(activeNoteId, { content, title });
      
      // Simulate auto-save delay for better UX
      setTimeout(() => {
        setAutoSaving(false);
        setLastSaved(new Date());
        setShowSaveIndicator(true);
        setTimeout(() => setShowSaveIndicator(false), 2000);
      }, 500);
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

  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef.current || !activeNote) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = before + selectedText + after;
    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    handleContentChange(newContent);
    
    // Reset cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  const downloadNote = () => {
    if (!activeNote) return;
    
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${extractTitle(activeNote.content)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No note selected
          </h2>
          <p className="text-gray-600 max-w-sm">
            Choose a note from the sidebar or create a new one to get started.
            You can use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+N</kbd> to create a new note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-900 truncate max-w-md">
            {extractTitle(activeNote.content)}
          </h2>
          
          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isAutoSaving ? (
              <div className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span>Saving...</span>
              </div>
            ) : showSaveIndicator ? (
              <div className="flex items-center gap-1 text-green-600">
                <Save size={14} />
                <span>Saved</span>
              </div>
            ) : lastSaved ? (
              <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={downloadNote}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            title="Download as Markdown"
          >
            <Download size={16} />
            Download
          </button>
          
          <button
            onClick={togglePreviewMode}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isPreviewMode
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
            title={`${isPreviewMode ? 'Edit' : 'Preview'} (Ctrl+/)`}
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

      {/* Formatting Toolbar */}
      {!isPreviewMode && (
        <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => insertMarkdown('# ')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => insertMarkdown('## ')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            onClick={() => insertMarkdown('### ')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => insertMarkdown('`', '`')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Inline Code"
          >
            <Code size={16} />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <button
            onClick={() => insertMarkdown('[', '](url)')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Link"
          >
            <Link2 size={16} />
          </button>
          <button
            onClick={() => insertMarkdown('- ')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
          >
            <List size={16} />
          </button>
        </div>
      )}

      {/* Editor/Preview Area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`${isPreviewMode ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <textarea
            ref={textareaRef}
            value={activeNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your markdown here...

Use # for headings, **bold**, *italic*, `code`, and more!
Try the formatting buttons above or use keyboard shortcuts."
            className="flex-1 w-full h-full min-h-full p-6 text-gray-900 placeholder-gray-500 border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Preview */}
        {isPreviewMode && (
          <div className="w-1/2 border-l border-gray-200">
            <div 
              className="p-6 prose max-w-none h-full overflow-y-auto"
              dangerouslySetInnerHTML={{ 
                __html: parseMarkdown(activeNote.content) 
              }}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
        <div className="flex items-center gap-4">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
          <span>{activeNote.content.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Created: {new Date(activeNote.createdAt).toLocaleDateString()}</span>
          <span>Modified: {new Date(activeNote.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
