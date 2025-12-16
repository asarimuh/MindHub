const DOCS_CACHE_KEY = 'documents_cache_v1';

const DocumentsService = {
  loadFromCache(controller) {
    const cached = Storage.get(DOCS_CACHE_KEY);

    if (cached && Array.isArray(cached.files)) {
      controller.allFiles = cached.files;

      const grid = document.getElementById('docs-grid');
      if (grid) grid.innerHTML = renderDocumentsGrid(controller.allFiles);

      controller.lastFetched = cached.lastFetched;
      return true;
    }

    return false;
  },

  async fetchFromServer(controller) {
    const res = await fetch('http://localhost:3000/api/docs');
    const data = await res.json();

    const files = data.files || [];

    controller.allFiles = files;
    controller.lastFetched = new Date().toISOString();

    Storage.set(DOCS_CACHE_KEY, {
      files,
      lastFetched: controller.lastFetched
    });

    const grid = document.getElementById('docs-grid');
    if (grid) grid.innerHTML = renderDocumentsGrid(files);
  }
};
