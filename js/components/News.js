class News {
  constructor() {
    this.name = 'news';
    this.currentCategory = 'tech';
    this.newsData = {
      tech: [
        { title: "New AI Model Breaks Performance Records", source: "TechCrunch", time: "2 hours ago" },
        { title: "Tech Giant Announces New Southeast Asia HQ in Jakarta", source: "Reuters", time: "8 hours ago" },
        { title: "Startup Funding Reaches Record High in 2023", source: "Tech in Asia", time: "10 hours ago" },
        { title: "Major Software Update Released with Security Fixes", source: "The Verge", time: "12 hours ago" },
        { title: "Tech Conference Draws Record Attendance", source: "TechRadar", time: "1 day ago" }
      ],
      finance: [
        { title: "Central Bank Holds Interest Rates Steady", source: "Bloomberg", time: "4 hours ago" },
        { title: "Stock Markets Reach New Highs Amid Positive Data", source: "Financial Times", time: "5 hours ago" },
        { title: "Cryptocurrency Regulations Tighten Globally", source: "CoinDesk", time: "7 hours ago" },
        { title: "Investment Firm Announces Major Acquisition", source: "Wall Street Journal", time: "9 hours ago" },
        { title: "Economic Indicators Show Strong Growth", source: "Reuters", time: "11 hours ago" }
      ],
      indonesia: [
        { title: "Indonesia's Economy Shows Strong Q3 Growth", source: "Kompas", time: "6 hours ago" },
        { title: "Government Announces New Infrastructure Projects", source: "Tempo", time: "8 hours ago" },
        { title: "Tourism Sector Rebounds with Record Visitors", source: "Koran Sindo", time: "10 hours ago" },
        { title: "Local Startup Reaches Unicorn Status", source: "Kontan", time: "1 day ago" },
        { title: "New Policy Aims to Boost Digital Economy", source: "Bisnis Indonesia", time: "1 day ago" }
      ]
    };
  }

  render() {
    return `
      <div class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight mb-2">News</h1>
        <p class="text-muted-foreground">Latest news and updates</p>
      </div>

      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Latest News</h2>
          <div class="flex space-x-1" id="news-categories">
            ${this.renderCategoryButtons()}
          </div>
        </div>
        
        <div id="news-container" class="space-y-4 max-h-96 overflow-y-auto">
          ${this.renderNewsItems(this.currentCategory)}
        </div>
      </div>
    `;
  }

  renderCategoryButtons() {
    const categories = [
      { id: 'tech', name: 'Tech', active: this.currentCategory === 'tech' },
      { id: 'finance', name: 'Finance', active: this.currentCategory === 'finance' },
      { id: 'indonesia', name: 'Indonesia', active: this.currentCategory === 'indonesia' }
    ];

    return categories.map(category => `
      <button class="news-category-btn text-xs px-2 py-1 rounded ${category.active ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}" 
              data-category="${category.id}">
        ${category.name}
      </button>
    `).join('');
  }

  renderNewsItems(category) {
    const news = this.newsData[category] || [];
    return news.map(item => `
      <div class="news-item">
        <h3 class="font-medium text-sm">${item.title}</h3>
        <p class="text-xs text-muted-foreground mt-1">${item.source} • ${item.time}</p>
      </div>
    `).join('');
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.news-category-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        this.switchCategory(category);
      });
    });
  }

  switchCategory(category) {
    this.currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.news-category-btn').forEach(btn => {
      const btnCategory = btn.getAttribute('data-category');
      if (btnCategory === category) {
        btn.classList.add('bg-blue-100', 'text-blue-800');
        btn.classList.remove('hover:bg-gray-100');
      } else {
        btn.classList.remove('bg-blue-100', 'text-blue-800');
        btn.classList.add('hover:bg-gray-100');
      }
    });

    // Update news content
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = this.renderNewsItems(category);
  }
}