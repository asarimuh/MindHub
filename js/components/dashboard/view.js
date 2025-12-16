/**
 * Dashboard View Helpers
 * 
 * Pure rendering functions that accept state and return HTML strings.
 * No DOM side effects or mutation.
 */

function renderActivityItem(title, value, colorClass) {
  return `
    <div class="text-center">
      <div class="${colorClass} text-2xl font-bold mb-1">${value}</div>
      <div class="text-sm text-muted-foreground">${title}</div>
    </div>
  `;
}

// ========== TASK RENDERING ==========
function renderTaskFilterTabs(currentFilter, customFilters = []) {
  const filters = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'today', label: 'Today', icon: '📅' },
    { id: 'weekly', label: 'Week', icon: '🗓️' },
    { id: 'monthly', label: 'Month', icon: '📆' },
    { id: 'todo', label: 'Misc', icon: '📝' },
  ];

  const builtIn = filters.map(filter => `
    <button
      class="filter-tab px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentFilter === filter.id
      ? 'bg-white text-blue-600 shadow-sm'
      : 'text-gray-600 hover:text-gray-900'
    }"
      data-filter="${filter.id}"
    >
      <span class="mr-1">${filter.icon}</span>
      ${filter.label}
    </button>
  `).join('');

  // Other dropdown (custom filters) rendered inside a popover toggle
  const otherOptions = customFilters.map(f => `
    <option value="custom:${f.id}">${f.name}</option>
  `).join('');

  const customList = customFilters.map(f => `
    <div class="flex items-center justify-between text-xs p-1 rounded bg-gray-50">
      <span class="truncate">${f.name}</span>
      <button class="delete-custom-filter text-gray-400 hover:text-red-500 p-1" data-id="${f.id}" title="Delete">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `).join('');

  return `
    ${builtIn}
    <div class="relative inline-block">
      <button id="custom-filters-toggle" class="filter-tab px-3 py-2 rounded-md text-sm font-medium ml-2 bg-gray-50 hover:bg-gray-100">
        Other ▾
      </button>

      <div id="custom-filters-popover" class="hidden absolute right-0 mt-2 z-50 w-64 bg-white border rounded-md shadow-lg p-3">
        <div class="mb-2">
          <select id="other-filter-select" class="input text-sm w-full">
            <option value="">Select category</option>
            ${otherOptions}
          </select>
        </div>
        <div class="flex gap-2 mb-2">
          <input id="new-custom-filter-input" class="input flex-1 text-sm" placeholder="New category" />
          <button id="add-custom-filter-btn" class="btn btn-secondary text-sm">Add</button>
        </div>
        <div id="custom-filters-list" class="space-y-1 max-h-40 overflow-y-auto">
          ${customList}
        </div>
      </div>
    </div>
  `;
}

