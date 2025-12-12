function renderNewsPage(currentCategory, newsData) {
  return `
    <div class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight mb-2">News</h1>
      <p class="text-muted-foreground">Latest news and updates</p>
    </div>

    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Latest News</h2>
        <div class="flex space-x-1" id="news-categories">
          ${renderNewsCategoryButtons(currentCategory)}
        </div>
      </div>
      
      <div id="news-container" class="space-y-4 max-h-96 overflow-y-auto">
        ${renderNewsItems(currentCategory, newsData)}
      </div>
    </div>
  `;
}

function renderNewsCategoryButtons(currentCategory) {
  const categories = [
    { id: 'tech', name: 'Tech' },
    { id: 'finance', name: 'Finance' },
    { id: 'indonesia', name: 'Indonesia' }
  ];

  return categories.map(category => `
    <button class="news-category-btn text-xs px-2 py-1 rounded ${category.id === currentCategory ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}" data-category="${category.id}">
      ${category.name}
    </button>
  `).join('');
}

function renderNewsItems(category, newsData) {
  const news = (newsData && newsData[category]) || [];
  return news.map(item => `
    <div class="news-item">
      <h3 class="font-medium text-sm">${item.title}</h3>
      <p class="text-xs text-muted-foreground mt-1">${item.source} • ${item.time}</p>
    </div>
  `).join('');
}
