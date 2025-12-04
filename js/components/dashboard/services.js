/**
 * Dashboard Services
 * 
 * Encapsulates GitHub activity, photo widget, and utility functions.
 * Handles data transformation and side effects outside of view rendering.
 */

// ========== GITHUB SERVICE ==========
class GitHubService {
  static getCommitIntensity(count) {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    return 3;
  }

  static getColorClass(intensity) {
    const colors = [
      'bg-[#ebedf0] hover:bg-[#dfe2e6]',      // 0 commits
      'bg-[#9be9a8] hover:bg-[#8cdb99]',      // 1-2 commits
      'bg-[#40c463] hover:bg-[#39b358]',      // 3-4 commits
      'bg-[#30a14e] hover:bg-[#2d9549]',      // 5+ commits
    ];
    return colors[intensity];
  }

  static getCurrentStreak(days) {
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

  static getDaysWithCount(days, min, max = null) {
    return days.filter(d => {
      if (max === null) {
        return d.contributionCount >= min;
      }
      return d.contributionCount >= min && d.contributionCount <= max;
    }).length;
  }

  static renderMonthHeaders(weeks) {
    return weeks.map((week, index) => {
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
  }

  static renderContributionGrid(weeks) {
    return weeks.map(week =>
      week.contributionDays
        .map(day => {
          const intensity = this.getCommitIntensity(day.contributionCount);
          const colorClass = this.getColorClass(intensity);
          const date = new Date(day.date);

          return `
            <div class="relative group">
              <div class="commit-box rounded-[2px] border border-gray-100 ${colorClass}" style="width: var(--cell-size); height: var(--cell-size);" title="${date.toDateString()}: ${day.contributionCount} commits"></div>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-50">
                <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                  <div class="font-semibold">${day.contributionCount} contributions</div>
                  <div class="text-gray-300 text-[10px] mt-0.5">
                    ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          `;
        })
        .join('')
    ).join('');
  }
}

// ========== PHOTO WIDGET SERVICE ==========
class PhotoWidgetService {
  constructor(photoList) {
    this.photoList = photoList;
    this.photoIndex = 0;
    this.photoInterval = null;
  }

  nextPhoto() {
    const img = document.getElementById("photo-widget-img");
    if (!img) return;

    this.photoIndex = (this.photoIndex + 1) % this.photoList.length;
    const nextSrc = this.photoList[this.photoIndex];

    img.style.transition = "opacity 0.3s ease";
    img.style.opacity = "0";

    setTimeout(() => {
      img.src = nextSrc;
      img.offsetHeight; // force reflow
      img.style.opacity = "1";
    }, 300);
  }

  startAutoSlide() {
    this.photoInterval = setInterval(() => {
      this.nextPhoto();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.photoInterval) {
      clearInterval(this.photoInterval);
      this.photoInterval = null;
    }
  }

  destroy() {
    this.stopAutoSlide();
  }
}
