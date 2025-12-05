import StockMarketService, { StockData } from '../services/stockMarket';

class LiveStockDataManager {
	private service: StockMarketService;
	private stockTableElement: HTMLElement | null = null;
	private updateInterval: NodeJS.Timeout | null = null;

	constructor() {
		this.service = new StockMarketService();
		this.init();
	}

	private init(): void {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.setup());
		} else {
			this.setup();
		}
	}

	private setup(): void {
		// Find the stock table element
		this.stockTableElement = document.querySelector('#stock-tbody');
		
		if (this.stockTableElement) {
			this.startLiveUpdates();
		}
	}

	private async startLiveUpdates(): Promise<void> {
		// Initial data fetch
		await this.updateStockTable();

		// Set up real-time updates every 30 seconds
		this.updateInterval = setInterval(async () => {
			await this.updateStockTable();
		}, 30000);
	}

	private async updateStockTable(): Promise<void> {
		try {
			const stockData = await this.service.fetchStockData();
			this.renderStockTable(stockData);
		} catch (error) {
			console.error('Error updating stock table:', error);
		}
	}

	private renderStockTable(data: StockData[]): void {
		if (!this.stockTableElement) return;

		// Clear existing data
		this.stockTableElement.innerHTML = '';

		// Render new data
		data.forEach(stock => {
			const row = this.createStockRow(stock);
			this.stockTableElement!.appendChild(row);
		});
	}

	private createStockRow(stock: StockData): HTMLTableRowElement {
		const row = document.createElement('tr');
		
		const changeClass = stock.changePercent.startsWith('+') ? 'positive' : 'negative';
		
		row.innerHTML = `
			<td class="symbol">${stock.symbol}</td>
			<td class="price">${stock.price}</td>
			<td class="change ${changeClass}">${stock.changePercent}</td>
			<td>${stock.volume}</td>
			<td>${stock.marketCap}</td>
		`;

		// Add hover effect
		row.addEventListener('mouseenter', () => {
			row.style.background = '#f8fafc';
		});

		row.addEventListener('mouseleave', () => {
			row.style.background = '';
		});

		return row;
	}

	// Method to manually refresh data
	public async refreshData(): Promise<void> {
		await this.updateStockTable();
	}

	// Method to stop live updates
	public stopUpdates(): void {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}

	// Method to restart updates
	public restartUpdates(): void {
		this.stopUpdates();
		this.startLiveUpdates();
	}
}

// Initialize the live stock data manager
const liveStockManager = new LiveStockDataManager();

// Make it available globally for manual refresh if needed
(window as any).liveStockManager = liveStockManager;

export default LiveStockManager;
