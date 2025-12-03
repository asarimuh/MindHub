// Photo widget module (single-image fade version)
// Exposes: window.DashboardModules.Features.Photo
(function () {
  window.DashboardModules = window.DashboardModules || {};
  window.DashboardModules.Features = window.DashboardModules.Features || {};

  class PhotoWidget {
    constructor(dashboard) {
      this.dashboard = dashboard;
      this.state = dashboard.state;
      this.photoIndex = this.state.photoList && this.state.photoList.length ? 0 : -1;
      this.photoInterval = null;
      this.widget = null;
      this.img = null;
      this.boundNext = this.nextPhoto.bind(this);
      this.boundToggle = this.toggleMemoryBoard.bind(this);
    }

    init() {
      // DOM references - may be null if not in DOM
      this.widget = document.getElementById("photo-widget");
      this.img = document.getElementById("photo-widget-img");

      // Guard
      if (!this.widget || !this.img) return;

      // ensure photoIndex is in range
      if (this.photoIndex < 0 && this.state.photoList.length) this.photoIndex = 0;

      // set initial src
      this.img.src = this.state.photoList[this.photoIndex] || "";

      // toggle button
      document.getElementById("photo-toggle")?.addEventListener("click", this.boundToggle);

      // next button
      document.getElementById("photo-next")?.addEventListener("click", this.boundNext);

      // initial visibility
      if (!this.state.memoryActive) {
        this.widget.style.display = "none";
        const btn = document.getElementById("photo-toggle");
        if (btn) btn.textContent = "Enable";
      } else {
        this.startAutoSlide();
      }

      // register cleanup with dashboard
      this.dashboard.onDestroy(() => this.destroy());
    }

    startAutoSlide() {
      this.stopAutoSlide();
      this.photoInterval = setInterval(() => {
        if (this.state.memoryActive) this.nextPhoto();
      }, 5000);
    }

    stopAutoSlide() {
      if (this.photoInterval) {
        clearInterval(this.photoInterval);
        this.photoInterval = null;
      }
    }

    toggleMemoryBoard() {
      this.state.memoryActive = !this.state.memoryActive;
      window.DashboardModules.State.save("memory_board_active", this.state.memoryActive);

      const btn = document.getElementById("photo-toggle");
      if (!this.state.memoryActive) {
        this.widget.style.display = "none";
        btn && (btn.textContent = "Enable");
        this.stopAutoSlide();
      } else {
        this.widget.style.display = "block";
        btn && (btn.textContent = "Disable");
        this.startAutoSlide();
      }
    }

    nextPhoto() {
      if (!this.img) return;
      if (!this.state.photoList || this.state.photoList.length === 0) return;

      this.photoIndex = (this.photoIndex + 1) % this.state.photoList.length;
      const nextSrc = this.state.photoList[this.photoIndex];

      // fade out / change / fade in
      this.img.style.transition = "opacity 0.32s ease";
      this.img.style.opacity = "0";
      setTimeout(() => {
        this.img.src = nextSrc;
        // force reflow to ensure transition
        this.img.offsetHeight;
        this.img.style.opacity = "1";
      }, 320);
    }

    destroy() {
      this.stopAutoSlide();
      document.getElementById("photo-toggle")?.removeEventListener("click", this.boundToggle);
      document.getElementById("photo-next")?.removeEventListener("click", this.boundNext);
    }
  }

  window.DashboardModules.Features.Photo = PhotoWidget;
})();
