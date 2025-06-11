import { useEffect } from 'react';
import { useNoteStore } from '@/store/useNoteStore';

export const useKeyboardShortcuts = () => {
  const { addNote, togglePreviewMode, setSearchQuery } = useNoteStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        // Allow Ctrl+N and Ctrl+/ even in inputs
        if (!(event.ctrlKey && (event.key === 'n' || event.key === '/'))) {
          return;
        }
      }

      // Ctrl+N - New note
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        addNote({
          title: 'New Note',
          content: '# New Note\n\nStart writing your markdown here...',
        });
      }

      // Ctrl+/ - Toggle preview
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        togglePreviewMode();
      }

      // Ctrl+F - Focus search (only when not in input)
      if (
        event.ctrlKey &&
        event.key === 'f' &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape - Clear search or close modals
      if (event.key === 'Escape') {
        if (event.target instanceof HTMLInputElement && event.target.placeholder.includes('Search')) {
          setSearchQuery('');
          event.target.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addNote, togglePreviewMode, setSearchQuery]);
};
