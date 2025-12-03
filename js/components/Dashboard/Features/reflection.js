// Reflection module
(function () {
  window.DashboardModules = window.DashboardModules || {};
  window.DashboardModules.Features = window.DashboardModules.Features || {};

  class Reflection {
    constructor(dashboard) {
      this.dashboard = dashboard;
      this.state = dashboard.state;
    }

    init() {
      document.getElementById("reflection-add-btn")?.addEventListener("click", () => this.addReflection());
      this.dashboard.onDestroy(() => this.destroy());
    }

    addReflection() {
      const input = document.getElementById("reflection-input");
      if (!input) return;
      const val = input.value.trim();
      if (!val) return;
      const item = { text: val, date: new Date().toISOString() };
      this.state.reflections.push(item);
      window.DashboardModules.State.save("dashboard_reflections", this.state.reflections);
      input.value = "";
      this.showNotification('Reflection saved successfully!');
      // refresh only the reflection area by re-rendering the whole dashboard or just the section
      // simplest: re-render page content
      const pageContent = document.getElementById('page-content');
      if (pageContent && window.app && window.app.components && window.app.components.dashboard) {
        pageContent.innerHTML = window.app.components.dashboard.render();
        window.app.components.dashboard.init();
      }
    }

    showNotification(message) {
      const existing = document.querySelector('.dashboard-notification');
      if (existing) existing.remove();
      const n = document.createElement('div');
      n.className = 'dashboard-notification fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      n.textContent = message;
      document.body.appendChild(n);
      setTimeout(() => n.remove(), 3000);
    }

    destroy() {}
  }

  window.DashboardModules.Features.Reflection = Reflection;
})();
