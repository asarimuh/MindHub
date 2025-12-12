function renderStocksPage(watchlist) {
  return `
    <div class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight mb-2">Stocks</h1>
      <p class="text-muted-foreground">Your stock watchlist and market data</p>
    </div>

    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Stock Watchlist</h2>
        <button id="manage-watchlist-btn" class="text-sm text-blue-600 hover:text-blue-800">Manage</button>
      </div>
      
      <div class="space-y-4">
        ${watchlist.map(stock => renderStockItem(stock)).join('')}
      </div>
    </div>

    ${renderMarketSummary()}
    ${renderWatchlistModal(watchlist)}
  `;
}

function renderStockItem(stock) {
  const changeClass = stock.trend === 'up' ? 'stock-up' : 'stock-down';
  const changeSymbol = stock.trend === 'up' ? '+' : '';
  return `
    <div class="flex justify-between items-center">
      <div>
        <div class="font-medium">${stock.symbol}</div>
        <div class="text-sm text-muted-foreground">${stock.name}</div>
      </div>
      <div class="text-right">
        <div class="font-medium">${stock.price.toLocaleString()}</div>
        <div class="text-sm ${changeClass}">${changeSymbol}${stock.change}%</div>
      </div>
      <div class="w-16 h-8">
        <canvas id="${stock.symbol.toLowerCase()}-chart"></canvas>
      </div>
    </div>
  `;
}

function renderMarketSummary() {
  return `
    <div class="card p-6 mt-6">
      <h2 class="text-xl font-semibold mb-4">Market Summary</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">+1.2%</div>
          <div class="text-sm text-muted-foreground">IHSG</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">-0.8%</div>
          <div class="text-sm text-muted-foreground">LQ45</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">+2.1%</div>
          <div class="text-sm text-muted-foreground">Finance</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">-1.5%</div>
          <div class="text-sm text-muted-foreground">Mining</div>
        </div>
      </div>
    </div>
  `;
}

function renderWatchlistModal(watchlist) {
  return `
    <div id="watchlist-modal" class="modal-overlay hidden">
      <div class="modal-content p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Manage Watchlist</h3>
          <button id="close-watchlist-modal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Add Stock Symbol</label>
            <div class="flex">
              <input type="text" id="new-stock-symbol" class="input flex-1" placeholder="e.g., BBCA">
              <button id="add-stock-btn" class="btn btn-primary ml-2">Add</button>
            </div>
          </div>
          <div>
            <h4 class="font-medium mb-2">Current Watchlist</h4>
            <div id="current-watchlist" class="space-y-2">
              ${watchlist.map(stock => renderWatchlistItem(stock)).join('')}
            </div>
          </div>
          <div class="flex justify-end space-x-2">
            <button id="cancel-watchlist" class="btn btn-secondary">Cancel</button>
            <button id="save-watchlist" class="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderWatchlistItem(stock) {
  return `
    <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
      <span class="font-medium">${stock.symbol}</span>
      <button class="text-red-500 remove-stock" data-symbol="${stock.symbol}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
  `;
}
