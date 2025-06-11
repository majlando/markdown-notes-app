import { v4 as uuidv4 } from 'uuid';

const editor = document.getElementById('editor');
const previewPane = document.getElementById('preview');
const newNoteBtn = document.getElementById('new-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const notesListUl = document.getElementById('notes-list');

const NOTES_STORAGE_KEY = 'markdown_notes_app_data';

let notes = [];
let activeNoteId = null;

// --- Core Functions ---
function saveNotesToLocalStorage() {
    const dataToSave = {
        notes: notes,
        activeNoteId: activeNoteId
    };
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(dataToSave));
}

function loadNotesFromLocalStorage() {
    const savedData = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            notes = parsedData.notes || [];
            activeNoteId = parsedData.activeNoteId || null;
        } catch (error) {
            console.error("Error parsing notes from local storage:", error);
            notes = [];
            activeNoteId = null;
        }
    } else {
        // If no data, create a default note
        createNewNote();
    }
}

function renderNotesList() {
    notesListUl.innerHTML = ''; // Clear existing list
    if (notes.length === 0) {
        notesListUl.innerHTML = '<li class=\"no-notes\">(No notes yet)</li>';
        deleteNoteBtn.disabled = true;
        editor.disabled = true;
        return;
    }

    editor.disabled = false;
    deleteNoteBtn.disabled = !activeNoteId; // Disable if no note is active (should not happen if notes exist)

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.textContent = note.title || 'Untitled Note';
        listItem.dataset.noteId = note.id;
        if (note.id === activeNoteId) {
            listItem.classList.add('active-note');
        }
        listItem.addEventListener('click', () => setActiveNote(note.id));
        notesListUl.appendChild(listItem);
    });
}

function getNoteById(id) {
    return notes.find(note => note.id === id);
}

function setActiveNote(id) {
    if (!id && notes.length > 0) {
        // If no ID provided, and notes exist, set the first one as active
        id = notes[0].id;
    }
    
    activeNoteId = id;
    const currentNote = getNoteById(activeNoteId);

    if (currentNote) {
        editor.value = currentNote.content;
        updatePreview();
    } else {
        // No active note, or note not found (e.g., after deletion)
        editor.value = '';
        updatePreview();
        if (notes.length > 0) { // If other notes exist, make the first one active
            setActiveNote(notes[0].id);
        } else { // No notes left
            editor.disabled = true; // Disable editor if no notes
        }
    }
    renderNotesList(); // Re-render to highlight active note and update button states
    saveNotesToLocalStorage();
}

function createNewNote() {
    const newNote = {
        id: uuidv4(),
        title: 'Untitled Note',
        content: '# New Note\n\nStart typing...',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
    };
    notes.unshift(newNote); // Add to the beginning of the array
    setActiveNote(newNote.id);
    // Editor content is set by setActiveNote
}

function deleteActiveNote() {
    if (!activeNoteId) return;

    notes = notes.filter(note => note.id !== activeNoteId);
    const oldActiveNoteId = activeNoteId;
    activeNoteId = null; // Reset active note ID

    if (notes.length > 0) {
        // Try to find the index of the deleted note to select the next or previous one
        // This part is a bit simplistic; more sophisticated selection could be added
        setActiveNote(notes[0].id); // Default to the first note
    } else {
        // No notes left, create a new one
        createNewNote();
    }
    saveNotesToLocalStorage();
    renderNotesList(); // Re-render the list
}

// Function to update the preview pane
function updatePreview() {
    const markdownText = editor.value;
    previewPane.innerHTML = marked.parse(markdownText);
    // Apply syntax highlighting to code blocks after Marked.js processes the markdown
    previewPane.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Initial preview update
updatePreview();

// --- Event Listeners ---
newNoteBtn.addEventListener('click', () => {
    createNewNote();
});

deleteNoteBtn.addEventListener('click', () => {
    if (activeNoteId && confirm('Are you sure you want to delete this note?')) {
        deleteActiveNote();
    }
});

editor.addEventListener('input', () => {
    if (!activeNoteId) return;

    const currentNote = getNoteById(activeNoteId);
    if (currentNote) {
        currentNote.content = editor.value;
        currentNote.lastModified = new Date().toISOString();
        // Update title (simple logic: first line of markdown, or 'Untitled Note')
        const firstLine = editor.value.split('\n')[0];
        currentNote.title = firstLine.replace(/^#+\s*/, '').substring(0, 50) || 'Untitled Note';
        
        saveNotesToLocalStorage();
        renderNotesList(); // Re-render to update title if it changed
    }
    updatePreview(); // This was the original line, keep it for preview update
});

// --- Initialization ---
function initializeApp() {
    loadNotesFromLocalStorage();
    if (notes.length === 0) {
        // If still no notes after load (e.g. first time user, or cleared storage)
        // createNewNote(); // createNewNote is called within loadNotesFromLocalStorage if empty
    }
    if (!activeNoteId && notes.length > 0) {
        activeNoteId = notes[0].id; // Default to first note if none was active
    }
    setActiveNote(activeNoteId);
    renderNotesList();
}

initializeApp();
