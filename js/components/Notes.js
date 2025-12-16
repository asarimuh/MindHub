class Notes {
  constructor() {
  this.name = 'notes';
  this.notes = Storage.get('quickNotes') || [
    { 
      id: 1, 
      text: "Remember to finish the quarterly report by Friday", 
      date: new Date().toISOString(),
      category: 'work',
      pinned: true
    },
    { 
      id: 2, 
      text: "Call client about project requirements", 
      date: new Date(Date.now() - 86400000).toISOString(),
      category: 'work',
      pinned: false
    },
    { 
      id: 3, 
      text: "Research new design trends for presentation", 
      date: new Date(Date.now() - 172800000).toISOString(),
      category: 'research',
      pinned: false
    },
    { 
      id: 4, 
      text: "Grocery list: milk, eggs, bread", 
      date: new Date().toISOString(),
      category: 'personal',
      pinned: true
    }
  ];
  
  // Check if any existing notes are missing category/pinned properties
  this.notes = this.notes.map(note => ({
    ...note,
    category: note.category || 'general',
    pinned: note.pinned || false
  }));
  
  this.nextNoteId = this.notes.length > 0 ? Math.max(...this.notes.map(note => note.id)) + 1 : 5;
  this.currentFilter = 'all';
  this.currentSort = 'newest';
  this.currentSearch = '';
}

  render() {
    return renderNotesPage(this.notes);
  }

  init() {
    this.setupEventListeners();
    this.updateStats();
  }

  setupEventListeners() {
    // Add note button
    document.getElementById('add-note-btn')?.addEventListener('click', this.addNote.bind(this));
    
    // Enter key to add note
    document.getElementById('note-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.addNote();
      }
    });

    // Clear all notes
    document.getElementById('clear-all-notes')?.addEventListener('click', this.clearAllNotes.bind(this));
    
    // Search notes
    document.getElementById('notes-search')?.addEventListener('input', (e) => {
      this.currentSearch = e.target.value.toLowerCase();
      this.renderNotesList();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentFilter = e.target.dataset.filter;
        this.updateActiveFilter();
        this.renderNotesList();
      });
    });

    // Sort dropdown
    document.getElementById('sort-notes')?.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.renderNotesList();
    });

    // Category selection in modal
    document.getElementById('note-category')?.addEventListener('change', (e) => {
      const modal = document.getElementById('add-note-modal');
      if (modal) {
        const category = e.target.value;
        modal.className = modal.className.replace(/category-\w+/, '');
        modal.classList.add(`category-${category}`);
      }
    });
  }

  addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();
    
    if (noteText) {
      const categorySelect = document.getElementById('note-category');
      const category = categorySelect ? categorySelect.value : 'general';
      
      const newNote = {
        id: this.nextNoteId++,
        text: noteText,
        date: new Date().toISOString(),
        category: category,
        pinned: false
      };
      
      this.notes.unshift(newNote);
      this.saveNotes();
      this.renderNotesList();
      this.updateStats();
      noteInput.value = '';
      
      // Reset category
      if (categorySelect) categorySelect.value = 'general';
      
      // Show success animation
      this.showNoteAddedAnimation();
      
      // Limit to 50 notes
      if (this.notes.length > 50) {
        this.notes.pop();
        this.renderNotesList();
      }
    }
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter(note => note.id !== parseInt(noteId));
    this.saveNotes();
    this.renderNotesList();
    this.updateStats();
  }

  togglePinNote(noteId) {
    const noteIndex = this.notes.findIndex(note => note.id === parseInt(noteId));
    if (noteIndex !== -1) {
      this.notes[noteIndex].pinned = !this.notes[noteIndex].pinned;
      this.saveNotes();
      this.renderNotesList();
    }
  }

  clearAllNotes() {
    if (this.notes.length > 0) {
      // Show confirmation modal instead of default confirm
      this.showClearConfirmation();
    }
  }

  showClearConfirmation() {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
      <div class="confirmation-content">
        <h3>Clear All Notes?</h3>
        <p>This will permanently delete all ${this.notes.length} notes. This action cannot be undone.</p>
        <div class="confirmation-buttons">
          <button class="btn-secondary" id="cancel-clear">Cancel</button>
          <button class="btn-danger" id="confirm-clear">Clear All Notes</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('cancel-clear').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('confirm-clear').addEventListener('click', () => {
      this.notes = [];
      this.saveNotes();
      this.renderNotesList();
      this.updateStats();
      document.body.removeChild(modal);
      this.showNotesClearedAnimation();
    });
  }

  showNoteAddedAnimation() {
    const animation = document.createElement('div');
    animation.className = 'note-added-animation';
    animation.innerHTML = `
      <svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>Note added!</span>
    `;
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
      animation.classList.add('show');
      setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(animation);
        }, 300);
      }, 2000);
    }, 10);
  }

  showNotesClearedAnimation() {
    const animation = document.createElement('div');
    animation.className = 'notes-cleared-animation';
    animation.innerHTML = `
      <svg class="trash-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
      <span>All notes cleared</span>
    `;
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
      animation.classList.add('show');
      setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(animation);
        }, 300);
      }, 2000);
    }, 10);
  }

  updateActiveFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
    });
  }

  updateStats() {
    const totalNotes = this.notes.length;
    const pinnedNotes = this.notes.filter(note => note.pinned).length;
    const todayNotes = this.notes.filter(note => {
      const noteDate = new Date(note.date);
      const today = new Date();
      return noteDate.toDateString() === today.toDateString();
    }).length;

    const statsElement = document.getElementById('notes-stats');
    if (statsElement) {
      statsElement.innerHTML = `
        <div class="stat-item">
          <span class="stat-value">${totalNotes}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${pinnedNotes}</span>
          <span class="stat-label">Pinned</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${todayNotes}</span>
          <span class="stat-label">Today</span>
        </div>
      `;
    }
  }

  getFilteredAndSortedNotes() {
    let filteredNotes = [...this.notes];
    
    // Apply filter
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'pinned') {
        filteredNotes = filteredNotes.filter(note => note.pinned);
      } else {
        filteredNotes = filteredNotes.filter(note => note.category === this.currentFilter);
      }
    }
    
    // Apply search
    if (this.currentSearch) {
      filteredNotes = filteredNotes.filter(note => 
        note.text.toLowerCase().includes(this.currentSearch)
      );
    }
    
    // Apply sorting
    filteredNotes.sort((a, b) => {
      if (this.currentSort === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (this.currentSort === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (this.currentSort === 'pinned') {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
    
    // Separate pinned notes if not already filtered
    if (this.currentFilter !== 'pinned' && this.currentSort !== 'pinned') {
      const pinned = filteredNotes.filter(note => note.pinned);
      const unpinned = filteredNotes.filter(note => !note.pinned);
      return [...pinned, ...unpinned];
    }
    
    return filteredNotes;
  }

  renderNotesList() {
    const container = document.getElementById('notes-container');
    if (!container) return;
    
    const filteredNotes = this.getFilteredAndSortedNotes();
    container.innerHTML = renderNotesList(filteredNotes);
    
    // Re-attach event listeners
    this.attachNoteEventListeners();
  }

  attachNoteEventListeners() {
    const container = document.getElementById('notes-container');
    if (!container) return;
    
    // Delete buttons
    container.querySelectorAll('.delete-note-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const noteId = e.target.closest('button').getAttribute('data-note-id');
        this.deleteNote(noteId);
      });
    });
    
    // Pin buttons
    container.querySelectorAll('.pin-note-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const noteId = e.target.closest('button').getAttribute('data-note-id');
        this.togglePinNote(noteId);
      });
    });
    
    // Note click to edit
    container.querySelectorAll('.note-item').forEach(note => {
      note.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const noteId = note.getAttribute('data-note-id');
          this.editNote(noteId);
        }
      });
    });
  }

  editNote(noteId) {
    const note = this.notes.find(n => n.id === parseInt(noteId));
    if (!note) return;
    
    const modal = document.createElement('div');
    modal.className = 'edit-note-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Note</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <textarea id="edit-note-text" class="edit-textarea">${note.text}</textarea>
          <div class="modal-footer">
            <button class="btn-secondary" id="cancel-edit">Cancel</button>
            <button class="btn-primary" id="save-edit">Save Changes</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => document.body.removeChild(modal);
    
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('#cancel-edit').addEventListener('click', closeModal);
    
    modal.querySelector('#save-edit').addEventListener('click', () => {
      const newText = modal.querySelector('#edit-note-text').value.trim();
      if (newText && newText !== note.text) {
        note.text = newText;
        note.date = new Date().toISOString();
        this.saveNotes();
        this.renderNotesList();
      }
      closeModal();
    });
  }

  saveNotes() {
    Storage.set('quickNotes', this.notes);
    Storage.set('nextNoteId', this.nextNoteId);
  }
}