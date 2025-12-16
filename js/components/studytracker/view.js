function renderStudyTrackerPage(studyCards) {
  return `
    <div class="kanban-board-container">
      <!-- Header -->
      <div class="flex justify-between">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold tracking-tight mb-2">Study Tracker</h1>
          <p class="text-muted-foreground">Plan → Learn → Review → Done</p>
        </div>
        <div class="header-controls">
          <button id="add-study-card-btn" class="btn btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Study Card
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board">
        <!-- Planned Column -->
        <div class="kanban-column planned">
          <div class="kanban-column-header">
            <h3>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Planned
            </h3>
            <span class="column-count" id="planned-count">${getColumnCount('planned', studyCards)}</span>
          </div>
          <div id="planned-column" class="study-column">
            ${renderStudyCardsByStatus('planned', studyCards)}
            ${renderEmptyState('planned', studyCards)}
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="kanban-column in-progress">
          <div class="kanban-column-header">
            <h3>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              In Progress
            </h3>
            <span class="column-count" id="in-progress-count">${getColumnCount('in-progress', studyCards)}</span>
          </div>
          <div id="in-progress-column" class="study-column">
            ${renderStudyCardsByStatus('in-progress', studyCards)}
            ${renderEmptyState('in-progress', studyCards)}
          </div>
        </div>

        <!-- Reviewing Column -->
        <div class="kanban-column reviewing">
          <div class="kanban-column-header">
            <h3>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Reviewing
            </h3>
            <span class="column-count" id="reviewing-count">${getColumnCount('reviewing', studyCards)}</span>
          </div>
          <div id="reviewing-column" class="study-column">
            ${renderStudyCardsByStatus('reviewing', studyCards)}
            ${renderEmptyState('reviewing', studyCards)}
          </div>
        </div>

        <!-- Completed Column -->
        <div class="kanban-column completed">
          <div class="kanban-column-header">
            <h3>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Completed
            </h3>
            <span class="column-count" id="completed-count">${getColumnCount('completed', studyCards)}</span>
          </div>
          <div id="completed-column" class="study-column">
            ${renderStudyCardsByStatus('completed', studyCards)}
            ${renderEmptyState('completed', studyCards)}
          </div>
        </div>
      </div>
    </div>

    ${renderStudyModals()}
  `;
}

function getColumnCount(status, studyCards) {
  return (studyCards || []).filter(card => card.status === status).length;
}

function renderEmptyState(status, studyCards) {
  const count = getColumnCount(status, studyCards);
  if (count > 0) return '';

  const messages = {
    'planned': 'No planned study cards. Add a new card to get started!',
    'in-progress': 'No study cards in progress. Move a card here to begin.',
    'reviewing': 'Nothing to review. Move completed cards here for final review.',
    'completed': 'No completed cards yet. Keep going!'
  };

  return `
    <div class="empty-column">
      <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
      </svg>
      <p>${messages[status]}</p>
    </div>
  `;
}

function renderStudyCardsByStatus(status, studyCards) {
  const cards = (studyCards || []).filter(card => card.status === status);
  return cards.map(card => renderStudyCard(card)).join('');
}

function renderStudyCard(card) {
  const totalItems = card.checklist?.length || 0;
  const completedItems = card.checklist?.filter(i => i.completed).length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const createdDate = card.created_at ? Helpers.formatDate(card.created_at) : '';
  const updatedDate = card.updated_at ? Helpers.formatDate(card.updated_at) : '';
  const stalenessClass = getStalenessClass(card.lastStudiedAt);

  return `
    <div class="study-card status-${card.status} ${stalenessClass}" data-card-id="${card.id}">
      <div class="study-card-header">
        <div class="study-card-title">${card.title}</div>
        <span class="card-status-badge">${card.status.replace('-', ' ')}</span>
      </div>
      
      <p class="study-card-description">
        ${card.description || 'No description provided'}
      </p>
      
      <div class="progress-container">
        <div class="progress-label">
          <span>Progress</span>
          <span>${completionPercentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${completionPercentage}%"></div>
        </div>
        <div class="text-xs text-muted-foreground mt-1">
          ${completedItems} of ${totalItems} tasks completed
        </div>
      </div>
      
      <div class="card-footer">
        <div class="card-date">
          <span>Created: ${createdDate}</span>
          <span>Updated: ${updatedDate}</span>
        </div>
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>${card.lastStudiedAt ? 'Studied' : 'Not studied'}</span>
        </div>
      </div>

      <div class="card-actions">
      ${card.docUrl
      ? `<button class="btn btn-xs btn-primary open-doc-btn" title="Open attached document">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Open Doc
            </button>`
        : `<button class="btn btn-xs btn-outline attach-doc-btn" title="Attach a document">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
              Attach Doc
            </button>`
        }
      </div>
    </div>
  `;
}

