// Tasks module
// Exposes: window.DashboardModules.Features.Tasks
(function () {
  window.DashboardModules = window.DashboardModules || {};
  window.DashboardModules.Features = window.DashboardModules.Features || {};

  class Tasks {
    constructor(dashboard) {
      this.dashboard = dashboard;
      this.state = dashboard.state;
      this.boundDocClick = this.globalClickHandler.bind(this);
      this.boundKeypress = this.onKeypress.bind(this);
    }

    init() {
      this.renderFilterTabs();
      this.refreshTasksList();

      document.getElementById("task-add-btn")?.addEventListener("click", () => this.addTask());
      document.getElementById("task-input")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.addTask();
      });

      // history button
      document.getElementById("task-history-btn")?.addEventListener("click", () => this.showTaskHistory());

      // global delegation for task interactions
      document.addEventListener("click", this.boundDocClick);
      document.addEventListener("keypress", this.boundKeypress);

      // register cleanup
      this.dashboard.onDestroy(() => this.destroy());
    }

    destroy() {
      document.removeEventListener("click", this.boundDocClick);
      document.removeEventListener("keypress", this.boundKeypress);
    }

    save() {
      window.DashboardModules.State.save("dashboard_tasks", this.state.tasks);
      window.DashboardModules.State.save("dashboard_completed_tasks", this.state.completedTasks);
    }

    addTask() {
      const input = document.getElementById("task-input");
      const prioritySelect = document.getElementById("task-priority");
      const deadlineSelect = document.getElementById("task-deadline");
      if (!input) return;
      const title = input.value.trim();
      if (!title) return;

      const newTask = {
        id: Date.now().toString() + Math.random(),
        title,
        priority: prioritySelect?.value || "medium",
        deadline: deadlineSelect?.value || "todo",
        completed: false,
        subtasks: [],
        createdAt: new Date().toISOString()
      };

      this.state.tasks.push(newTask);
      this.save();
      input.value = "";
      this.refreshTasksList();
    }

    renderFilterTabs() {
      const container = document.getElementById("task-filter-tabs");
      if (!container) return;
      const filters = [
        { id: 'all', label: 'All', icon: '📋' },
        { id: 'today', label: 'Today', icon: '📅' },
        { id: 'weekly', label: 'Week', icon: '🗓️' },
        { id: 'monthly', label: 'Month', icon: '📆' },
        { id: 'todo', label: 'Misc', icon: '📝' },
      ];

      container.innerHTML = filters.map(f => {
        const active = this.state.currentTaskFilter === f.id;
        return `<button class="filter-tab px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}" data-filter="${f.id}">
          <span class="mr-1">${f.icon}</span>${f.label}
        </button>`;
      }).join('');

      // attach listeners
      container.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.state.currentTaskFilter = e.currentTarget.dataset.filter;
          window.DashboardModules.State.save("dashboard_task_filter", this.state.currentTaskFilter);
          this.refreshTasksList();
          this.updateActiveTabUI();
        });
      });

      this.updateActiveTabUI();
    }

    updateActiveTabUI() {
      document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
        tab.classList.add('text-gray-600', 'hover:text-gray-900');
      });
      const active = document.querySelector(`.filter-tab[data-filter="${this.state.currentTaskFilter}"]`);
      if (active) {
        active.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
        active.classList.remove('text-gray-600', 'hover:text-gray-900');
      }
    }

    getTasksByFilter() {
      const filter = this.state.currentTaskFilter;
      switch (filter) {
        case 'today': return this.state.tasks.filter(t => t.deadline === 'today' && !t.completed);
        case 'weekly': return this.state.tasks.filter(t => t.deadline === 'weekly' && !t.completed);
        case 'monthly': return this.state.tasks.filter(t => t.deadline === 'monthly' && !t.completed);
        case 'todo': return this.state.tasks.filter(t => t.deadline === 'todo' && !t.completed);
        default: return this.state.tasks.filter(t => !t.completed);
      }
    }

    renderTaskItem(task, index) {
      const priorityColors = {
        low: 'text-green-600 bg-green-50',
        medium: 'text-yellow-600 bg-yellow-50',
        high: 'text-red-600 bg-red-50'
      };
      const deadlineIcons = { today: '⏰', weekly: '📅', monthly: '🗓️', todo: '📝' };

      return `
        <div class="task-item flex items-start gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-all" data-task-id="${task.id}">
          <div class="flex items-start gap-3 flex-1">
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}" class="task-check mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}">${task.title}</span>
                <span class="priority-badge px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}">${task.priority}</span>
                <span class="text-xs text-gray-400">${deadlineIcons[task.deadline]}</span>
              </div>
              ${task.subtasks && task.subtasks.length ? `<div class="subtasks ml-4 space-y-1 mt-2">
                ${task.subtasks.map((sub, i) => `<div class="flex items-center gap-2 text-xs"><input type="checkbox" ${sub.completed ? 'checked' : ''} data-task-id="${task.id}" data-subtask-index="${i}" class="subtask-check w-3 h-3 text-gray-600 rounded" /><span class="${sub.completed ? 'line-through text-gray-400' : 'text-gray-600'}">${sub.title}</span></div>`).join('')}
              </div>` : ''}
              <div class="add-subtask mt-2 ml-4 flex gap-2">
                <input type="text" placeholder="Add subtask..." data-task-id="${task.id}" class="subtask-input text-xs px-2 py-1 border rounded w-32" />
                <button data-task-id="${task.id}" class="add-subtask-btn text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors">Add</button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button class="edit-task text-gray-400 hover:text-blue-500 transition-colors p-1" data-task-id="${task.id}" title="Edit task">✏️</button>
            <button class="delete-task text-gray-400 hover:text-red-500 transition-colors p-1" data-task-id="${task.id}" title="Delete task">🗑️</button>
          </div>
        </div>
      `;
    }

    renderTaskEmptyState() {
      const stateIcons = { all: '📋', today: '📅', weekly: '🗓️', monthly: '📆', todo: '📝' };
      const label = this.state.currentTaskFilter || 'all';
      return `<div class="text-center py-8 text-gray-500"><div class="text-4xl mb-2">${stateIcons[label]}</div><p class="text-sm">No tasks yet</p><p class="text-xs text-muted-foreground mt-1">Add your first task above</p></div>`;
    }

    refreshTasksList() {
      const container = document.getElementById("task-list");
      if (!container) return;
      const tasks = this.getTasksByFilter();
      if (tasks.length === 0) {
        container.innerHTML = this.renderTaskEmptyState();
        return;
      }
      container.innerHTML = tasks.map((t, i) => this.renderTaskItem(t, i)).join('');
      // (re)initialize Sortable if loaded
      this.initTaskDragAndDrop();
    }

    initTaskDragAndDrop() {
      const taskList = document.getElementById('task-list');
      if (taskList && typeof Sortable !== 'undefined') {
        // prevent multiple inits by checking a flag
        if (taskList._sortableInitialized) return;
        Sortable.create(taskList, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          onEnd: (evt) => {
            const taskElements = Array.from(taskList.querySelectorAll('.task-item'));
            const newTasksOrder = taskElements.map(el => {
              const taskId = el.dataset.taskId;
              return this.state.tasks.find(task => task.id === taskId);
            }).filter(Boolean);
            this.state.tasks = newTasksOrder;
            this.save();
          }
        });
        taskList._sortableInitialized = true;
      }
    }

    globalClickHandler(e) {
      const el = e.target;

      // checkbox toggles
      if (el.matches('.task-check')) {
        const taskId = el.dataset.taskId;
        this.toggleTaskCompletion(taskId);
      }

      if (el.matches('.subtask-check')) {
        const taskId = el.dataset.taskId;
        const subIndex = parseInt(el.dataset.subtaskIndex, 10);
        this.toggleSubtaskCompletion(taskId, subIndex);
      }

      // delete
      if (el.matches('.delete-task')) {
        this.deleteTask(el.dataset.taskId);
      }

      // edit
      if (el.matches('.edit-task')) {
        this.editTask(el.dataset.taskId);
      }

      // add subtask
      if (el.matches('.add-subtask-btn')) {
        this.addSubtask(el.dataset.taskId);
      }
    }

    onKeypress(e) {
      if (e.target && e.target.matches('.subtask-input') && e.key === 'Enter') {
        this.addSubtask(e.target.dataset.taskId);
      }
    }

    toggleTaskCompletion(taskId) {
      const idx = this.state.tasks.findIndex(t => t.id === taskId);
      if (idx === -1) return;
      const task = this.state.tasks[idx];
      task.completed = !task.completed;
      if (task.completed) {
        const completedTask = { ...task, completedAt: new Date().toISOString() };
        this.state.completedTasks.unshift(completedTask);
        this.state.tasks.splice(idx, 1);
      }
      this.save();
      this.refreshTasksList();
    }

    toggleSubtaskCompletion(taskId, subIndex) {
      const task = this.state.tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks) return;
      task.subtasks[subIndex].completed = !task.subtasks[subIndex].completed;
      this.save();
      this.refreshTasksList();
    }

    addSubtask(taskId) {
      const input = document.querySelector(`.subtask-input[data-task-id="${taskId}"]`);
      const task = this.state.tasks.find(t => t.id === taskId);
      if (!input || !task) return;
      const title = input.value.trim();
      if (!title) return;
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push({ title, completed: false });
      input.value = "";
      this.save();
      this.refreshTasksList();
    }

    deleteTask(taskId) {
      this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
      this.save();
      this.refreshTasksList();
    }

    editTask(taskId) {
      const task = this.state.tasks.find(t => t.id === taskId);
      if (!task) return;
      const newTitle = prompt('Edit task:', task.title);
      if (newTitle !== null && newTitle.trim()) {
        task.title = newTitle.trim();
        this.save();
        this.refreshTasksList();
      }
    }

    showTaskHistory() {
      const completedCount = this.state.completedTasks.length;
      const historyText = this.state.completedTasks.map(task => `✅ ${task.title} - ${new Date(task.completedAt).toLocaleDateString()}`).join('\n');
      alert(`Completed Tasks (${completedCount}):\n\n${historyText}`);
    }
  }

  window.DashboardModules.Features.Tasks = Tasks;
})();
