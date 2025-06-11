'use client';

import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';

export default function Home() {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <Editor />
    </div>
  );
}