function getStalenessClass(lastStudiedAt) {
  if (!lastStudiedAt) return '';
  const now = new Date();
  const last = new Date(lastStudiedAt);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays > 21) return 'very-stale';
  if (diffDays > 7) return 'stale';
  return '';
}

function renderStudyModals() {
  return `
    <!-- Add Study Card Modal -->
    <div id="add-study-card-modal" class="modal-overlay hidden">
      <div class="modal-content max-w-md">
        <div class="modal-header">
          <h3 class="text-xl font-semibold">Create Study Card</h3>
          <button id="close-add-modal" class="modal-close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Study Topic
                <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="study-card-title" 
                class="input w-full" 
                placeholder="e.g., Advanced JavaScript Concepts"
                autofocus
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Initial Status</label>
              <select id="study-card-status" class="input w-full">
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="reviewing">Reviewing</option>
              </select>
            </div>
            
            <div class="bg-muted p-4 rounded-lg">
              <p class="text-sm text-muted-foreground">
                You can add a description, checklist items, and attach documents after creating the card.
              </p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button id="cancel-add-study" class="btn btn-secondary">Cancel</button>
          <button id="save-study-card" class="btn btn-primary">
            Create Study Card
          </button>
        </div>
      </div>
    </div>

    <!-- Study Card Detail Modal -->
    <div id="study-card-detail-modal" class="modal-overlay hidden">
      <div class="modal-content max-w-2xl">
        <div class="modal-header">
          <h3 class="text-xl font-semibold">Study Card Details</h3>
          <button id="close-detail-modal" class="modal-close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Title</label>
                <input id="detail-title" class="input w-full">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Status</label>
                <select id="detail-status" class="input w-full">
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Document URL</label>
                <div class="flex gap-2">
                  <input id="detail-doc-url" class="input flex-1" placeholder="https://docs.google.com/...">
                  <button class="btn btn-outline" onclick="testDocumentUrl()">
                    Test
                  </button>
                </div>
                <p class="text-xs text-muted-foreground mt-1">
                  Paste a Google Docs, PDF, or other document link
                </p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea 
                id="detail-description" 
                class="input w-full h-32"
                placeholder="Add a detailed description of what you're studying..."
              ></textarea>
              
              <div class="mt-4 p-3 bg-muted rounded-lg">
                <h4 class="text-sm font-medium mb-2">Card Information</h4>
                <div class="space-y-1 text-sm text-muted-foreground">
                  <div id="detail-created" class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                  <div id="detail-updated" class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                  <div id="detail-last-studied" class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer flex justify-between items-center">
          <!-- Delete button -->
          <button 
            id="delete-study-card"
            class="btn btn-danger flex items-center gap-2"
            title="Delete study card"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
            </svg>
            Delete
          </button>

          <div class="flex gap-2">
            <button id="cancel-detail-modal" class="btn btn-secondary">Cancel</button>
            <button id="save-detail-modal" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
<div id="delete-confirm-modal" class="modal-overlay hidden">
  <div class="modal-content max-w-sm">
    <div class="modal-header">
      <h3 class="text-lg font-semibold text-red-600">Delete Study Card</h3>
      <button id="close-delete-modal" class="modal-close-btn">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <p class="text-sm text-muted-foreground">
        Are you sure you want to delete this study card?
        <br />
        <span class="text-red-500 font-medium">
          This action cannot be undone.
        </span>
      </p>
    </div>

    <div class="modal-footer flex justify-end gap-2">
      <button id="cancel-delete-card" class="btn btn-secondary">
        Cancel
      </button>
      <button id="confirm-delete-card" class="btn btn-danger">
        Delete
      </button>
    </div>
  </div>
</div>

  `;
} 