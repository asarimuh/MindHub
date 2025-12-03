// GitHub module (only handles fetching + rendering into container)
// You already have complex logic in original; this is minimal functional port.
// Assumes your local server provides /api/github
(function () {
  window.DashboardModules = window.DashboardModules || {};
  window.DashboardModules.Features = window.DashboardModules.Features || {};

  class GitHub {
    constructor(dashboard) {
      this.dashboard = dashboard;
      this.state = dashboard.state;
    }

    init() {
      this.fetchGitHubActivity();
      this.dashboard.onDestroy(() => this.destroy());
    }

    async fetchGitHubActivity() {
      const container = document.getElementById("github-commits");
      if (!container) return;
      try {
        const res = await fetch("http://localhost:3000/api/github");
        const data = await res.json();
        const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
        const days = weeks.flatMap(w => w.contributionDays);
        const total = days.reduce((s, d) => s + d.contributionCount, 0);

        // build a very small visual summary to avoid mega-HTML here
        container.innerHTML = `<div class="w-full"><div class="flex items-center justify-between mb-3"><div class="text-sm font-semibold">Year in Code</div><div class="text-xs bg-gray-100 px-2 py-1 rounded-md">${total} commits</div></div><div class="text-xs text-muted-foreground">Loaded contribution data</div></div>`;

      } catch (err) {
        container.innerHTML = `<div class="text-center py-8 space-y-3"><div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01"/></svg></div><div><h3 class="font-medium text-gray-900 mb-1">Unable to load contributions</h3><p class="text-sm text-muted-foreground mb-3">Check your connection and try again</p><button onclick="window.app.components.dashboard.fetchGitHubActivity?.()" class="btn btn-secondary text-xs px-3 py-1.5">Retry</button></div></div>`;
      }
    }

    destroy() {}
  }

  window.DashboardModules.Features.GitHub = GitHub;
})();
