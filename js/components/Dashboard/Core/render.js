// Exposes: window.DashboardModules.Render
(function () {
  window.DashboardModules = window.DashboardModules || {};

  window.DashboardModules.Render = function renderDashboard(state) {
    const S = window.DashboardModules.Sections;
    return `
      <div class="dashboard-container">
        ${S.renderHeader()}
        ${S.renderQuickStats(state)}

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3 space-y-6">
            ${S.renderTasks(state)}
            ${S.renderLearning(state)}
          </div>

          <div class="space-y-6">
            ${S.renderGoals(state)}
            ${S.renderReflection(state)}
            ${S.renderPhotoWidget(state)}
          </div>
        </div>

        ${S.renderRecentActivity(state)}
        ${S.renderGitHub(state)}
      </div>
    `;
  };
})();
