class StudyTracker {
  constructor() {
    this.name = 'studyTracker';
    this.studyCards = Storage.get('studyCards') || [];
    this.nextId = Storage.get('nextStudyCardId') || 1;
    this.currentEditingCardId = null;
  }

  render() {
    return renderStudyTrackerPage(this.studyCards);
  }

  renderColumn(status, title) {
    const count = this.studyCards.filter(card => card.status === status).length;
    return `
      <div class="kanban-column">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold">${title}</h3>
          <span class="status-badge status-${status}" id="${status}-count">${count}</span>
        </div>
        <div id="${status}-column" class="study-column">
          ${this.renderStudyCardsByStatus(status)}
        </div>
      </div>
    `;
  }

  renderStudyCardsByStatus(status) {
    const cards = this.studyCards.filter(card => card.status === status);
    return cards.map(card => this.renderStudyCard(card)).join('');
  }

  renderStudyCard(card) {
    const totalItems = card.checklist.length;
    const completedItems = card.checklist.filter(item => item.completed).length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    const createdDate = Helpers.formatDate(card.created_at);
    const updatedDate = Helpers.formatDate(card.updated_at);

    return `
      <div class="study-card" data-card-id="${card.id}">
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-medium flex-1">${card.title}</h4>
          <span class="status-badge status-${card.status}">${card.status.charAt(0).toUpperCase() + card.status.slice(1)}</span>
        </div>
        <p class="text-sm text-gray-600 mb-2 line-clamp-2">${card.description || 'No description'}</p>
        <div class="flex items-center text-xs text-gray-500 mb-2">
          <span>${completedItems}/${totalItems} tasks</span>
          <div class="flex-1 bg-gray-200 rounded-full h-1 mx-2">
            <div class="bg-blue-600 h-1 rounded-full" style="width: ${completionPercentage}%"></div>
          </div>
          <span>${completionPercentage}%</span>
        </div>
        <div class="flex flex-wrap gap-1 mb-2">
          ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Created: ${createdDate}</span>
          <span>Updated: ${updatedDate}</span>
        </div>
      </div>
    `;
  }

  renderModals() {
    return `
      <!-- Add Study Card Modal -->
      <div id="add-study-card-modal" class="modal-overlay hidden">
        ${this.renderAddModal()}
      </div>

      <!-- Study Card Detail Modal -->
      <div id="study-card-detail-modal" class="modal-overlay hidden">
        ${this.renderDetailModal()}
      </div>
    `;
  }

  renderAddModal() {
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

  renderDetailModal() {
    return `
      <div class="modal-content p-6 w-full max-w-3xl">
        <!-- Detail modal content (similar to previous implementation) -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold" id="detail-modal-title">Study Card Details</h3>
          <button id="close-detail-modal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <!-- Rest of detail modal content... -->
      </div>
    `;
  }

  init() {
    this.setupDragAndDrop();
    this.setupEventListeners();
    this.updateColumnCounts();
  }

  setupDragAndDrop() {
    const columns = ['planned-column', 'in-progress-column', 'reviewing-column', 'completed-column'];
    
    columns.forEach(columnId => {
      new Sortable(document.getElementById(columnId), {
        group: 'study-cards',
        animation: 150,
        onEnd: (evt) => {
          const cardId = parseInt(evt.item.getAttribute('data-card-id'));
          const newStatus = columnId.split('-')[0];
          this.updateCardStatus(cardId, newStatus);
        }
      });
    });
  }

  setupEventListeners() {
    // Add event listeners for study tracker
    document.getElementById('add-study-card-btn').addEventListener('click', () => {
      document.getElementById('add-study-card-modal').classList.remove('hidden');
    });

    // Add other event listeners...
  }

  updateCardStatus(cardId, newStatus) {
    const cardIndex = this.studyCards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      this.studyCards[cardIndex].status = newStatus;
      this.studyCards[cardIndex].updated_at = new Date().toISOString().split('T')[0];
      this.updateColumnCounts();
      this.saveStudyCards();
    }
  }

  updateColumnCounts() {
    const counts = { planned: 0, 'in-progress': 0, reviewing: 0, completed: 0 };
    
    this.studyCards.forEach(card => {
      counts[card.status]++;
    });
    
    Object.keys(counts).forEach(status => {
      const element = document.getElementById(`${status}-count`);
      if (element) element.textContent = counts[status];
    });
  }

  saveStudyCards() {
    Storage.set('studyCards', this.studyCards);
    Storage.set('nextStudyCardId', this.nextId);
  }
}