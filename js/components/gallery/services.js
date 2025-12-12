const GalleryService = {
  openUploadModal() {
    const modal = document.getElementById('upload-photos-modal');
    if (modal) modal.classList.remove('hidden');
  },
  closeUploadModal() {
    const modal = document.getElementById('upload-photos-modal');
    if (modal) modal.classList.add('hidden');
    const input = document.getElementById('file-input');
    if (input) input.value = '';
    const confirmBtn = document.getElementById('confirm-upload');
    if (confirmBtn) confirmBtn.disabled = true;
  },
  handleFileSelect(event) {
    const files = event.target.files;
    const confirmBtn = document.getElementById('confirm-upload');
    if (files && files.length > 0) {
      if (confirmBtn) confirmBtn.disabled = false;
    } else {
      if (confirmBtn) confirmBtn.disabled = true;
    }
  }
};
