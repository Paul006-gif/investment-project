class LiveStockDataManager {
	constructor() {
		this.stockTableElement = null;
		this.updateInterval = null;
		this.init();
	}

	init() {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.setup());
		} else {
			this.setup();
		}
	}

	setup() {
		// Find the stock table element
		this.stockTableElement = document.querySelector('#stock-tbody');
		
		if (this.stockTableElement) {
			this.startLiveUpdates();
		}
	}

	async startLiveUpdates() {
		// Initial data fetch
		await this.updateStockTable();

		// Set up real-time updates every 5 minutes to avoid rate limits
		this.updateInterval = setInterval(async () => {
			await this.updateStockTable();
		}, 300000); // 5 minutes = 5 * 60 * 1000
	}

	async updateStockTable() {
		try {
			const response = await fetch('/api/stocks');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			
			if (result.error) {
				throw new Error(result.error);
			}

			this.renderStockTable(result.data);
		} catch (error) {
			console.error('Error updating stock table:', error);
		}
	}

	renderStockTable(data) {
		if (!this.stockTableElement) return;

		// Clear existing data
		this.stockTableElement.innerHTML = '';

		// Render new data
		data.forEach(stock => {
			const row = this.createStockRow(stock);
			this.stockTableElement.appendChild(row);
		});
	}

	createStockRow(stock) {
		const row = document.createElement('tr');
		
		// Determine if change is positive or negative
		const changeValue = parseFloat(stock.change);
		const changePercentValue = parseFloat(stock.changePercent.replace('%', ''));
		const isPositive = changeValue >= 0 || changePercentValue >= 0;
		
		// Format the change display
		const changeDisplay = isPositive ? `+${stock.changePercent}` : stock.changePercent;
		
		// Set inline styles for the row
		row.style.transition = 'all 0.2s ease';
		row.style.cursor = 'pointer';
		
		// Create company cell with logo
		const companyCell = stock.logo ? 
			`<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle;">
				<div style="display: flex; align-items: center; gap: 12px;">
					<img src="${stock.logo}" alt="${stock.name}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
					<div style="display: none; width: 32px; height: 32px; border-radius: 4px; background: #f1f5f9; align-items: center; justify-content: center; font-weight: 600; color: #64748b;">${stock.symbol.charAt(0)}</div>
					<span style="font-weight: 600; color: #1e293b;">${stock.name}</span>
				</div>
			</td>` :
			`<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle; font-weight: 600;">${stock.name}</td>`;
		
		row.innerHTML = `
			${companyCell}
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle; font-weight: 700; font-size: 1rem;">${stock.symbol}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle; font-weight: 600; font-size: 1rem;">${stock.price}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle;">
				<span style="color: ${isPositive ? '#10b981' : '#ef4444'}; font-weight: 600; background: ${isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; padding: 4px 8px; border-radius: 6px; display: inline-block;">${changeDisplay}</span>
			</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.volume}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.marketCap}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.dayRange}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.week52Range}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.peRatio}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.eps}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${stock.industry}</td>
		`;

		// Add hover effect
		row.addEventListener('mouseenter', () => {
			row.style.background = '#f8fafc';
			row.style.transform = 'translateX(2px)';
		});

		row.addEventListener('mouseleave', () => {
			row.style.background = '';
			row.style.transform = '';
		});

		return row;
	}

	// Method to manually refresh data
	async refreshData() {
		await this.updateStockTable();
	}

	// Method to stop live updates
	stopUpdates() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}

	// Method to restart updates
	restartUpdates() {
		this.stopUpdates();
		this.startLiveUpdates();
	}
}

// Initialize the live stock data manager
const liveStockManager = new LiveStockDataManager();

// Make it available globally for manual refresh if needed
window.liveStockManager = liveStockManager;
