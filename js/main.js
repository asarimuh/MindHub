// Main application controller
class App {
  constructor() {
    this.currentPage = null;
    this.currentComponent = null;
    this.init();
  }

  init() {
    this.renderSidebar();

    const lastPage = Storage.get('current_page') || 'dashboard';
    this.loadComponent(lastPage);
  }

  /* =============================
   * COMPONENT LOADING (Option A)
   * ============================= */

  getComponent(name) {
    const map = {
      dashboard: Dashboard,
      documents: Documents,
      gallery: Gallery,
      stocks: Stocks,
      news: News,
      notes: Notes,
      studyTracker: StudyTracker
    };

    const Component = map[name];
    if (!Component) return null;

    return new Component();
  }

  loadComponent(name) {
    Storage.set('current_page', name);

    // destroy previous component if supported
    this.currentComponent?.destroy?.();

    const component = this.getComponent(name);
    if (!component) {
      document.getElementById('page-content').innerHTML =
        '<div class="p-8 text-center">Page not found</div>';
      return;
    }

    this.currentComponent = component;
    this.currentPage = name;

    const app = document.getElementById('page-content');
    app.innerHTML = component.render();

    component.init?.();
    this.updateActiveSidebar();
  }

  /* =============================
   * SIDEBAR
   * ============================= */

  renderSidebar() {
    const sidebarNav = document.getElementById('sidebar-nav');

    const pages = [
      {
        id: 'dashboard', name: 'Dashboard', icon: `
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
`
      },
      {
        id: 'notes', name: 'Notes', icon: `
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
     m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828
     l8.586-8.586z" />
`
      },
      {
        id: 'studyTracker', name: 'Study Tracker', icon: `
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5
     S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18
     7.5 18s3.332.477 4.5 1.253m0-13
     C13.168 5.477 14.754 5 16.5 5c1.747 0
     3.332.477 4.5 1.253v13
     C19.832 18.477 18.247 18 16.5 18
     c-1.746 0-3.332.477-4.5 1.253" />
`
      },
      {
        id: 'documents', name: 'Documents', icon: `
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5
     a2 2 0 012-2h5.586a1 1 0 01.707.293
     l5.414 5.414a1 1 0 01.293.707V19
     a2 2 0 01-2 2z" />
`
      },
      {
        id: 'gallery', name: 'Gallery', icon: `
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16
     m-2-2l1.586-1.586a2 2 0 012.828 0L20 14
     m-6-6h.01M6 20h12a2 2 0 002-2V6
     a2 2 0 00-2-2H6a2 2 0 00-2 2v12
     a2 2 0 002 2z" />
`
      }
//       ,
//       {
//         id: 'stocks', name: 'Stocks', icon: `
// <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
//   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0
//      00-2 2v6a2 2 0 002 2h2a2 2 0
//      002-2zm0 0V9a2 2 0 012-2h2
//      a2 2 0 012 2v10m-6 0
//      a2 2 0 002 2h2a2 2 0
//      002-2m0 0V5a2 2 0 012-2h2
//      a2 2 0 012 2v14a2 2 0
//      01-2 2h-2a2 2 0 01-2-2z" />
// `
//       },
//       {
//         id: 'news', name: 'News', icon: `
// <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
//   d="M19 20H5a2 2 0 01-2-2V6
//      a2 2 0 012-2h10a2 2 0
//      012 2v1m2 13a2 2 0
//      01-2-2V7m2 13a2 2 0
//      002-2V9a2 2 0 00-2-2
//      h-2m-4-3H9m0 0v12m0-12
//      a2 2 0 012-2h2a2 2 0
//      012 2M9 9v12" />
// `
//       }
    ];

    sidebarNav.innerHTML = pages.map(page => `
      <div class="sidebar-item"
           data-page="${page.id}">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${page.icon}
        </svg>

        <span>${page.name}</span>
      </div>
    `).join('');

    sidebarNav.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        this.loadComponent(page);
      });
    });
  }

  updateActiveSidebar() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle(
        'active',
        item.dataset.page === this.currentPage
      );
    });
  }
}

/* =============================
 * APP BOOTSTRAP
 * ============================= */

const initApp = () => {
  window.app = new App();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.loaderReady.then(initApp);
  });
} else {
  window.loaderReady.then(initApp);
}
