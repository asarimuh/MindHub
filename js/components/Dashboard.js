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

        <!-- GitHub Activity Section -->
        <div class="mt-8">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold tracking-tight">GitHub Activity</h2>
                  <p class="text-sm text-muted-foreground">Your 30-day contribution history</p>
                </div>
              </div>
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 bg-[#ebedf0] rounded-[1px] border border-gray-200"></div>
                  <span>Less</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 bg-[#216e39] rounded-[1px] border border-gray-200"></div>
                  <span>More</span>
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

  async fetchGitHubActivity() {
  try {
    const res = await fetch("http://localhost:3000/api/github");
    const data = await res.json();

    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const days = weeks.flatMap(w => w.contributionDays);
    
    // Use ALL days for the yearly view, not just last 30
    const total = days.reduce((sum, d) => sum + d.contributionCount, 0);

    const container = document.getElementById("github-commits");
    
    if (container) {

      // --- Month Header ---
      const monthHeaders = weeks.map((week, index) => {
        const firstDay = new Date(week.contributionDays[0].date);
        const showLabel =
          index === 0 ||
          new Date(weeks[index - 1].contributionDays[0].date).getMonth() !==
            firstDay.getMonth();
        return `
          <div class="text-[10px] text-gray-500 h-4 w-3 text-center">
            ${showLabel ? firstDay.toLocaleString('en-US', { month: 'short' }) : ''}
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="w-full space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-3 gap-3">
            ${this.renderStatCard('Total', total, 'text-blue-600', 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253')}

            ${this.renderStatCard('Daily Avg', Math.round(total / 365), 'text-green-600', 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')}

            ${this.renderStatCard('Streak', this.getCurrentStreak(days), 'text-orange-600', 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6')}
          </div>

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
                  <div class="flex gap-1 min-w-max mb-1">
                    ${monthHeaders}
                  </div>

                  <!-- Contribution Grid -->
                  <div class="flex gap-1 min-w-max">
                    <div class="grid grid-rows-7 grid-flow-col gap-1">
                      ${weeks
                        .map(week => 
                          week.contributionDays
                            .map(day => {
                              const intensity = this.getCommitIntensity(day.contributionCount);
                              const colorClass = this.getColorClass(intensity);
                              const date = new Date(day.date);

                              return `
                                <div class="relative group">
                                  <div 
                                    class="w-3 h-3 rounded-[2px] border border-gray-100 ${colorClass}"
                                    title="${date.toDateString()}: ${day.contributionCount} commits"
                                  ></div>

                                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-20">
                                    <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                                      <div class="font-semibold">${day.contributionCount} contributions</div>
                                      <div class="text-gray-300 text-[10px] mt-0.5">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                    </div>
                                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              `;
                            })
                            .join('')
                        )
                        .join('')}
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

          <!-- Activity Breakdown - Update to use full year data -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-900">Activity Breakdown</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#ebedf0] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">No commits</span>
                </div>
                <span class="font-medium text-gray-900">${this.getDaysWithCount(days, 0)} days</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#9be9a8] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">1-2 commits</span>
                </div>
                <span class="font-medium text-gray-900">${this.getDaysWithCount(days, 1, 2)} days</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#40c463] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">3-4 commits</span>
                </div>
                <span class="font-medium text-gray-900">${this.getDaysWithCount(days, 3, 4)} days</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-teal-50/50 rounded-lg border text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#30a14e] rounded-[1px] border border-gray-200"></div>
                  <span class="text-gray-700">5+ commits</span>
                </div>
                <span class="font-medium text-gray-900">${this.getDaysWithCount(days, 5)} days</span>
              </div>
            </div>
          </div>
        </div>
      `;
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


  renderStatCard(title, value, color, iconPath) {
    return `
      <div class="card p-3 text-center">
        <div class="${color} mb-1">
          <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
          </svg>
        </div>
        <div class="text-lg font-semibold text-gray-900">${value}</div>
        <div class="text-xs text-muted-foreground mt-0.5">${title}</div>
      </div>
    `;
  }

  getYearlyContributions(days) {
  const months = Array(12).fill().map(() => []);
  
  days.forEach(day => {
    const date = new Date(day.date);
    const month = date.getMonth(); // 0-11
    months[month].push(day);
  });
  
  return months.map(monthDays => ({
    days: monthDays
  }));
}

  // Helper methods for GitHub activity
  getCommitIntensity(count) {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    return 3;
  }

  getColorClass(intensity) {
  const colors = [
    'bg-[#ebedf0] hover:bg-[#dfe2e6]',      // 0 commits
    'bg-[#9be9a8] hover:bg-[#8cdb99]',      // 1-2 commits
    'bg-[#40c463] hover:bg-[#39b358]',      // 3-4 commits
    'bg-[#30a14e] hover:bg-[#2d9549]',      // 5+ commits
  ];
  return colors[intensity];
}

  getCurrentStreak(days) {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) {
        streak++;
      } else if (days[i].date !== today) {
        break;
      }
    }
    return streak;
  }

  getStartDate(days) {
    if (days.length === 0) return '';
    const startDate = new Date(days[0].date);
    return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMonthLabels(days) {
    if (days.length === 0) return [];
    const months = [];
    let currentMonth = '';
    
    days.forEach(day => {
      const date = new Date(day.date);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      if (month !== currentMonth) {
        months.push(month);
        currentMonth = month;
      } else {
        months.push('');
      }
    });
    
    // Only return non-empty months for the rows
    return Array(5).fill('').map((_, i) => {
      const index = i * 7;
      return months[index] || '';
    });
  }

  getDaysWithCount(days, min, max = null) {
    return days.filter(d => {
      if (max === null) {
        return d.contributionCount >= min;
      }
      return d.contributionCount >= min && d.contributionCount <= max;
    }).length;
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
    this.fetchGitHubActivity();
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