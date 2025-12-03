// Learning module
(function () {
  window.DashboardModules = window.DashboardModules || {};
  window.DashboardModules.Features = window.DashboardModules.Features || {};

  class Learning {
    constructor(dashboard) {
      this.dashboard = dashboard;
      this.state = dashboard.state;
    }

    init() {
      document.getElementById("learning-add-btn")?.addEventListener("click", () => this.addLearning());
      document.getElementById("learning-input")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.addLearning();
      });
      this.refreshLearningList();
      this.dashboard.onDestroy(() => this.destroy());
    }

    destroy() { /* nothing to cleanup */ }

    addLearning() {
      const input = document.getElementById("learning-input");
      if (!input) return;
      const val = input.value.trim();
      if (!val) return;
      this.state.learning.push(val);
      window.DashboardModules.State.save("dashboard_learning", this.state.learning);
      input.value = "";
      this.refreshLearningList();
    }

    refreshLearningList() {
      const list = document.getElementById("learning-list");
      if (!list) return;
      if (this.state.learning.length === 0) {
        list.innerHTML = `<div class="text-center py-4 text-gray-500"><p class="text-sm">No learning items yet</p></div>`;
        return;
      }
      list.innerHTML = this.state.learning.map((item, i) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-sm flex-1">${item}</span>
          </div>
          <button class="delete-learning text-gray-400 hover:text-red-500 transition-colors" data-index="${i}">🗑️</button>
        </div>
      `).join('');
      list.querySelectorAll('.delete-learning').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          this.state.learning.splice(idx, 1);
          window.DashboardModules.State.save("dashboard_learning", this.state.learning);
          this.refreshLearningList();
        });
      });
    }
  }

  window.DashboardModules.Features.Learning = Learning;
})();
