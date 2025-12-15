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
   * 2. DRAG & DROP
   * ============================= */
  setupDragAndDrop() {
    ['planned', 'in-progress', 'reviewing', 'completed'].forEach(status => {
      const columnEl = document.getElementById(`${status}-column`);
      if (!columnEl) return;

      new Sortable(columnEl, {
        group: 'study-cards',
        animation: 150,
        ghostClass: 'dragging',
        filter: '.empty-column',
        swapThreshold: 0.65,
        onEnd: evt => {
          const cardId = Number(evt.item.dataset.cardId);
          const newStatus = evt.to.id.replace('-column', '');
          this.updateCardStatus(cardId, newStatus);
        }
      });
    });
  }

  /* =============================
   * 3. EVENT LISTENERS
   * ============================= */
  setupEventListeners() {
    document.addEventListener('click', e => {
      /* ---- STUDY CARD ---- */
      const cardEl = e.target.closest('.study-card');

      if (cardEl) {
        const cardId = Number(cardEl.dataset.cardId);
        const card = this.studyCards.find(c => c.id === cardId);
        if (!card) return;

        if (e.target.classList.contains('open-doc-btn')) {
          window.open(card.docUrl, '_blank');
          this.markStudied(cardId);
          return;
        }

        if (!e.target.closest('button')) {
          this.openDetailModal(cardId);
          return;
        }
      }

      /* ---- DETAIL MODAL ---- */
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

      /* ---- ADD MODAL ---- */
      if (
        e.target.closest('#close-add-modal') ||
        e.target.closest('#cancel-add-study')
      ) {
        this.closeAddModal();
        return;
      }

      if (e.target.id === 'save-study-card') {
        this.handleAddStudyCard();
      }
    });

    document
      .getElementById('add-study-card-btn')
      ?.addEventListener('click', () => this.openAddModal());
  }

  /* =============================
   * 4. MODALS
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

    document
      .getElementById('study-card-detail-modal')
      .classList.remove('hidden');
  }

  closeDetailModal() {
    document
      .getElementById('study-card-detail-modal')
      .classList.add('hidden');
    this.currentEditingCardId = null;
  }

  saveDetailModal() {
    const card = this.studyCards.find(c => c.id === this.currentEditingCardId);
    if (!card) return;

    card.title = document.getElementById('detail-title').value.trim();
    card.description =
      document.getElementById('detail-description').value.trim();
    card.status = document.getElementById('detail-status').value;
    card.docUrl =
      document.getElementById('detail-doc-url').value.trim() || null;
    card.updated_at = new Date().toISOString();

    this.saveStudyCards();
    this.closeDetailModal();

    document.getElementById('page-content').innerHTML = this.render();
    this.init();
  }

  /* =============================
   * 5. CARD ACTIONS
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
    this.updateColumns([oldStatus, newStatus]);
  }

  updateColumns(statuses) {
    statuses.forEach(status => {
      const columnEl = document.getElementById(`${status}-column`);
      if (!columnEl) return;

      const cardsHtml = renderStudyCardsByStatus(status, this.studyCards);
      const emptyHtml = renderEmptyState(status, this.studyCards);
      columnEl.innerHTML = cardsHtml || emptyHtml;
    });

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
   * 6. STORAGE
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
}
