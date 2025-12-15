class StudyTracker {
  /* =============================
   * 1. CONSTRUCTOR & LIFECYCLE
   * ============================= */
  constructor() {
    this.name = 'studyTracker';
    this.studyCards = Storage.get('studyCards') || [];
    this.nextId = Storage.get('nextStudyCardId') || 1;
    this.currentEditingCardId = null;
  }

  init() {
    this.setupDragAndDrop();
    this.setupEventListeners();
    this.updateColumnCounts();
  }

  render() {
    return renderStudyTrackerPage(this.studyCards);
  }

  /* =============================
   * 2. RENDER METHODS (HTML)
   * ============================= */

  renderColumn(status, title) {
    const cardsHtml = this.renderStudyCardsByStatus(status);
    const emptyHtml = renderEmptyState(status, this.studyCards);

    return `
    <div class="kanban-column">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold">${title}</h3>
        <span class="status-badge status-${status}" id="${status}-count">
          ${this.studyCards.filter(card => card.status === status).length}
        </span>
      </div>
      <div id="${status}-column" class="study-column">
        ${cardsHtml || emptyHtml}
      </div>
    </div>
  `;
  }


  renderStudyCardsByStatus(status) {
    return this.studyCards
      .filter(card => card.status === status)
      .map(card => this.renderStudyCard(card))
      .join('');
  }

  renderStudyCard(card) {
    const totalItems = card.checklist?.length || 0;
    const completedItems = card.checklist?.filter(i => i.completed).length || 0;
    const completionPercentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const createdDate = card.created_at ? Helpers.formatDate(card.created_at) : '';
    const updatedDate = card.updated_at ? Helpers.formatDate(card.updated_at) : '';
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

        <div class="flex gap-2 mb-2">
          ${card.docUrl
        ? `<button class="btn btn-xs btn-secondary open-doc-btn">Open Doc</button>`
        : `<button class="btn btn-xs btn-outline attach-doc-btn">Attach Doc</button>`
      }
        </div>

        <div class="flex items-center text-xs text-gray-500 mb-2">
          <span>${completedItems}/${totalItems} tasks</span>
          <div class="flex-1 bg-gray-200 rounded-full h-1 mx-2">
            <div class="bg-blue-600 h-1 rounded-full" style="width: ${completionPercentage}%"></div>
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

  renderModals() {
    return `
      <div id="add-study-card-modal" class="modal-overlay hidden">
        ${this.renderAddModal()}
      </div>

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
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input id="study-card-title" class="input w-full" />
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
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Study Card Details</h3>
        <button id="close-detail-modal" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium">Title</label>
          <input id="detail-title" class="input w-full" />
        </div>

        <div>
          <label class="text-sm font-medium">Description</label>
          <textarea id="detail-description" class="input w-full"></textarea>
        </div>

        <div>
          <label class="text-sm font-medium">Status</label>
          <select id="detail-status" class="input w-full">
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="reviewing">Reviewing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium">Google Doc URL</label>
          <input id="detail-doc-url" class="input w-full" />
        </div>

        <div class="text-xs text-gray-500">
          <div id="detail-created"></div>
          <div id="detail-updated"></div>
          <div id="detail-last-studied"></div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button id="cancel-detail-modal" class="btn btn-secondary">Cancel</button>
          <button id="save-detail-modal" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  `;
  }


  /* =============================
   * 3. SETUP & EVENT BINDING
   * ============================= */

  setupDragAndDrop() {
    ['planned', 'in-progress', 'reviewing', 'completed'].forEach(status => {
      const columnEl = document.getElementById(`${status}-column`);
      if (!columnEl) return;

      new Sortable(columnEl, {
        group: 'study-cards',
        animation: 150,
        ghostClass: 'dragging',  // optional CSS for ghost
        swapThreshold: 0.65,
        onEnd: evt => {
          const cardId = Number(evt.item.dataset.cardId);

          const newStatus = evt.to.id.replace('-column', '');
          this.updateCardStatus(cardId, newStatus);
        }
      });
    });
  }


  setupEventListeners() {
    document.addEventListener('click', (e) => {

      /* ===============================
         STUDY CARD INTERACTIONS
      =============================== */

      const cardEl = e.target.closest('.study-card');

      if (cardEl) {
        const cardId = Number(cardEl.dataset.cardId);
        const card = this.studyCards.find(c => c.id === cardId);
        if (!card) return;

        // Open doc
        if (e.target.classList.contains('open-doc-btn')) {
          window.open(card.docUrl, '_blank');
          this.markStudied(cardId);
          return;
        }

        // Click card body → open detail modal
        if (!e.target.closest('button')) {
          this.openDetailModal(cardId);
          return;
        }
      }

      /* ===============================
         DETAIL MODAL BUTTONS
      =============================== */

      if (
        e.target.closest('#close-detail-modal') ||
        e.target.closest('#cancel-detail-modal')
      ) {
        this.closeDetailModal();
        return;
      }

      if (e.target.id === 'save-detail-modal') {
        this.saveDetailModal();
        return;
      }

      /* ===============================
         ADD STUDY CARD MODAL
      =============================== */

      if (
        e.target.closest('#close-add-modal') ||
        e.target.closest('#cancel-add-study')
      ) {
        this.closeAddModal();
        return;
      }

      if (e.target.id === 'save-study-card') {
        this.handleAddStudyCard();
        return;
      }
    });

    document
      .getElementById('add-study-card-btn')
      ?.addEventListener('click', () => this.openAddModal());
  }

  /* =============================
   * 4. MODAL CONTROLS
   * ============================= */

  openAddModal() {
    document.getElementById('study-card-title').value = '';
    document.getElementById('add-study-card-modal').classList.remove('hidden');
  }

  closeAddModal() {
    document.getElementById('add-study-card-modal').classList.add('hidden');
  }

  openDetailModal(cardId) {
    const card = this.studyCards.find(c => c.id === cardId);
    if (!card) return;

    this.currentEditingCardId = cardId;

    const modal = document.getElementById('study-card-detail-modal');
    if (!modal) return;

    const el = id => document.getElementById(id);

    el('detail-title').value = card.title;
    el('detail-description').value = card.description || '';
    el('detail-status').value = card.status;
    el('detail-doc-url').value = card.docUrl || '';

    el('detail-created').textContent =
      `Created: ${Helpers.formatDate(card.created_at)}`;

    el('detail-updated').textContent =
      `Updated: ${Helpers.formatDate(card.updated_at)}`;

    el('detail-last-studied').textContent =
      card.lastStudiedAt
        ? `Last studied: ${Helpers.formatDate(card.lastStudiedAt)}`
        : 'Not studied yet';

    modal.classList.remove('hidden');
  }

  saveDetailModal() {
    const card = this.studyCards.find(c => c.id === this.currentEditingCardId);
    if (!card) return;

    card.title = document.getElementById('detail-title').value.trim();
    card.description = document.getElementById('detail-description').value.trim();
    card.status = document.getElementById('detail-status').value;
    card.docUrl = document.getElementById('detail-doc-url').value.trim() || null;
    card.updated_at = new Date().toISOString();

    this.saveStudyCards();
    this.closeDetailModal();

    // Re-render board
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = this.render();
    this.init();
  }

  closeDetailModal() {
    document
      .getElementById('study-card-detail-modal')
      .classList.add('hidden');

    this.currentEditingCardId = null;
  }

  /* =============================
   * 5. CARD ACTIONS / STATE
   * ============================= */

  handleAddStudyCard() {
    const title = document.getElementById('study-card-title').value.trim();
    if (!title) return alert('Please enter a study topic');

    this.studyCards.push(this.createEmptyCard(title));
    this.saveStudyCards();
    this.closeAddModal();

    document.getElementById('page-content').innerHTML = this.render();
    this.init();
  }

  createEmptyCard(title) {
    const now = new Date().toISOString();

    return {
      id: this.nextId++,
      title,
      description: '',
      docUrl: null,
      checklist: [],
      tags: [],
      status: 'planned',
      created_at: now,
      updated_at: now,
      lastStudiedAt: null
    };
  }

  updateCardStatus(cardId, newStatus) {
    const card = this.studyCards.find(c => c.id === cardId);
    if (!card) return;

    const oldStatus = card.status;
    card.status = newStatus;
    card.updated_at = new Date().toISOString();
    this.saveStudyCards();

    // Re-render only affected columns
    this.updateColumns([oldStatus, newStatus]);
  }

  updateColumns(statuses) {
    statuses.forEach(status => {
      const columnEl = document.getElementById(`${status}-column`);
      if (!columnEl) return;

      // Use View.js rendering functions to rebuild full HTML
      const cardsHtml = renderStudyCardsByStatus(status, this.studyCards);
      const emptyHtml = renderEmptyState(status, this.studyCards);

      columnEl.innerHTML = cardsHtml || emptyHtml;
    });

    // Update counts in the column headers
    this.updateColumnCounts();
  }

  markStudied(cardId) {
    const card = this.studyCards.find(c => c.id === cardId);
    if (!card) return;

    card.lastStudiedAt = new Date().toISOString();
    card.updated_at = card.lastStudiedAt;
    this.saveStudyCards();
  }

  /* =============================
   * 6. UTILITIES & PERSISTENCE
   * ============================= */

  updateColumnCounts() {
    const counts = { planned: 0, 'in-progress': 0, reviewing: 0, completed: 0 };

    this.studyCards.forEach(card => counts[card.status]++);
    Object.entries(counts).forEach(([status, count]) => {
      const el = document.getElementById(`${status}-count`);
      if (el) el.textContent = count;
    });
  }

  saveStudyCards() {
    Storage.set('studyCards', this.studyCards);
    Storage.set('nextStudyCardId', this.nextId);
  }

  updateEmptyStates(statuses) {
    statuses.forEach(status => {
      const columnEl = document.getElementById(`${status}-column`);
      if (!columnEl) return;

      const cardsHtml = this.renderStudyCardsByStatus(status);
      const emptyHtml = renderEmptyState(status, this.studyCards);
      columnEl.innerHTML = cardsHtml || emptyHtml;
    });
  }
}