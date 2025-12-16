class Gallery {
  constructor() {
    this.name = 'gallery';
    this.images = this.loadImages();
  }

  loadImages() {
    return Storage.get('simpleGallery') || [];
  }

  render() {
    return renderSimpleGallery(this.images);
  }

  init() {
    this.setupEventListeners();
    this.renderGallery();
  }

  setupEventListeners() {
    // Add photo button
    document.getElementById('add-photo-btn')?.addEventListener('click', () => {
      document.getElementById('photo-upload-input')?.click();
    });

    // Delete all button
    document.getElementById('delete-all-btn')?.addEventListener('click', () => {
      this.deleteAllImages();
    });

    // Upload photo
    document.getElementById('photo-upload-input')?.addEventListener('change', (e) => {
      this.handlePhotoUpload(e);
    });

    // Lightbox & delete actions
    document.getElementById('collage-board')?.addEventListener('click', (e) => {
      const img = e.target.closest('.collage-img');
      if (!img) return;

      const imgUrl = img.dataset.url;
      const index = parseInt(img.dataset.index);

      // Delete button click
      if (e.target.classList.contains('delete-btn')) {
        this.deleteImage(index);
      } else {
        this.openLightbox(imgUrl);
      }
    });
  }

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.images.unshift(e.target.result);
      this.saveGallery();
      this.renderGallery();
      this.showAddedNotification();
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  }

  openLightbox(imgUrl) {
    const lightbox = document.createElement('div');
    lightbox.className = 'collage-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="${imgUrl}" alt="Photo">
        <button class="lightbox-close">×</button>
      </div>
    `;

    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      document.body.removeChild(lightbox);
      document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', handleEscape);
  }

  renderGallery() {
    const container = document.getElementById('collage-board');
    if (container) {
      container.innerHTML = this.images.length > 0
        ? this.images.map((url, index) => this.renderGalleryItem(url, index)).join('')
        : renderEmptyCollage();

      // Update counter
      const counter = document.querySelector('.counter-number');
      if (counter) counter.textContent = this.images.length;
    }
  }

  renderGalleryItem(url, index) {
    return `
      <div class="collage-img" style="background-image: url('${url}')" data-index="${index}" data-url="${url}">
        <button class="delete-btn" title="Delete Photo">🗑</button>
      </div>
    `;
  }

  deleteImage(index) {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    this.images.splice(index, 1);
    this.saveGallery();
    this.renderGallery();
  }

  deleteAllImages() {
    if (!confirm('Are you sure you want to delete ALL photos?')) return;
    this.images = [];
    this.saveGallery();
    this.renderGallery();
  }

  showAddedNotification() {
    const notification = document.createElement('div');
    notification.className = 'collage-notification';
    notification.textContent = 'Photo added';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 1500);
    }, 10);
  }

  saveGallery() {
    Storage.set('simpleGallery', this.images);
  }
}
