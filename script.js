const editor = document.getElementById('editor');
const previewPane = document.getElementById('preview');

// Function to update the preview pane
function updatePreview() {
    const markdownText = editor.value;
    previewPane.innerHTML = marked.parse(markdownText);
}

// Initial preview update
updatePreview();

// Update preview on input in the editor
editor.addEventListener('input', updatePreview);

// --- Local Storage Implementation ---
const NOTE_STORAGE_KEY = 'markdown_note';

// Function to save note to local storage
function saveNote() {
    localStorage.setItem(NOTE_STORAGE_KEY, editor.value);
}

// Function to load note from local storage
function loadNote() {
    const savedNote = localStorage.getItem(NOTE_STORAGE_KEY);
    if (savedNote !== null) {
        editor.value = savedNote;
        updatePreview(); // Update preview after loading
    }
}

// Load note when the page loads
loadNote();

// Save note on input
editor.addEventListener('input', () => {
    updatePreview();
    saveNote();
});
