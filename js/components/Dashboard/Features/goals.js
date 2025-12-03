// Goals module
(function () {
  window.DashboardModules = window.DashboardModules || {};
  window.DashboardModules.Features = window.DashboardModules.Features || {};

  class Goals {
    constructor(dashboard) {
      this.dashboard = dashboard;
      this.state = dashboard.state;
    }

    init() {
      document.getElementById("goal-add-btn")?.addEventListener("click", () => this.addGoal());
      document.getElementById("goal-input")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.addGoal();
      });
      this.refreshGoalsList();
      this.dashboard.onDestroy(() => this.destroy());
    }

    destroy() {
      // nothing fancy now
    }

    addGoal() {
      const input = document.getElementById("goal-input");
      if (!input) return;
      const val = input.value.trim();
      if (!val) return;
      this.state.goals.push(val);
      window.DashboardModules.State.save("dashboard_goals", this.state.goals);
      input.value = "";
      this.refreshGoalsList();
    }

    refreshGoalsList() {
      const list = document.getElementById("goal-list");
      if (!list) return;
      if (this.state.goals.length === 0) {
        list.innerHTML = `<div class="text-center py-4 text-gray-500"><p class="text-sm">No goals yet</p></div>`;
        return;
      }
      list.innerHTML = this.state.goals.map((goal, i) => `
        <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span class="text-sm flex-1">${goal}</span>
          </div>
          <button class="delete-goal text-gray-400 hover:text-red-500 transition-colors" data-index="${i}">🗑️</button>
        </div>
      `).join('');
      // attach delete listeners
      list.querySelectorAll('.delete-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          this.state.goals.splice(idx, 1);
          window.DashboardModules.State.save("dashboard_goals", this.state.goals);
          this.refreshGoalsList();
        });
      });
    }
  }

  window.DashboardModules.Features.Goals = Goals;
})();
