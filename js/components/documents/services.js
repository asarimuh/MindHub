const DocumentsService = {
  async loadDocs(controller) {
    try {
      const res = await fetch('http://localhost:3000/api/docs');
      const data = await res.json();
      controller.allFiles = data.files || [];

      const grid = document.getElementById('docs-grid');
      if (grid) grid.innerHTML = renderDocumentsGrid(controller.allFiles);
    } catch (err) {
      console.error('Error loading documents:', err);
      const grid = document.getElementById('docs-grid');
      if (grid) grid.innerHTML = controller.renderEmptyState ? controller.renderEmptyState() : '';
    }
  }
};
