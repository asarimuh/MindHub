function renderSimpleGallery(images) {
  return `
    <div class="collage-container">
      <div class="mb-8 flex justify-between items-center">
        <!-- Left side -->
        <div class="header-left">
          <h1 class="text-2xl font-semibold tracking-tight mb-2">Gallery</h1>
          <p class="text-muted-foreground">Random images . . . </p>
        </div>

        <!-- Right side buttons -->
        <div class="header-right">
          <div class="header-buttons flex items-center gap-2">
            <button id="add-photo-btn" class="add-photo-btn">
              <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Photo
            </button>
            <button id="delete-all-btn" class="delete-all-btn">Delete All</button>
            <input type="file" id="photo-upload-input" accept="image/*" class="hidden">
          </div>
        </div>
      </div>

      <!-- Collage Board -->
      <div id="collage-board" class="collage-board">
        ${images.length > 0 ? images.map((url, index) => `
          <div class="collage-img" style="background-image: url('${url}')" data-index="${index}" data-url="${url}">
            <button class="delete-btn" title="Delete Photo">🗑</button>
          </div>
        `).join('') : renderEmptyCollage()}
      </div>

      <!-- Photo Counter -->
      <div class="photo-counter">
        <span class="counter-number">${images.length}</span>
        <span class="counter-text">photos</span>
      </div>
    </div>
  `;
}

function renderEmptyCollage() {
  return `
    <div class="empty-collage flex flex-col items-center justify-center">
      <svg class="empty-icon mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <p class="empty-text mb-4 text-center">No photos yet</p>
      <button onclick="document.getElementById('photo-upload-input').click()" class="upload-first-btn">
        Upload your first photo
      </button>
    </div>
  `;
}
