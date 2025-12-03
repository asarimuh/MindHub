// Exposes: window.DashboardModules.State
(function () {
  window.DashboardModules = window.DashboardModules || {};

  const defaultPhotos = [
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

  window.DashboardModules.State = {
    load() {
      // Storage is global (your js/utils/storage.js)
      return {
        goals: Storage.get("dashboard_goals") || [],
        tasks: Storage.get("dashboard_tasks") || [],
        completedTasks: Storage.get("dashboard_completed_tasks") || [],
        currentTaskFilter: Storage.get("dashboard_task_filter") || "all",
        learning: Storage.get("dashboard_learning") || [],
        reflections: Storage.get("dashboard_reflections") || [],
        memoryActive: Storage.get("memory_board_active") ?? true,
        photoList: Storage.get("dashboard_photos") || defaultPhotos,
        // place for future server data (github etc.)
        github: null,
      };
    },

    save(key, value) {
      Storage.set(key, value);
    },

    // convenience: persist known keys
    persistState(state) {
      Storage.set("dashboard_goals", state.goals);
      Storage.set("dashboard_tasks", state.tasks);
      Storage.set("dashboard_completed_tasks", state.completedTasks);
      Storage.set("dashboard_task_filter", state.currentTaskFilter);
      Storage.set("dashboard_learning", state.learning);
      Storage.set("dashboard_reflections", state.reflections);
      Storage.set("memory_board_active", state.memoryActive);
      Storage.set("dashboard_photos", state.photoList);
    }
  };
})();
