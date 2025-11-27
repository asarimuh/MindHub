class Dashboard {
  constructor() {
    this.name = 'dashboard';
  }

  render() {
    return `
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
        <p class="text-muted-foreground">Welcome to your personal workspace</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        ${this.renderStats()}
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${this.renderRecentDocuments()}
        ${this.renderStudyProgress()}
      </div>
    `;
  }

  renderStats() {
    const stats = [
      { label: 'Documents', value: '24', color: 'blue', icon: 'documents' },
      { label: 'Study Cards', value: '7', color: 'green', icon: 'study' },
      { label: 'Photos', value: '42', color: 'purple', icon: 'gallery' },
      { label: 'Quick Notes', value: '15', color: 'yellow', icon: 'notes' }
    ];

    return stats.map(stat => `
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${this.getIconPath(stat.icon)}"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">${stat.label}</p>
            <p class="text-2xl font-semibold">${stat.value}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderRecentDocuments() {
    return `
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Recent Documents</h2>
        <div class="space-y-4">
          ${this.renderDocumentItem('Project Proposal', '2 hours ago', 'DOC', 'blue')}
          ${this.renderDocumentItem('Budget Report', 'yesterday', 'XLS', 'green')}
          ${this.renderDocumentItem('Team Presentation', '3 days ago', 'PPT', 'red')}
        </div>
      </div>
    `;
  }

  renderDocumentItem(name, time, type, color) {
    return `
      <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center text-${color}-600 mr-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium">${name}</p>
            <p class="text-sm text-muted-foreground">Updated ${time}</p>
          </div>
        </div>
        <span class="badge">${type}</span>
      </div>
    `;
  }

  renderStudyProgress() {
    return `
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Study Progress</h2>
        <div class="space-y-4">
          ${this.renderProgressItem('React Hooks', 60, 'blue')}
          ${this.renderProgressItem('Node.js Backend', 45, 'green')}
          ${this.renderProgressItem('TypeScript', 75, 'purple')}
          ${this.renderProgressItem('CSS Layouts', 20, 'yellow')}
        </div>
      </div>
    `;
  }

  renderProgressItem(name, percentage, color) {
    return `
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>${name}</span>
          <span>${percentage}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-${color}-600 h-2 rounded-full" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }

  getIconPath(icon) {
    const icons = {
      documents: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      study: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      gallery: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      notes: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    };
    return icons[icon] || icons.documents;
  }

  init() {
    // Initialize any dashboard-specific functionality
    console.log('Dashboard initialized');
  }
}