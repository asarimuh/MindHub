/**
 * Dashboard Component (Refactored - Modular Architecture)
 * 
 * This component is now organized into three modules:
 * - dashboard/view.js: Pure render functions
 * - dashboard/services.js: GitHub & PhotoWidget services
 * - Dashboard.js (this file): Controller & state management
 * 
 * Benefits:
 * - Pure render functions are easy to test
 * - Services are reusable
 * - Clear separation of concerns
 * - Easier to maintain and extend
 */

class Dashboard {
  constructor() {
    this.name = "dashboard";

    // Load from storage
    this.goals = Storage.get("dashboard_goals") || [];
    this.tasks = Storage.get("dashboard_tasks") || [];
    this.completedTasks = Storage.get("dashboard_completed_tasks") || [];
    this.currentTaskFilter = Storage.get("dashboard_task_filter", "all");

    this.learning = Storage.get("dashboard_learning") || [];
    this.reflections = Storage.get("dashboard_reflections") || [];

    // Photo widget
    this.memoryActive = Storage.get("memory_board_active") ?? true;
    this.photoList = Storage.get("dashboard_photos") || [
      "./assets/img/img1.jpg",
      "./assets/img/img2.jpg",
      "./assets/img/img3.jpg",
      "./assets/img/img4.jpg",
      "./assets/img/img5.jpg",
      "./assets/img/img6.jpg",
      "./assets/img/img7.jpg",
      "./assets/img/img8.jpg",
      "./assets/img/img9.jpg",
      "./assets/img/img10.jpg",
    ];

    // Services
    this.photoWidget = new PhotoWidgetService(this.photoList);
  }

  render() {
    return `
      <div class="dashboard-container">
        <!-- Header -->
        <div class="grid grid-cols-1 lg:grid-cols-8 gap-2 mb-6">
          <div class="mb-8 lg:col-span-4">
            <h1 class="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
            <p class="text-muted-foreground">Welcome to your personal workspace</p>
            </div>
            <div class="lg:col-span-4">
            <!-- Quick Stats Row -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${renderStatCard('Tasks', this.tasks.length, '📝', 'green')}
                ${renderStatCard('Learning', this.learning.length, '📚', 'purple')}
                ${renderStatCard('Goals', this.goals.length, '🎯', 'blue')}
                ${renderStatCard('Reflections', this.reflections.length, '✍️', 'orange')}
              </div>
            </div>
        </div>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <!-- Left Column -->
          <div class="lg:col-span-3 space-y-6">
            
            <!-- Enhanced Task Manager -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Task Manager</h2>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">
                    ${this.getTasksByFilter(this.currentTaskFilter).length} items
                  </span>
                  <button id="task-history-btn" class="btn btn-secondary text-sm">
                    History (${this.completedTasks.length})
                  </button>
                </div>
              </div>

              <!-- Filter Tabs -->
              <div class="flex flex-wrap gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                ${renderTaskFilterTabs(this.currentTaskFilter)}
              </div>

              <!-- Add Task Form -->
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
                <button id="task-add-btn" class="btn btn-secondary whitespace-nowrap">Add Task</button>
              </div>

              <!-- Task List -->
              <div id="task-list" class="space-y-2 max-h-80 overflow-y-auto">
                ${this.renderTaskList()}
              </div>
            </div>

            <!-- What You're Learning -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Current Learning</h2>
                <span class="text-sm text-muted-foreground">${this.learning.length} items</span>
              </div>
              <div class="flex gap-2 mb-4">
                <input id="learning-input"
                       class="input flex-1"
                       placeholder="What are you learning?" />
                <button id="learning-add-btn" class="btn btn-secondary whitespace-nowrap">Add</button>
              </div>
              <div id="learning-list" class="space-y-2">
                ${renderLearningList(this.learning)}
              </div>
            </div>

          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            
            <!-- Current Goals -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Goals</h2>
                <span class="text-sm text-muted-foreground">${this.goals.length} active</span>
              </div>
              <div class="flex gap-2 mb-4">
                <input id="goal-input" 
                       class="input flex-1"
                       placeholder="Add a goal..." />
                <button id="goal-add-btn" class="btn btn-secondary whitespace-nowrap">Add</button>
              </div>
              <div id="goal-list" class="space-y-2 max-h-48 overflow-y-auto">
                ${renderGoalList(this.goals)}
              </div>
            </div>

            <!-- Daily Reflection -->
            <div class="card p-6">
              <h2 class="text-xl font-semibold mb-4">Daily Reflection</h2>
              <input id="reflection-input"
                     type="text"
                     class="input w-full mb-3"
                     placeholder="What did you learn or realize today?" />
              <button id="reflection-add-btn" 
                      class="btn btn-secondary w-full">
                Save Reflection
              </button>
              <div id="reflection-list">
                ${renderReflectionList(this.reflections)}
              </div>
            </div>

            <!-- Photo Widget -->
            <div class="card p-6">
            
              <div class="flex items-center justify-between mb-4">
              <button id="photo-toggle" class="text-sm text-blue-600 hover:text-blue-800">
                Disable
              </button>
                <h2 class="text-xl font-semibold">Memory Board</h2>
                
                <button id="photo-next" class="text-sm text-blue-600 hover:text-blue-800">Next</button>
              </div>
              <div class="text-center">
                <div id="photo-widget" class="photo-widget w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-3 mx-auto">
                  <img id="photo-widget-img"
                       src="${this.photoList[0]}"
                       class="memory-image w-full h-full object-cover transition-all duration-500"
                       alt="Special memory" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GitHub Activity Section -->
        <div class="mt-8">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold tracking-tight">GitHub Activity</h2>
                  <p class="text-sm text-muted-foreground">Your contribution history</p>
                </div>
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
        
      </div>
    `;
  }

