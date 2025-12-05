interface StockData {
	symbol: string;
	price: string;
	change: string;
	changePercent: string;
	volume: string;
	marketCap: string;
}

interface ApiResponse {
	data: StockData[];
	error?: string;
}

class StockMarketService {
	private readonly symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META'];

	async fetchStockData(): Promise<StockData[]> {
		try {
			// Use our API route that securely handles the Finnhub API key
			const response = await fetch('/api/stocks');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result: ApiResponse = await response.json();
			
			if (result.error) {
				throw new Error(result.error);  
			}

			return result.data;
		} catch (error) {
			console.error('Error fetching stock data:', error);
			throw error; // Re-throw error instead of returning fallback data
		}
	}

	// Method to get real-time updates
	async startRealTimeUpdates(callback: (data: StockData[]) => void): Promise<void> {
		const updateInterval = 30000; // 30 seconds

		const fetchAndUpdate = async () => {
			const data = await this.fetchStockData();
			callback(data);
		};

		// Initial fetch
		await fetchAndUpdate();

		// Set up interval for real-time updates
		setInterval(fetchAndUpdate, updateInterval);
	}
}

export default StockMarketService;
export type { StockData, ApiResponse };
