const StocksService = {
  initializeCharts(watchlist) {
    // Defer chart creation to allow DOM to mount
    setTimeout(() => {
      watchlist.forEach(stock => {
        try {
          this.createMiniChart(stock.symbol.toLowerCase(), stock.trend);
        } catch (err) {
          console.warn('Chart creation failed for', stock.symbol, err);
        }
      });
    }, 50);
  },

  createMiniChart(canvasId, trend) {
    const el = document.getElementById(`${canvasId}-chart`);
    if (!el) return;
    const ctx = el.getContext('2d');
    const data = this.generateRandomStockData(5, trend);
    const color = trend === 'up' ? '#10b981' : '#ef4444';
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['', '', '', '', ''],
        datasets: [{
          data: data,
          borderColor: color,
          backgroundColor: trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { display: false }, y: { display: false } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });
  },

  generateRandomStockData(points, trend) {
    const data = [100];
    for (let i = 1; i < points; i++) {
      const change = trend === 'up' ? Math.random() * 5 : -Math.random() * 5;
      data.push(data[i-1] + change);
    }
    return data;
  }
};
