class Gallery {
  constructor() {
    this.name = 'gallery';
    this.images = [
      {
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Friends gathering"
      },
      {
        url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Team meeting"
      },
      {
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Workspace"
      },
      {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Conference"
      },
      {
        url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Study group"
      },
      {
        url: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Team building"
      },
      {
        url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Project completion"
      },
      {
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        alt: "Celebration"
      }
    ];
  }

  render() {
    return `
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight mb-2">Gallery</h1>
        <p class="text-muted-foreground">Your photos and images</p>
      </div>

      <div class="card p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-semibold">Memory Board</h2>
            <p class="text-muted-foreground mt-1">Your important moments</p>
          </div>
          <button id="add-photos-btn" class="btn btn-primary flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Photos</span>
          </button>
        </div>
        
        <div class="image-grid">
          ${this.images.map(image => this.renderImageItem(image)).join('')}
        </div>
      </div>

      ${this.renderUploadModal()}
    `;
  }

  renderImageItem(image) {
    return `
      <div class="image-item">
        <img src="${image.url}" alt="${image.alt}">
      </div>
    `;
  }

  renderUploadModal() {
    return `
      <div id="upload-photos-modal" class="modal-overlay hidden">
        <div class="modal-content p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Add Photos</h3>
            <button id="close-upload-modal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-600 mb-2">Drag and drop your photos here</p>
              <p class="text-sm text-gray-500 mb-4">or</p>
              <button id="browse-files-btn" class="btn btn-primary">Browse Files</button>
              <input type="file" id="file-input" class="hidden" multiple accept="image/*">
            </div>
            <div class="flex justify-end space-x-2">
              <button id="cancel-upload" class="btn btn-secondary">Cancel</button>
              <button id="confirm-upload" class="btn btn-primary" disabled>Upload Photos</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add photos button
    document.getElementById('add-photos-btn').addEventListener('click', () => {
      document.getElementById('upload-photos-modal').classList.remove('hidden');
    });

    // Close upload modal
    document.getElementById('close-upload-modal').addEventListener('click', this.closeUploadModal.bind(this));
    document.getElementById('cancel-upload').addEventListener('click', this.closeUploadModal.bind(this));

    // Browse files button
    document.getElementById('browse-files-btn').addEventListener('click', () => {
      document.getElementById('file-input').click();
    });

    // File input change
    document.getElementById('file-input').addEventListener('change', this.handleFileSelect.bind(this));
  }

  closeUploadModal() {
    document.getElementById('upload-photos-modal').classList.add('hidden');
    document.getElementById('file-input').value = '';
    document.getElementById('confirm-upload').disabled = true;
  }

  handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
      document.getElementById('confirm-upload').disabled = false;
    }
  }
}