// Exposes: window.DashboardModules.Sections
(function () {
  window.DashboardModules = window.DashboardModules || {};

  const Sections = {};

  Sections.renderHeader = function () {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-8 gap-2 mb-6">
        <div class="mb-8 lg:col-span-4">
          <h1 class="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
          <p class="text-muted-foreground">Welcome to your personal workspace</p>
        </div>
      </div>
    `;
  };

  Sections.renderQuickStats = function (state) {
    // simple stats; icons are inline emoji for now
    return `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="card p-3 text-center">
          <div class="mb-1 text-xl">📝</div>
          <div class="text-lg font-semibold text-gray-900">${state.tasks.length}</div>
          <div class="text-xs text-muted-foreground mt-0.5">Tasks</div>
        </div>
        <div class="card p-3 text-center">
          <div class="mb-1 text-xl">📚</div>
          <div class="text-lg font-semibold text-gray-900">${state.learning.length}</div>
          <div class="text-xs text-muted-foreground mt-0.5">Learning</div>
        </div>
        <div class="card p-3 text-center">
          <div class="mb-1 text-xl">🎯</div>
          <div class="text-lg font-semibold text-gray-900">${state.goals.length}</div>
          <div class="text-xs text-muted-foreground mt-0.5">Goals</div>
        </div>
        <div class="card p-3 text-center">
          <div class="mb-1 text-xl">✍️</div>
          <div class="text-lg font-semibold text-gray-900">${state.reflections.length}</div>
          <div class="text-xs text-muted-foreground mt-0.5">Reflections</div>
        </div>
      </div>
    `;
  };

  Sections.renderTasks = function (state) {
    return `
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Task Manager</h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">${state.tasks.filter(t => !t.completed).length} items</span>
            <button id="task-history-btn" class="btn btn-secondary text-sm">History (${state.completedTasks.length})</button>
          </div>
        </div>

        <div class="flex flex-wrap gap-1 mb-4 p-1 bg-gray-100 rounded-lg" id="task-filter-tabs">
          <!-- tabs inserted by tasks module -->
        </div>

        <div class="flex flex-col sm:flex-row gap-2 mb-4">
          <input id="task-input" class="input flex-1" placeholder="What needs to be done?" />
          <select id="task-priority" class="input w-32">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
          <select id="task-deadline" class="input w-32">
            <option value="today">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="todo">No Deadline</option>
          </select>
          <button id="task-add-btn" class="btn btn-primary whitespace-nowrap">Add Task</button>
        </div>

        <div id="task-list" class="space-y-2 max-h-80 overflow-y-auto">
          <!-- task items inserted by tasks module -->
        </div>
      </div>
    `;
  };

  Sections.renderLearning = function (state) {
    return `
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Current Learning</h2>
          <span class="text-sm text-muted-foreground">${state.learning.length} items</span>
        </div>
        <div class="flex gap-2 mb-4">
          <input id="learning-input" class="input flex-1" placeholder="What are you learning?" />
          <button id="learning-add-btn" class="btn btn-primary whitespace-nowrap">Add</button>
        </div>
        <div id="learning-list" class="space-y-2">
        </div>
      </div>
    `;
  };

  Sections.renderGoals = function (state) {
    return `
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Goals</h2>
          <span class="text-sm text-muted-foreground">${state.goals.length} active</span>
        </div>
        <div class="flex gap-2 mb-4">
          <input id="goal-input" class="input flex-1" placeholder="Add a goal..." />
          <button id="goal-add-btn" class="btn btn-primary whitespace-nowrap">Add</button>
        </div>
        <div id="goal-list" class="space-y-2 max-h-48 overflow-y-auto"></div>
      </div>
    `;
  };

  Sections.renderReflection = function (state) {
    const latest = (state.reflections && state.reflections.length) ? state.reflections[state.reflections.length - 1] : null;
    const latestHtml = latest ? `
      <div class="mt-4 pt-4 border-t">
        <h3 class="font-medium text-sm mb-2">Latest Reflection</h3>
        <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">${latest.text}</p>
        <p class="text-xs text-muted-foreground mt-2">${new Date(latest.date).toLocaleDateString()}</p>
      </div>` : '';

    return `
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Daily Reflection</h2>
        <textarea id="reflection-input" class="input w-full h-32 resize-none mb-3" placeholder="What did you learn or realize today?"></textarea>
        <button id="reflection-add-btn" class="btn btn-primary w-full">Save Reflection</button>
        ${latestHtml}
      </div>
    `;
  };

  Sections.renderPhotoWidget = function (state) {
    // keeps your original single-image widget for minimal change
    return `
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <button id="photo-toggle" class="text-sm text-blue-600 hover:text-blue-800">${state.memoryActive ? 'Disable' : 'Enable'}</button>
          <h2 class="text-xl font-semibold">Memory Board</h2>
          <button id="photo-next" class="text-sm text-blue-600 hover:text-blue-800">Next</button>
        </div>
        <div class="text-center">
          <div id="photo-widget" class="photo-widget w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-3 mx-auto">
            <img id="photo-widget-img" src="${state.photoList[0] || ''}" class="memory-image w-full h-full object-cover transition-all duration-500" alt="Special memory" />
          </div>
        </div>
      </div>
    `;
  };

  Sections.renderRecentActivity = function (state) {
    return `
      <div class="mt-8">
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-green-600 text-2xl font-bold mb-1">0</div>
              <div class="text-sm text-muted-foreground">Goals Completed</div>
            </div>
            <div class="text-center">
              <div class="text-blue-600 text-2xl font-bold mb-1">${state.completedTasks.length}</div>
              <div class="text-sm text-muted-foreground">Tasks Done</div>
            </div>
            <div class="text-center">
              <div class="text-purple-600 text-2xl font-bold mb-1">12h</div>
              <div class="text-sm text-muted-foreground">Learning Hours</div>
            </div>
            <div class="text-center">
              <div class="text-orange-600 text-2xl font-bold mb-1">3 days</div>
              <div class="text-sm text-muted-foreground">Reflection Streak</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  Sections.renderGitHub = function () {
    return `
      <div class="mt-8">
        <div class="card p-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12..." />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold tracking-tight">GitHub Activity</h2>
              <p class="text-sm text-muted-foreground">Your contribution history</p>
            </div>
          </div>
          <div id="github-commits" class="flex items-center justify-center py-6">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <div class="animate-spin rounded-full h-4 w-4 border border-gray-300 border-t-blue-600"></div>
              <span>Loading contributions...</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  window.DashboardModules.Sections = Sections;
})();
