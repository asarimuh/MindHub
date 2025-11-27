class Notes {
  constructor() {
    this.name = 'notes';
    this.notes = Storage.get('quickNotes') || [
      { id: 1, text: "Remember to finish the quarterly report by Friday", date: new Date().toISOString().split('T')[0] },
      { id: 2, text: "Call client about project requirements", date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
      { id: 3, text: "Research new design trends for presentation", date: new Date(Date.now() - 172800000).toISOString().split('T')[0] }
    ];
    this.nextNoteId = this.notes.length > 0 ? Math.max(...this.notes.map(note => note.id)) + 1 : 4;
  }

  render() {
    return `
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight mb-2">Quick Notes</h1>
        <p class="text-muted-foreground">Your quick notes and thoughts</p>
      </div>

      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Quick Notes</h2>
          <button id="clear-all-notes" class="text-sm text-red-600 hover:text-red-800">Clear All</button>
        </div>
        <p class="text-sm text-muted-foreground mb-4">Jot down quick thoughts and ideas</p>
        
        <div class="mb-4">
          <textarea 
            id="note-input"
            placeholder="What's on your mind?"
            class="input w-full h-24 resize-none"
          ></textarea>
          <div class="flex justify-end mt-2">
            <button id="add-note-btn" class="btn btn-primary text-sm">Add Note</button>
          </div>
        </div>
        
        <div id="notes-container" class="space-y-3 max-h-96 overflow-y-auto">
          ${this.renderNotes()}
        </div>
      </div>
    `;
  }

  renderNotes() {
    if (this.notes.length === 0) {
      return `
        <div class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <p>No notes yet. Add your first note above!</p>
        </div>
      `;
    }

    return this.notes.map(note => this.renderNoteItem(note)).join('');
  }

  renderNoteItem(note) {
    const noteDate = new Date(note.date);
    const timeString = noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = noteDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const isToday = noteDate.toDateString() === new Date().toDateString();
    const displayDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;

    return `
      <div class="note-item" data-note-id="${note.id}">
        <div class="flex justify-between items-start">
          <p class="text-sm flex-1">${note.text}</p>
          <button class="delete-note-btn text-red-500 ml-2 flex-shrink-0" data-note-id="${note.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        <p class="text-xs text-muted-foreground mt-1">${displayDate}</p>
      </div>
    `;
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add note button
    document.getElementById('add-note-btn').addEventListener('click', this.addNote.bind(this));

    // Enter key to add note
    document.getElementById('note-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.addNote();
      }
    });

    // Clear all notes
    document.getElementById('clear-all-notes').addEventListener('click', this.clearAllNotes.bind(this));
  }

  addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();
    
    if (noteText) {
      const newNote = {
        id: this.nextNoteId++,
        text: noteText,
        date: new Date().toISOString().split('T')[0]
      };
      
      this.notes.unshift(newNote);
      this.saveNotes();
      this.renderNotesList();
      noteInput.value = '';
      
      // Limit to 20 notes
      if (this.notes.length > 20) {
        this.notes.pop();
        this.renderNotesList();
      }
    }
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter(note => note.id !== parseInt(noteId));
    this.saveNotes();
    this.renderNotesList();
  }

  clearAllNotes() {
    if (this.notes.length > 0 && confirm('Are you sure you want to delete all notes?')) {
      this.notes = [];
      this.saveNotes();
      this.renderNotesList();
    }
  }

  renderNotesList() {
    const container = document.getElementById('notes-container');
    container.innerHTML = this.renderNotes();
    
    // Re-attach event listeners to delete buttons
    container.querySelectorAll('.delete-note-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const noteId = e.target.closest('button').getAttribute('data-note-id');
        this.deleteNote(noteId);
      });
    });
  }

  saveNotes() {
    Storage.set('quickNotes', this.notes);
    Storage.set('nextNoteId', this.nextNoteId);
  }
}