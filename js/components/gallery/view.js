function renderGallery(images) {
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
        ${images.map(image => renderGalleryImageItem(image)).join('')}
      </div>
    </div>

    ${renderGalleryUploadModal()}
  `;
}

function renderGalleryImageItem(image) {
  return `
    <div class="image-item">
      <img src="${image.url}" alt="${image.alt}">
    </div>
  `;
}

function renderGalleryUploadModal() {
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
