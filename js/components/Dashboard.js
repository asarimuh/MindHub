class Dashboard {
  constructor() {
    this.name = "dashboard";

    // Load from storage
    this.goals = Storage.get("dashboard_goals") || [];
    this.tasks = Storage.get("dashboard_tasks") || [];
    this.learning = Storage.get("dashboard_learning") || [];
    this.reflections = Storage.get("dashboard_reflections") || [];

    // Photo widget
    this.photoIndex = 0;
    this.photoList = Storage.get("dashboard_photos") || [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop"
    ];
  }

  render() {
    return `
      <div class="dashboard-container">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
          <p class="text-muted-foreground">Welcome to your personal workspace</p>
        </div>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Quick Stats Row -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              ${this.renderStatCard('Goals', this.goals.length, '🎯', 'blue')}
              ${this.renderStatCard('Tasks', this.tasks.length, '📝', 'green')}
              ${this.renderStatCard('Learning', this.learning.length, '📚', 'purple')}
              ${this.renderStatCard('Reflections', this.reflections.length, '✍️', 'orange')}
            </div>

            <!-- To Do List -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Today's Tasks</h2>
                <span class="text-sm text-muted-foreground">${this.tasks.length} items</span>
              </div>
              <div class="flex gap-2 mb-4">
                <input id="task-input"
                       class="input flex-1"
                       placeholder="What needs to be done today?" />
                <button id="task-add-btn" class="btn btn-primary whitespace-nowrap">Add Task</button>
              </div>
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
                <button id="learning-add-btn" class="btn btn-primary whitespace-nowrap">Add</button>
              </div>
              <div id="learning-list" class="space-y-2">
                ${this.renderLearningList()}
              </div>
            </div>

          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            
            <!-- Photo Widget -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Memory Board</h2>
                <button id="photo-next" class="text-sm text-blue-600 hover:text-blue-800">Next</button>
              </div>
              <div class="text-center">
                <div id="photo-widget" class="photo-widget w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-3 mx-auto">
                  <img id="photo-widget-img"
                       src="${this.photoList[0]}"
                       class="w-full h-full object-cover transition-all duration-500"
                       alt="Special memory" />
                </div>
                <p class="text-sm text-muted-foreground">Cherished moments</p>
              </div>
            </div>

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
                <button id="goal-add-btn" class="btn btn-primary whitespace-nowrap">Add</button>
              </div>
              <div id="goal-list" class="space-y-2 max-h-48 overflow-y-auto">
                ${this.renderGoalList()}
              </div>
            </div>

            <!-- Daily Reflection -->
            <div class="card p-6">
              <h2 class="text-xl font-semibold mb-4">Daily Reflection</h2>
              <textarea id="reflection-input"
                        class="input w-full h-32 resize-none mb-3"
                        placeholder="What did you learn or realize today?"></textarea>
              <button id="reflection-add-btn" 
                      class="btn btn-primary w-full">
                Save Reflection
              </button>
              ${this.renderRecentReflection()}
            </div>

          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="mt-8">
          <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              ${this.renderActivityItem('Goals Completed', '0', 'text-green-600')}
              ${this.renderActivityItem('Tasks Done', this.getCompletedTasksCount(), 'text-blue-600')}
              ${this.renderActivityItem('Learning Hours', '12h', 'text-purple-600')}
              ${this.renderActivityItem('Reflection Streak', '3 days', 'text-orange-600')}
            </div>
          </div>
        </div>
        
      </div>
    `;
  }

  renderStatCard(title, count, emoji, color) {
    return `
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-${color}-600">${count}</p>
            <p class="text-sm text-muted-foreground mt-1">${title}</p>
          </div>
          <div class="text-2xl">${emoji}</div>
        </div>
      </div>
    `;
  }

  renderTaskList() {
    if (this.tasks.length === 0) {
      return `
        <div class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📝</div>
          <p class="text-sm">No tasks yet</p>
          <p class="text-xs text-muted-foreground mt-1">Add your first task above</p>
        </div>
      `;
    }

    return this.tasks.map((task, index) => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="flex items-center gap-3 flex-1">
          <input type="checkbox" 
                 data-task-index="${index}" 
                 class="task-check w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          <span class="text-sm flex-1">${task}</span>
        </div>
        <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors" 
                data-index="${index}" 
                data-list="tasks">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `).join('');
  }

  renderLearningList() {
    if (this.learning.length === 0) {
      return `
        <div class="text-center py-4 text-gray-500">
          <p class="text-sm">No learning items yet</p>
        </div>
      `;
    }

    return this.learning.map((item, index) => `
      <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <div class="flex items-center gap-3 flex-1">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span class="text-sm flex-1">${item}</span>
        </div>
        <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors" 
                data-index="${index}" 
                data-list="learning">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `).join('');
  }

  renderGoalList() {
    if (this.goals.length === 0) {
      return `
        <div class="text-center py-4 text-gray-500">
          <p class="text-sm">No goals yet</p>
        </div>
      `;
    }

    return this.goals.map((goal, index) => `
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

  renderRecentReflection() {
    if (this.reflections.length === 0) return '';
    
    const latest = this.reflections[this.reflections.length - 1];
    const date = new Date(latest.date).toLocaleDateString();
    
    return `
      <div class="mt-4 pt-4 border-t">
        <h3 class="font-medium text-sm mb-2">Latest Reflection</h3>
        <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">${latest.text}</p>
        <p class="text-xs text-muted-foreground mt-2">${date}</p>
      </div>
    `;
  }

  renderActivityItem(title, value, colorClass) {
    return `
      <div class="text-center">
        <div class="${colorClass} text-2xl font-bold mb-1">${value}</div>
        <div class="text-sm text-muted-foreground">${title}</div>
      </div>
    `;
  }

  getCompletedTasksCount() {
    // This would track completed tasks - for now just return 0
    return '0';
  }

  init() {
    this.initPhotoWidget();
    this.initGoals();
    this.initTasks();
    this.initLearning();
    this.initReflection();
    this.bindGlobalDeleteHandlers();
  }

  /* ------------------------------
     PHOTO WIDGET
  ------------------------------ */
  initPhotoWidget() {
    // Auto-rotate every 5 seconds
    this.photoInterval = setInterval(() => {
      this.nextPhoto();
    }, 5000);

    // Manual next button
    document.getElementById('photo-next')?.addEventListener('click', () => {
      this.nextPhoto();
    });
  }

  nextPhoto() {
    this.photoIndex = (this.photoIndex + 1) % this.photoList.length;
    const img = document.getElementById("photo-widget-img");
    
    if (img) {
      img.style.opacity = "0";
      setTimeout(() => {
        img.src = this.photoList[this.photoIndex];
        img.style.opacity = "1";
      }, 300);
    }
  }

  /* ------------------------------
     GOALS
  ------------------------------ */
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
    };

    addBtn?.addEventListener('click', addGoal);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addGoal();
    });
  }

  refreshGoalsList() {
    const list = document.getElementById("goal-list");
    if (list) {
      list.innerHTML = this.renderGoalList();
    }
  }

  /* ------------------------------
     TASKS
  ------------------------------ */
  initTasks() {
    const input = document.getElementById("task-input");
    const addBtn = document.getElementById("task-add-btn");

    const addTask = () => {
      const val = input.value.trim();
      if (!val) return;
      this.tasks.push(val);
      Storage.set("dashboard_tasks", this.tasks);
      input.value = "";
      this.refreshTasksList();
    };

    addBtn?.addEventListener('click', addTask);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });

    this.bindTaskCheckboxes();
  }

  refreshTasksList() {
    const list = document.getElementById("task-list");
    if (list) {
      list.innerHTML = this.renderTaskList();
      this.bindTaskCheckboxes();
    }
  }

  bindTaskCheckboxes() {
    document.querySelectorAll(".task-check").forEach(checkbox => {
      checkbox.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.taskIndex);
        // Mark as completed (you might want to move to a completed list instead of deleting)
        setTimeout(() => {
          this.tasks.splice(index, 1);
          Storage.set("dashboard_tasks", this.tasks);
          this.refreshTasksList();
        }, 300);
      });
    });
  }

  /* ------------------------------
     LEARNING
  ------------------------------ */
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
    };

    addBtn?.addEventListener('click', addLearning);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addLearning();
    });
  }

  refreshLearningList() {
    const list = document.getElementById("learning-list");
    if (list) {
      list.innerHTML = this.renderLearningList();
    }
  }

  /* ------------------------------
     DAILY REFLECTION
  ------------------------------ */
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
      
      // Show success feedback
      this.showNotification('Reflection saved successfully!');
      this.refreshReflectionDisplay();
    });
  }

  refreshReflectionDisplay() {
    // This would refresh the recent reflection display
    // For now, we'll just show the notification
  }

  showNotification(message) {
    // Simple notification - you could enhance this with a proper toast
    const existingNotification = document.querySelector('.dashboard-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'dashboard-notification fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /* ------------------------------
     GLOBAL DELETE HANDLERS
  ------------------------------ */
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
        }
      }
    });
  }

  // Cleanup when component is destroyed
  destroy() {
    if (this.photoInterval) {
      clearInterval(this.photoInterval);
    }
  }
}