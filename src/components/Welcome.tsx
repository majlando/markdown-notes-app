'use client';

import { useNoteStore } from '@/store/useNoteStore';
import { FileText, Zap, Search, Eye, Keyboard, X } from 'lucide-react';

export const Welcome = () => {
  const { dismissWelcome, addNote } = useNoteStore();

  const handleGetStarted = () => {
    addNote({
      title: 'Welcome to Markdown Notes!',
      content: `# Welcome to Markdown Notes! 🎉

Thank you for trying out our markdown notes application. Here's what you can do:

## ✨ Features

- **Write in Markdown**: Use standard markdown syntax for formatting
- **Live Preview**: Toggle between edit and preview modes
- **Search**: Quickly find your notes with the search bar
- **Auto-save**: Your notes are automatically saved as you type
- **Organize**: Favorite important notes and sort by different criteria

## 🚀 Quick Start

1. **Create a note**: Click the "New" button in the sidebar
2. **Write in markdown**: Use \`#\` for headings, \`**bold**\`, \`*italic*\`, etc.
3. **Preview**: Click the "Preview" button to see formatted output
4. **Search**: Use the search bar to find specific notes

## ⌨️ Keyboard Shortcuts

- \`Ctrl + N\` - Create new note
- \`Ctrl + /\` - Toggle preview mode
- \`Ctrl + F\` - Focus search
- \`Tab\` - Insert tab (in editor)

## 📝 Markdown Syntax Examples

### Headings
\`\`\`
# Heading 1
## Heading 2
### Heading 3
\`\`\`

### Text Formatting
\`\`\`
**Bold text**
*Italic text*
\`inline code\`
\`\`\`

### Lists
\`\`\`
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
\`\`\`

### Links
\`\`\`
[Link text](https://example.com)
\`\`\`

Happy writing! 📝`,
    });
    dismissWelcome();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to Markdown Notes
                </h1>
                <p className="text-gray-600">
                  Your modern markdown editor and note-taking app
                </p>
              </div>
            </div>
            <button
              onClick={dismissWelcome}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Close welcome screen"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast & Simple</h3>
                  <p className="text-sm text-gray-600">
                    Start writing immediately with markdown syntax
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Search className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Powerful Search</h3>
                  <p className="text-sm text-gray-600">
                    Find any note instantly with full-text search
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Preview</h3>
                  <p className="text-sm text-gray-600">
                    See your formatted text in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Keyboard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Keyboard Shortcuts</h3>
                  <p className="text-sm text-gray-600">
                    Work efficiently with handy shortcuts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Tips:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use <code className="bg-gray-200 px-1 rounded">Ctrl+N</code> to create a new note</li>
              <li>• Click the star icon to favorite important notes</li>
              <li>• Your notes are automatically saved as you type</li>
              <li>• Use the sort dropdown to organize your notes</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGetStarted}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Get Started with Sample Note
            </button>
            <button
              onClick={dismissWelcome}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
