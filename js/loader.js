/**
 * Script Loader
 * Centralized script loading and dependency management
 * Ensures scripts load in correct order with proper dependency resolution
 */

class ScriptLoader {
  constructor() {
    this.loadedScripts = new Set();
    this.scriptMap = {
      // Utilities (no dependencies)
      'storage': { path: 'js/utils/storage.js', dependencies: [] },
      'helpers': { path: 'js/utils/helpers.js', dependencies: [] },
      'sidebarCalendar': { path: 'js/utils/sidebarCalendar.js', dependencies: [] },

      // Component Modules - Views (depend on utilities)
      'dashboard-view': { path: 'js/components/dashboard/view.js', dependencies: ['helpers'] },
      'documents-view': { path: 'js/components/documents/view.js', dependencies: ['helpers'] },
      'gallery-view': { path: 'js/components/gallery/view.js', dependencies: ['helpers'] },
      'news-view': { path: 'js/components/news/view.js', dependencies: ['helpers'] },
      'notes-view': { path: 'js/components/notes/view.js', dependencies: ['helpers'] },
      'stocks-view': { path: 'js/components/stocks/view.js', dependencies: ['helpers'] },
      'studytracker-view': { path: 'js/components/studytracker/view.js', dependencies: ['helpers'] },

      // Component Modules - Services (depend on utilities)
      'dashboard-services': { path: 'js/components/dashboard/services.js', dependencies: ['helpers'] },
      'documents-services': { path: 'js/components/documents/services.js', dependencies: ['helpers'] },
      'gallery-services': { path: 'js/components/gallery/services.js', dependencies: ['helpers'] },
      'news-services': { path: 'js/components/news/services.js', dependencies: ['helpers'] },
      'notes-services': { path: 'js/components/notes/services.js', dependencies: ['helpers'] },
      'stocks-services': { path: 'js/components/stocks/services.js', dependencies: ['helpers'] },
      'studytracker-services': { path: 'js/components/studytracker/services.js', dependencies: ['helpers'] },

      // Component Controllers (depend on storage, helpers, view, and services)
      'dashboard': { 
        path: 'js/components/Dashboard.js', 
        dependencies: ['storage', 'helpers', 'dashboard-view', 'dashboard-services'] 
      },
      'documents': { 
        path: 'js/components/Documents.js', 
        dependencies: ['storage', 'helpers', 'documents-view', 'documents-services'] 
      },
      'gallery': { 
        path: 'js/components/Gallery.js', 
        dependencies: ['storage', 'helpers', 'gallery-view', 'gallery-services'] 
      },
      'news': { 
        path: 'js/components/News.js', 
        dependencies: ['storage', 'helpers', 'news-view', 'news-services'] 
      },
      'notes': { 
        path: 'js/components/Notes.js', 
        dependencies: ['storage', 'helpers', 'notes-view', 'notes-services'] 
      },
      'stocks': { 
        path: 'js/components/Stocks.js', 
        dependencies: ['storage', 'helpers', 'stocks-view', 'stocks-services'] 
      },
      'studytracker': { 
        path: 'js/components/StudyTracker.js', 
        dependencies: ['storage', 'helpers', 'studytracker-view', 'studytracker-services'] 
      },

      // Main app
      'main': { 
        path: 'js/main.js', 
        dependencies: ['storage', 'helpers', 'sidebarCalendar', 'dashboard', 'documents', 'gallery', 'news', 'notes', 'stocks', 'studytracker'] 
      },
    };
  }

  /**
   * Load a script and all its dependencies recursively
   * @param {string} scriptName - Key from scriptMap
   * @returns {Promise<void>}
   */
  async load(scriptName) {
    if (this.loadedScripts.has(scriptName)) {
      return; // Already loaded
    }

    const script = this.scriptMap[scriptName];
    if (!script) {
      console.warn(`Script "${scriptName}" not found in scriptMap`);
      return;
    }

    // Load dependencies first
    for (const dep of script.dependencies) {
      await this.load(dep);
    }

    // Load this script
    return new Promise((resolve, reject) => {
      const scriptEl = document.createElement('script');
      scriptEl.src = script.path;
      scriptEl.onload = () => {
        this.loadedScripts.add(scriptName);
        // console.log(`✓ Loaded: ${scriptName}`);
        resolve();
      };
      scriptEl.onerror = () => {
        console.error(`✗ Failed to load: ${script.path}`);
        reject(new Error(`Failed to load ${scriptName}`));
      };
      document.head.appendChild(scriptEl);
    });
  }

  /**
   * Load multiple scripts in parallel (respecting dependencies)
   * @param {string[]} scriptNames - Array of script keys to load
   * @returns {Promise<void>}
   */
  async loadAll(scriptNames) {
    return Promise.all(scriptNames.map(name => this.load(name)));
  }

  /**
   * Load all available scripts
   * @returns {Promise<void>}
   */
  async loadEverything() {
    return this.load('main');
  }
}

// Create global loader instance
const loader = new ScriptLoader();

// Store promise for when everything is loaded
const loaderReady = loader.loadEverything();

// Export for main.js to wait on
window.loaderReady = loaderReady;