function renderTaskItem(task, index) {
  const priorityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50'
  };

  const deadlineIcons = {
    today: '⏰',
    weekly: '📅',
    monthly: '🗓️',
    todo: '📝'
  };

  return `
    <div class="task-item flex items-start gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-all" data-task-id="${task.id}">
      <div class="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          ${task.completed ? 'checked' : ''}
          data-task-id="${task.id}"
          class="task-check mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}">
              ${task.title}
            </span>
            <span class="priority-badge px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}">
              ${task.priority}
            </span>
            <span class="text-xs text-gray-400">
              ${deadlineIcons[task.deadline]} 
            </span>
          </div>
          
          <!-- Subtasks -->
          ${task.subtasks && task.subtasks.length > 0 ? `
            <div class="subtasks ml-4 space-y-1 mt-2">
              ${task.subtasks.map((subtask, subIndex) => `
                <div class="flex items-center justify-between gap-2 text-xs">
                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      ${subtask.completed ? 'checked' : ''}
                      data-task-id="${task.id}"
                      data-subtask-index="${subIndex}"
                      class="subtask-check w-3 h-3 text-gray-600 rounded"
                    />
                    <span class="${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600'}">
                      ${subtask.title}
                    </span>
                  </div>
                  <button
                    class="delete-subtask text-gray-400 hover:text-red-500 transition-colors p-1"
                    data-task-id="${task.id}"
                    data-subtask-index="${subIndex}"
                    title="Remove subtask"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Add Subtask -->
          <div class="add-subtask mt-2 ml-4 flex gap-2">
            <input
              type="text"
              placeholder="Add subtask..."
              data-task-id="${task.id}"
              class="subtask-input text-xs px-2 py-1 border rounded w-32"
            />
            <button
              data-task-id="${task.id}"
              class="add-subtask-btn text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="edit-task text-gray-400 hover:text-blue-500 transition-colors p-1"
          data-task-id="${task.id}"
          title="Edit task"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button
          class="delete-task text-gray-400 hover:text-red-500 transition-colors p-1"
          data-task-id="${task.id}"
          title="Delete task"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function renderTaskEmptyState(currentFilter) {
  const emptyStates = {
    all: { icon: '📋', text: 'No tasks yet', subtext: 'Add your first task above' },
    today: { icon: '📅', text: 'No tasks for today', subtext: 'Add tasks with today deadline' },
    weekly: { icon: '🗓️', text: 'No weekly tasks', subtext: 'Add tasks for this week' },
    monthly: { icon: '📆', text: 'No monthly tasks', subtext: 'Add tasks for this month' },
    todo: { icon: '📝', text: 'No miscellaneous tasks', subtext: 'Add tasks without deadlines' }
  };

  const state = emptyStates[currentFilter] || emptyStates.all;

  return `
    <div class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-2">${state.icon}</div>
      <p class="text-sm">${state.text}</p>
      <p class="text-xs text-muted-foreground mt-1">${state.subtext}</p>
    </div>
  `;
}

// ========== LEARNING RENDERING ==========
function renderLearningList(learningItems) {
  if (learningItems.length === 0) {
    return `
      <div class="text-center py-4 text-gray-500">
        <p class="text-sm">No learning items yet</p>
      </div>
    `;
  }

  return learningItems.map(item => `
  <div class="flex items-center p-3 bg-gray-50 rounded-lg">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
      <span class="text-sm">${item}</span>
    </div>
  </div>
`).join('');
}

// ========== GOALS RENDERING ==========
function renderGoalList(goals) {
  if (goals.length === 0) {
    return `
      <div class="text-center py-4 text-gray-500">
        <p class="text-sm">No goals yet</p>
      </div>
    `;
  }

  return goals.map((goal, index) => `
    <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
      <div class="flex items-center gap-3 flex-1">
        <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
        <span class="text-sm flex-1">${goal}</span>
      </div>
      <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors" 
              data-index="${index}" 
              data-list="goals">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `).join('');
}

// ========== REFLECTION RENDERING ==========
function renderRecentReflection(reflections) {
  if (reflections.length === 0) return '';

  const latest = reflections[reflections.length - 1];
  const date = new Date(latest.date).toLocaleDateString();

  return `
    <div class="mt-4 pt-4 border-t">
      <h3 class="font-medium text-sm mb-2">Latest Reflection</h3>
      <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">${latest.text}</p>
      <p class="text-xs text-muted-foreground mt-2">${date}</p>
    </div>
  `;
}

function renderReflectionList(reflections) {
  if (!reflections || reflections.length === 0) {
    return `
      <div class="text-center py-4 text-gray-500">
        <p class="text-sm">No reflections yet</p>
      </div>
    `;
  }

  return reflections.map((item, index) => {
    const date = new Date(item.date).toLocaleDateString();
    return `
      <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg mb-2">
        <div class="flex-1 pr-3">
          <div class="text-sm text-gray-800 mb-1">${item.text}</div>
          <div class="text-xs text-muted-foreground">${date}</div>
        </div>
        <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors p-2"
                data-index="${index}"
                data-list="reflections"
                title="Remove reflection">
          <!-- X icon -->
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
  }).join('');
}
