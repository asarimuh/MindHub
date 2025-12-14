function renderStudyTrackerPage(studyCards) {
  return `
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Study Tracker</h1>
        <p class="text-muted-foreground mt-1">Track your learning progress with kanban boards</p>
      </div>
      <div class="flex space-x-2">
        <div class="relative">
          <input 
            id="study-search"
            type="text" 
            placeholder="Search study cards..."
            class="input w-64 pl-9"
          >
          <svg class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button id="filter-study-btn" class="btn btn-secondary flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          <span>Filter</span>
        </button>
        <button id="add-study-card-btn" class="btn btn-primary flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Add Card</span>
        </button>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${renderStudyColumn('planned', 'Planned', studyCards)}
      ${renderStudyColumn('in-progress', 'In Progress', studyCards)}
      ${renderStudyColumn('reviewing', 'Reviewing', studyCards)}
      ${renderStudyColumn('completed', 'Completed', studyCards)}
    </div>

    ${renderStudyModals()}
  `;
}

function renderStudyColumn(status, title, studyCards) {
  const count = (studyCards || []).filter(card => card.status === status).length;
  return `
    <div class="kanban-column">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold">${title}</h3>
        <span class="status-badge status-${status}" id="${status}-count">${count}</span>
      </div>
      <div id="${status}-column" class="study-column">
        ${renderStudyCardsByStatus(status, studyCards)}
      </div>
    </div>
  `;
}

function renderStudyCardsByStatus(status, studyCards) {
  const cards = (studyCards || []).filter(card => card.status === status);
  return cards.map(card => renderStudyCard(card)).join('');
}

function renderStudyCard(card) {
  const totalItems = card.checklist ? card.checklist.length : 0;
  const completedItems = card.checklist
    ? card.checklist.filter(i => i.completed).length
    : 0;

  const completionPercentage =
    totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : 0;

  const createdDate = card.created_at
    ? Helpers.formatDate(card.created_at)
    : '';

  const updatedDate = card.updated_at
    ? Helpers.formatDate(card.updated_at)
    : '';

  const stalenessClass = getStalenessClass(card.lastStudiedAt);

  return `
    <div class="study-card ${stalenessClass}" data-card-id="${card.id}">
      
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-medium flex-1">${card.title}</h4>
        <span class="status-badge status-${card.status}">
          ${card.status.replace('-', ' ')}
        </span>
      </div>

      <p class="text-sm text-gray-600 mb-2 line-clamp-2">
        ${card.description || 'No description'}
      </p>

      <div class="flex items-center gap-2 mb-2">
        ${
          card.docUrl
            ? `<button class="btn btn-xs btn-secondary open-doc-btn">Open Doc</button>`
            : `<button class="btn btn-xs btn-outline attach-doc-btn">Attach Doc</button>`
        }
      </div>

      <div class="flex items-center text-xs text-gray-500 mb-2">
        <span>${completedItems}/${totalItems} tasks</span>
        <div class="flex-1 bg-gray-200 rounded-full h-1 mx-2">
          <div class="bg-blue-600 h-1 rounded-full"
               style="width: ${completionPercentage}%">
          </div>
        </div>
        <span>${completionPercentage}%</span>
      </div>

      <div class="flex justify-between text-xs text-gray-500">
        <span>Created: ${createdDate}</span>
        <span>Updated: ${updatedDate}</span>
      </div>
    </div>
  `;
}

function getStalenessClass(lastStudiedAt) {
  if (!lastStudiedAt) return '';

  const now = new Date();
  const last = new Date(lastStudiedAt);
  const diffDays = Math.floor(
    (now - last) / (1000 * 60 * 60 * 24)
  );

  if (diffDays > 21) return 'very-stale';
  if (diffDays > 7) return 'stale';
  return '';
}


function renderStudyModals() {
  return `
    <div id="add-study-card-modal" class="modal-overlay hidden">
      ${renderAddModal()}
    </div>
    <div id="study-card-detail-modal" class="modal-overlay hidden">
      ${renderDetailModal()}
    </div>
  `;
}

function renderAddModal() {
  return `
    <div class="modal-content p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Add New Study Card</h3>
        <button id="close-add-modal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input type="text" id="study-card-title" class="input w-full" placeholder="Enter study topic">
        </div>
        <div class="flex justify-end space-x-2">
          <button id="cancel-add-study" class="btn btn-secondary">Cancel</button>
          <button id="save-study-card" class="btn btn-primary">Add Card</button>
        </div>
      </div>
    </div>
  `;
}

function renderDetailModal() {
  return `
    <div class="modal-content p-6 w-full max-w-3xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Study Card Details</h3>
        <button id="close-detail-modal" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Title</label>
          <input id="detail-title" class="input w-full" />
        </div>

        <div>
          <label class="block text-sm mb-1">Description</label>
          <textarea id="detail-description" class="input w-full"></textarea>
        </div>

        <div>
          <label class="block text-sm mb-1">Status</label>
          <select id="detail-status" class="input w-full">
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="reviewing">Reviewing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Doc URL</label>
          <input id="detail-doc-url" class="input w-full" />
        </div>

        <div class="text-xs text-gray-500 space-y-1">
          <div id="detail-created"></div>
          <div id="detail-updated"></div>
          <div id="detail-last-studied"></div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button id="cancel-detail-modal" class="btn btn-secondary">Close</button>
          <button id="save-detail-modal" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  `;
}

