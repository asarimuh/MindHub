// Main application controller
class App {
  constructor() {
    this.currentPage = 'dashboard';
    this.components = {};
    this.init();
  }

  init() {
    this.loadComponents();
    this.setupNavigation();
    this.setupEventListeners();
    this.renderSidebar();
    this.navigateTo('dashboard');
  }

  loadComponents() {
    this.components = {
      dashboard: new Dashboard(),
      documents: new Documents(),
      gallery: new Gallery(),
      stocks: new Stocks(),
      news: new News(),
      notes: new Notes(),
      studyTracker: new StudyTracker()
    };
  }

  setupNavigation() {
    // Navigation will be handled by sidebar click events
  }

  setupEventListeners() {
    // Global event listeners can go here
  }

  renderSidebar() {
    const sidebarNav = document.getElementById('sidebar-nav');
    const pages = [
      { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'documents', name: 'Documents', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 'gallery', name: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { id: 'stocks', name: 'Stocks', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { id: 'news', name: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2M9 9v12' },
      { id: 'notes', name: 'Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
      { id: 'studyTracker', name: 'Study Tracker', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
    ];

    sidebarNav.innerHTML = pages.map(page => `
      <div class="sidebar-item ${page.id === this.currentPage ? 'active' : ''}" 
           data-page="${page.id}">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${page.icon}"></path>
        </svg>
        <span>${page.name}</span>
      </div>
    `).join('');

    // Add click event listeners
    sidebarNav.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        this.navigateTo(page);
      });
    });
  }

  navigateTo(page) {
    // Update active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Load page content
    this.currentPage = page;
    this.loadPage(page);
  }

  loadPage(page) {
    const pageContent = document.getElementById('page-content');
    
    switch(page) {
      case 'dashboard':
        pageContent.innerHTML = this.components.dashboard.render();
        this.components.dashboard.init();
        break;
      case 'documents':
        pageContent.innerHTML = this.components.documents.render();
        this.components.documents.init();
        break;
      case 'gallery':
        pageContent.innerHTML = this.components.gallery.render();
        this.components.gallery.init();
        break;
      case 'stocks':
        pageContent.innerHTML = this.components.stocks.render();
        this.components.stocks.init();
        break;
      case 'news':
        pageContent.innerHTML = this.components.news.render();
        this.components.news.init();
        break;
      case 'notes':
        pageContent.innerHTML = this.components.notes.render();
        this.components.notes.init();
        break;
      case 'studyTracker':
        pageContent.innerHTML = this.components.studyTracker.render();
        this.components.studyTracker.init();
        break;
      default:
        pageContent.innerHTML = '<div class="p-8 text-center">Page not found</div>';
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});