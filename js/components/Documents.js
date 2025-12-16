class Documents {
  constructor() {
    this.name = 'documents';
    this.allFiles = [];
  }

  render() {
    return renderDocuments(this.allFiles);
  }

  init() {
    const hasCache = DocumentsService.loadFromCache(this);

    // Only auto-fetch if no cache exists
    if (!hasCache) {
      DocumentsService.fetchFromServer(this).catch(() => {
        const grid = document.getElementById('docs-grid');
        if (grid) grid.innerHTML = this.renderEmptyState();
      });
    }
    this.setupEventListeners();
  }

  renderEmptyState() {
    return `
      <div class="col-span-full flex flex-col items-center justify-center p-8 text-center">
        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="text-lg font-medium mb-1">Failed to load documents</h3>
        <p class="text-muted-foreground">Please check your connection and try again.</p>
      </div>
    `;
  }

  setupEventListeners() {
    const searchInput = document.getElementById('documents-search');
    const refreshBtn = document.getElementById('documents-refresh');

    refreshBtn.addEventListener('click', async () => {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing...';

    try {
      await DocumentsService.fetchFromServer(this);
    } catch {
      alert('Failed to refresh documents.');
    } finally {
      refreshBtn.disabled = false;
      refreshBtn.textContent = 'Refresh';
    }
    });

    searchInput.addEventListener('input', Helpers.debounce((e) => {
      const query = e.target.value.toLowerCase();
      const filtered = this.allFiles.filter(file => file.name.toLowerCase().includes(query));
      const grid = document.getElementById('docs-grid');
      if (grid) grid.innerHTML = renderDocumentsGrid(filtered);
    }, 300));
  }
}