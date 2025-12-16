function renderNotesPage(notes) {
  return `
    <div class="notes-page-container">
      <!-- Header -->
      <div class="notes-header">
        <div class="header-left">
          <h1 class="notes-title">
            <svg class="notes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Quick Notes
          </h1>
          <p class="notes-subtitle">Capture thoughts, ideas, and reminders instantly</p>
        </div>
        <div class="header-right">
          <div id="notes-stats" class="notes-stats"></div>
        </div>
      </div>

      <!-- Quick Input Section -->
      <div class="quick-input-section">
        <div class="input-container">
          <div class="input-header">
            <div class="category-selector">
              <select id="note-category" class="category-select">
                <option value="general">📝 General</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="ideas">💡 Ideas</option>
                <option value="research">🔍 Research</option>
                <option value="reminders">⏰ Reminders</option>
              </select>
            </div>
          </div>
          
          <textarea 
            id="note-input"
            placeholder="What's on your mind? Type here and press Enter to save..."
            class="note-textarea"
            rows="3"
          ></textarea>
          
          <div class="input-footer">
            <div class="input-actions">
              <button id="add-note-btn" class="btn-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Note
              </button>
              <button class="btn-secondary" id="clear-input">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear
              </button>
            </div>
            <div class="char-counter">
              <span id="char-count">0</span>/500
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-section">
        <div class="controls-left">
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all">All Notes</button>
            <button class="filter-btn" data-filter="pinned">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              Pinned
            </button>
            <button class="filter-btn" data-filter="work">Work</button>
            <button class="filter-btn" data-filter="personal">Personal</button>
            <button class="filter-btn" data-filter="ideas">Ideas</button>
          </div>
        </div>
        <div class="controls-right">
          <div class="search-container">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              id="notes-search"
              placeholder="Search notes..."
              class="search-input"
            >
          </div>
          <div class="sort-container">
            <label for="sort-notes">Sort by:</label>
            <select id="sort-notes" class="sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="pinned">Pinned First</option>
            </select>
          </div>
          <button id="clear-all-notes" class="btn-danger">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear All
          </button>
        </div>
      </div>

      <!-- Notes Grid -->
      <div id="notes-container" class="notes-grid">
        ${renderNotesList(notes)}
      </div>

      <!-- Empty State -->
      <div class="empty-state" style="display: ${notes && notes.length > 0 ? 'none' : 'block'}">
        <div class="empty-state-content">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3>No notes yet</h3>
          <p>Start by typing a note above. Your notes will appear here.</p>
          <div class="empty-state-tips">
            <div class="tip">
              <strong>💡 Tip:</strong> Use categories to organize your notes
            </div>
            <div class="tip">
              <strong>📌 Tip:</strong> Pin important notes to keep them on top
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNotesList(notes) {
  if (!notes || notes.length === 0) {
    return '';
  }

  const filteredNotes = notes; // Already filtered by controller
  
  if (filteredNotes.length === 0) {
    return `
      <div class="no-results">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h4>No notes found</h4>
        <p>Try changing your filters or search term</p>
      </div>
    `;
  }

  return filteredNotes.map(note => renderNoteItem(note)).join('');
}

function renderNoteItem(note) {
  const noteDate = new Date(note.date);
  const timeString = noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = noteDate.toLocaleDateString([], { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: noteDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  }).replace(',', '');
  
  const isToday = noteDate.toDateString() === new Date().toDateString();
  const isYesterday = new Date(noteDate.getTime() + 86400000).toDateString() === new Date().toDateString();
  
  let displayDate;
  if (isToday) {
    displayDate = `Today • ${timeString}`;
  } else if (isYesterday) {
    displayDate = `Yesterday • ${timeString}`;
  } else {
    displayDate = `${dateString} • ${timeString}`;
  }

  // Handle missing or undefined category
  const category = note.category || 'general';
  
  const categoryIcons = {
    'work': '💼',
    'personal': '🏠',
    'ideas': '💡',
    'research': '🔍',
    'reminders': '⏰',
    'general': '📝'
  };

  const categoryColors = {
    'work': 'work',
    'personal': 'personal',
    'ideas': 'ideas',
    'research': 'research',
    'reminders': 'reminders',
    'general': 'general'
  };

  const categoryIcon = categoryIcons[category] || '📝';
  const categoryColor = categoryColors[category] || 'general';

  return `
    <div class="note-item ${note.pinned ? 'pinned' : ''} category-${categoryColor}" data-note-id="${note.id}">
      ${note.pinned ? `
        <div class="pinned-badge">
          <svg class="pin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          Pinned
        </div>
      ` : ''}
      
      <div class="note-content">
        <div class="note-text">${formatNoteText(note.text)}</div>
        
        <div class="note-footer">
          <div class="note-meta">
            <span class="note-category">
              ${categoryIcon} ${category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <span class="note-date">${displayDate}</span>
          </div>
          
          <div class="note-actions">
            <button class="pin-note-btn ${note.pinned ? 'pinned' : ''}" data-note-id="${note.id}" title="${note.pinned ? 'Unpin' : 'Pin'} note">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
            <button class="delete-note-btn" data-note-id="${note.id}" title="Delete note">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatNoteText(text) {
  // Simple formatting: URLs to links, line breaks, etc.
  let formatted = text
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="note-link">$1</a>')
    .replace(/#(\w+)/g, '<span class="note-hashtag">#$1</span>');
  
  return formatted;
}