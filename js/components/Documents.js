class Documents {
  constructor() {
    this.name = 'documents';
    this.allFiles = [];
    this.API_KEY = "AIzaSyAImgEo_KH2xyLTs61pTkT_uEqBB4ls6Sg";
    this.FOLDER_ID = "1T8wpylDLWJZRnif8SkfkR7987sKZKDZc";
  }

  render() {
    return `
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight mb-2">Documents</h1>
        <p class="text-muted-foreground">Your Google Drive files and documents</p>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="flex-1 max-w-md">
          <input 
            id="documents-search"
            type="text" 
            placeholder="Search documents..."
            class="input w-full"
          />
        </div>
        <div class="flex space-x-2">
          <button class="btn btn-secondary flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <span>Filter</span>
          </button>
          <button class="btn btn-secondary flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
            </svg>
            <span>Sort</span>
          </button>
        </div>
      </div>

      <!-- Documents Grid -->
      <div id="docs-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="flex items-center justify-center p-8">
          <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-gray-200 h-10 w-10"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    this.loadDocs();
    this.setupEventListeners();
  }

  async loadDocs() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${this.FOLDER_ID}' in parents and trashed=false&fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime)&key=${this.API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      this.allFiles = data.files || [];
      this.renderFiles(this.allFiles);
    } catch (error) {
      console.error("Error loading documents:", error);
      this.showErrorState();
    }
  }

  renderFiles(files) {
    const grid = document.getElementById('docs-grid');
    
    if (files.length === 0) {
      grid.innerHTML = this.renderEmptyState();
      return;
    }
    
    grid.innerHTML = files.map(file => this.renderFileCard(file)).join('');
  }

  renderFileCard(file) {
    const fileType = file.mimeType.replace("application/vnd.google-apps.", "");
    const formattedFileType = fileType.charAt(0).toUpperCase() + fileType.slice(1);
    const modifiedDate = new Date(file.modifiedTime);
    const formattedDate = modifiedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    return `
      <div class="card p-4 cursor-pointer" onclick="window.open('${file.webViewLink}', '_blank')">
        <div class="flex items-start gap-3 mb-3">
          <img src="${file.iconLink}" class="w-8 h-8 mt-1" alt="icon">
          <div class="flex-1 min-w-0">
            <h2 class="font-medium text-base truncate">${file.name}</h2>
            <p class="text-xs text-muted-foreground mt-1">${formattedFileType}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-3">
          <span class="badge">${formattedFileType}</span>
        </div>

        <div class="flex items-center text-xs text-muted-foreground">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Modified: ${formattedDate}
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="col-span-full flex flex-col items-center justify-center p-8 text-center">
        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-lg font-medium mb-1">No documents found</h3>
        <p class="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    `;
  }

  showErrorState() {
    const grid = document.getElementById('docs-grid');
    grid.innerHTML = `
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
    searchInput.addEventListener('input', Helpers.debounce((e) => {
      const query = e.target.value.toLowerCase();
      const filtered = this.allFiles.filter(file => 
        file.name.toLowerCase().includes(query)
      );
      this.renderFiles(filtered);
    }, 300));
  }
}