  /* ============== TASK MANAGEMENT ============== */

  renderTaskList() {
    const tasks = this.getTasksByFilter(this.currentTaskFilter);
    if (tasks.length === 0) {
      return renderTaskEmptyState(this.currentTaskFilter);
    }
    return tasks.map((task, index) => renderTaskItem(task, index)).join('');
  }

  getTasksByFilter(filter) {
    switch (filter) {
      case 'today':
        return this.tasks.filter(task => task.deadline === 'today' && !task.completed);
      case 'weekly':
        return this.tasks.filter(task => task.deadline === 'weekly' && !task.completed);
      case 'monthly':
        return this.tasks.filter(task => task.deadline === 'monthly' && !task.completed);
      case 'todo':
        return this.tasks.filter(task => task.deadline === 'todo' && !task.completed);
      default:
        return this.tasks.filter(task => !task.completed);
    }
  }

  toggleTaskCompletion(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const task = this.tasks[taskIndex];
      task.completed = !task.completed;

      if (task.completed) {
        const completedTask = {
          ...task,
          completedAt: new Date().toISOString()
        };
        this.completedTasks.unshift(completedTask);
        this.tasks.splice(taskIndex, 1);
      }

      this.saveAllTaskData();
      this.refreshTasksList();
    }
  }

  toggleSubtaskCompletion(taskId, subtaskIndex) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.subtasks[subtaskIndex]) {
      task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
      this.saveTasks();
      this.refreshTasksList();
    }
  }

  removeSubtask(taskId, subtaskIndex) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    // ensure valid index
    if (subtaskIndex < 0 || subtaskIndex >= task.subtasks.length) return;

    task.subtasks.splice(subtaskIndex, 1);
    this.saveTasks();
    this.refreshTasksList();
    this.showNotification('Subtask removed');
  }

  addSubtask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    const input = document.querySelector(`.subtask-input[data-task-id="${taskId}"]`);

    if (task && input) {
      const title = input.value.trim();
      if (title) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({
          title: title,
          completed: false
        });
        this.saveTasks();
        input.value = "";
        this.refreshTasksList();
        this.showNotification('Subtask added successfully!');
      }
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    this.refreshTasksList();
    this.showNotification('Tasked Deleted successfully!');

  }

  editTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      const newTitle = prompt('Edit task:', task.title);
      if (newTitle !== null && newTitle.trim()) {
        task.title = newTitle.trim();
        this.saveTasks();
        this.refreshTasksList();
        this.showNotification('Tasked Edited successfully!');
      }
    }
  }

  showTaskHistory() {
    const completedCount = this.completedTasks.length;
    const historyText = this.completedTasks.map(task =>
      `✅ ${task.title} - ${new Date(task.completedAt).toLocaleDateString()}`
    ).join('\n');

    alert(`Completed Tasks (${completedCount}):\n\n${historyText}`);
  }

  refreshTasksList() {
    const list = document.getElementById("task-list");
    if (list) {
      list.innerHTML = this.renderTaskList();
      this.initTaskDragAndDrop();
    }
  }

  saveTasks() {
    Storage.set("dashboard_tasks", this.tasks);
  }

  saveCompletedTasks() {
    Storage.set("dashboard_completed_tasks", this.completedTasks);
  }

  saveAllTaskData() {
    this.saveTasks();
    this.saveCompletedTasks();
  }

  /* ============== GOALS MANAGEMENT ============== */

  refreshGoalsList() {
    const list = document.getElementById("goal-list");
    if (list) {
      list.innerHTML = renderGoalList(this.goals);
    }
  }

  /* ============== LEARNING MANAGEMENT ============== */

  refreshLearningList() {
    const list = document.getElementById("learning-list");
    if (list) {
      list.innerHTML = renderLearningList(this.learning);
    }
  }

  /* ============== REFLECTION MANAGEMENT ============== */

  refreshReflectionDisplay() {
    const list = document.getElementById('reflection-list');
    if (list) {
      list.innerHTML = renderReflectionList(this.reflections);
    }
  }

  /* ============== PHOTO WIDGET ============== */

  toggleMemoryBoard() {
    this.memoryActive = !this.memoryActive;
    Storage.set("memory_board_active", this.memoryActive);

    const toggleBtn = document.getElementById("photo-toggle");
    const widget = document.getElementById("photo-widget");

    if (!this.memoryActive) {
      if (widget) widget.style.display = "none";
      this.photoWidget.stopAutoSlide();
      if (toggleBtn) toggleBtn.textContent = "Enable";
    } else {
      if (widget) widget.style.display = "block";
      this.photoWidget.startAutoSlide();
      if (toggleBtn) toggleBtn.textContent = "Disable";
    }
  }

  /* ============== GITHUB ACTIVITY ============== */

  async fetchGitHubActivity() {
    try {
      const res = await fetch("http://localhost:3000/api/github");
      const data = await res.json();

      const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
      const days = weeks.flatMap(w => w.contributionDays);
      const total = days.reduce((sum, d) => sum + d.contributionCount, 0);

      const container = document.getElementById("github-commits");

      if (container) {
        const monthHeaders = GitHubService.renderMonthHeaders(weeks);
        const contributionGrid = GitHubService.renderContributionGrid(weeks);

        container.innerHTML = `
        <div class="w-full space-y-6">
        <!-- Contribution Graph -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">Year in Code</h3>
              <span class="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-md">${total} commits</span>
            </div>
            
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              
              <!-- GitHub-style Calendar -->
              <div class="overflow-x-auto">
                <div class="flex flex-col">

                  <!-- Month Header Row -->
                  <div class="grid auto-cols-fr grid-flow-col mb-1" style="grid-template-rows: none; grid-auto-flow: column;">
                    ${monthHeaders}
                  </div>

                  <!-- Contribution Grid -->
                  <div class="w-full">
                    <div class="grid auto-cols-fr grid-rows-7 gap-[3px]" style="grid-auto-flow: column;--cell-size: min(max(0.5rem, calc(100vw / 110)), 1rem);">
                      ${contributionGrid}
                    </div>
                  </div>

                </div>
              </div>

              <!-- Legend -->
              <div class="flex items-center justify-start gap-3 mt-4 pt-3 border-t border-gray-100">
                <span class="text-[10px] text-gray-500">Less</span>
                <div class="flex items-center gap-0.5">
                  <div class="w-3 h-3 bg-[#ebedf0] border border-gray-100"></div>
                  <div class="w-3 h-3 bg-[#9be9a8] border border-gray-100"></div>
                  <div class="w-3 h-3 bg-[#40c463] border border-gray-100"></div>
                  <div class="w-3 h-3 bg-[#30a14e] border border-gray-100"></div>
                </div>
                <span class="text-[10px] text-gray-500">More</span>
              </div>

            </div>
          </div>

          <!-- Activity Breakdown -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-900">Activity Breakdown</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#ebedf0] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">No commits</span>
                </div>
                <span class="font-medium text-gray-900">${GitHubService.getDaysWithCount(days, 0)} days</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#9be9a8] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">1-2 commits</span>
                </div>
                <span class="font-medium text-gray-900">${GitHubService.getDaysWithCount(days, 1, 2)} days</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#40c463] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">3-4 commits</span>
                </div>
                <span class="font-medium text-gray-900">${GitHubService.getDaysWithCount(days, 3, 4)} days</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-teal-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#30a14e] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">5+ commits</span>
                </div>
                <span class="font-medium text-gray-900">${GitHubService.getDaysWithCount(days, 5)} days</span>
              </div>
            </div>
          </div>
        </div>
      `;

        this.animateGitHubCommits();
      }
    } catch (err) {
      const container = document.getElementById("github-commits");
      if (container) {
        container.innerHTML = `
          <div class="text-center py-8 space-y-3">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">Unable to load contributions</h3>
              <p class="text-sm text-muted-foreground mb-3">Check your connection and try again</p>
              <button onclick="app.components.dashboard.fetchGitHubActivity()" 
                      class="btn btn-secondary text-xs px-3 py-1.5">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Retry
              </button>
            </div>
          </div>
        `;
      }
    }
  }

  animateGitHubCommits() {
    const container = document.getElementById("github-commits");
    if (!container) return;

    const commitBoxes = container.querySelectorAll(".commit-box");

    commitBoxes.forEach(box => {
      box.style.opacity = 0;
      box.style.transform = 'translateY(10px)';
      box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          commitBoxes.forEach((box, index) => {
            setTimeout(() => {
              box.style.opacity = 1;
              box.style.transform = 'translateY(0)';
            }, index * 5);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(container);
  }

  showNotification(message) {
    // Create or reuse toast container
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';

    // Message
    const msg = document.createElement('div');
    msg.className = 'toast-message';
    msg.textContent = message;

    // Close button (X)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.innerHTML = `
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;

    toast.appendChild(msg);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Auto-dismiss with exit animation
    let removed = false;
    const removeToast = () => {
      if (removed) return;
      removed = true;
      toast.classList.add('toast-leave');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    };

    const timeoutId = setTimeout(removeToast, 3000);

    closeBtn.addEventListener('click', () => {
      clearTimeout(timeoutId);
      removeToast();
    });
  }

  /* ============== INITIALIZATION & EVENT BINDING ============== */

  init() {
    this.initPhotoWidget();
    this.initGoals();
    this.initTasks();
    this.initLearning();
    this.initReflection();
    this.bindGlobalDeleteHandlers();
    this.fetchGitHubActivity();
  }

  initPhotoWidget() {
    const toggleBtn = document.getElementById("photo-toggle");
    const nextBtn = document.getElementById("photo-next");
    const widget = document.getElementById("photo-widget");

    if (!this.memoryActive) {
      if (widget) widget.style.display = "none";
      if (toggleBtn) toggleBtn.textContent = "Enable";
    } else {
      this.photoWidget.startAutoSlide();
      if (toggleBtn) toggleBtn.textContent = "Disable";
    }

    toggleBtn?.addEventListener("click", () => this.toggleMemoryBoard());
    nextBtn?.addEventListener("click", () => this.photoWidget.nextPhoto());
  }

  initGoals() {
    const input = document.getElementById("goal-input");
    const addBtn = document.getElementById("goal-add-btn");

    const addGoal = () => {
      const val = input.value.trim();
      if (!val) return;
      this.goals.push(val);
      Storage.set("dashboard_goals", this.goals);
      input.value = "";
      this.refreshGoalsList();
      this.showNotification('Goal added saved successfully!');
    };

    addBtn?.addEventListener('click', addGoal);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addGoal();
    });
  }

  initTasks() {
    const input = document.getElementById("task-input");
    const addBtn = document.getElementById("task-add-btn");
    const prioritySelect = document.getElementById("task-priority");
    const deadlineSelect = document.getElementById("task-deadline");

    const addTask = () => {
      const title = input.value.trim();
      if (!title) return;

      const newTask = {
        id: Date.now().toString() + Math.random(),
        title: title,
        priority: prioritySelect.value,
        deadline: deadlineSelect.value,
        completed: false,
        subtasks: [],
        createdAt: new Date().toISOString()
      };

      this.tasks.push(newTask);
      this.saveTasks();
      input.value = "";
      this.refreshTasksList();
      this.showNotification('Tasked added successfully!');
    };

    addBtn?.addEventListener('click', addTask);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });

    this.initTaskFilterTabs();
    this.initTaskDragAndDrop();
    this.initTaskInteractions();
  }

  initTaskFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.currentTaskFilter = e.currentTarget.dataset.filter;
        Storage.set("dashboard_task_filter", this.currentTaskFilter);
        this.updateActiveTabUI();
        this.refreshTasksList();
      });
    });
  }

  updateActiveTabUI() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('bg-white', 'text-blue-600', 'shadow-sm');
      tab.classList.add('text-gray-600', 'hover:text-gray-900');
    });

    const activeTab = document.querySelector(`.filter-tab[data-filter="${this.currentTaskFilter}"]`);
    if (activeTab) {
      activeTab.classList.add('bg-white', 'text-blue-600', 'shadow-sm');
      activeTab.classList.remove('text-gray-600', 'hover:text-gray-900');
    }
  }

  initTaskDragAndDrop() {
    const taskList = document.getElementById('task-list');
    if (taskList && typeof Sortable !== 'undefined') {
      Sortable.create(taskList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: (evt) => {
          const taskElements = Array.from(taskList.querySelectorAll('.task-item'));
          const newTasksOrder = taskElements.map(el => {
            const taskId = el.dataset.taskId;
            return this.tasks.find(task => task.id === taskId);
          }).filter(task => task);

          this.tasks = newTasksOrder;
          this.saveTasks();
        }
      });
    }
  }

  initTaskInteractions() {
    document.addEventListener('click', (e) => {
      const el = e.target;

      const taskCheck = el.closest('.task-check');
      if (taskCheck) {
        this.toggleTaskCompletion(taskCheck.dataset.taskId);
      }

      const subtaskCheck = el.closest('.subtask-check');
      if (subtaskCheck) {
        this.toggleSubtaskCompletion(
          subtaskCheck.dataset.taskId,
          parseInt(subtaskCheck.dataset.subtaskIndex)
        );
      }

      const deleteTaskBtn = el.closest('.delete-task');
      if (deleteTaskBtn) {
        this.deleteTask(deleteTaskBtn.dataset.taskId);
      }

      const addSubtaskBtn = el.closest('.add-subtask-btn');
      if (addSubtaskBtn) {
        this.addSubtask(addSubtaskBtn.dataset.taskId);
      }

      const editTaskBtn = el.closest('.edit-task');
      if (editTaskBtn) {
        this.editTask(editTaskBtn.dataset.taskId);
      }

      const deleteSubtaskBtn = el.closest('.delete-subtask');
      if (deleteSubtaskBtn) {
        this.removeSubtask(
          deleteSubtaskBtn.dataset.taskId,
          parseInt(deleteSubtaskBtn.dataset.subtaskIndex)
        );
      }
    });

    document.addEventListener('keypress', (e) => {
      if (e.target.classList.contains('subtask-input') && e.key === 'Enter') {
        this.addSubtask(e.target.dataset.taskId);
      }
    });

    const historyBtn = document.getElementById('task-history-btn');
    historyBtn?.addEventListener('click', () => {
      this.showTaskHistory();
    });
  }

  initLearning() {
    const input = document.getElementById("learning-input");
    const addBtn = document.getElementById("learning-add-btn");

    const addLearning = () => {
      const val = input.value.trim();
      if (!val) return;
      this.learning.push(val);
      Storage.set("dashboard_learning", this.learning);
      input.value = "";
      this.refreshLearningList();
      this.showNotification('Learning subject added successfully!');
    };

    addBtn?.addEventListener('click', addLearning);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addLearning();
    });
  }

  initReflection() {
    const input = document.getElementById("reflection-input");
    const btn = document.getElementById("reflection-add-btn");

    btn?.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) return;

      const item = {
        text: val,
        date: new Date().toISOString()
      };
      this.reflections.push(item);
      Storage.set("dashboard_reflections", this.reflections);
      input.value = "";

      this.showNotification('Reflection saved successfully!');
      this.refreshReflectionDisplay();
    });

    // Allow pressing Enter to submit the reflection
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btn?.click();
      }
    });
  }

  bindGlobalDeleteHandlers() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn')) {
        const btn = e.target.closest('.delete-btn');
        const index = parseInt(btn.dataset.index);
        const listType = btn.dataset.list;

        switch (listType) {
          case 'goals':
            this.goals.splice(index, 1);
            Storage.set("dashboard_goals", this.goals);
            this.refreshGoalsList();
            break;
          case 'tasks':
            this.tasks.splice(index, 1);
            Storage.set("dashboard_tasks", this.tasks);
            this.refreshTasksList();
            break;
          case 'learning':
            this.learning.splice(index, 1);
            Storage.set("dashboard_learning", this.learning);
            this.refreshLearningList();
            break;
          case 'reflections':
            this.reflections.splice(index, 1);
            Storage.set("dashboard_reflections", this.reflections);
            this.refreshReflectionDisplay();
            break;
        }
      }
    });
  }

  destroy() {
    this.photoWidget.destroy();
  }
}
