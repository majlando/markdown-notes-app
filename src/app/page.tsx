'use client';

import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { Welcome } from '@/components/Welcome';
import { useNoteStore } from '@/store/useNoteStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Home() {
  const { showWelcome } = useNoteStore();
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <Editor />
      {showWelcome && <Welcome />}
    </div>
  );
}
