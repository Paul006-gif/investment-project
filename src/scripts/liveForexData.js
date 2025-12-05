class LiveForexDataManager {
	constructor() {
		this.forexTableElement = null;
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
		// Find the forex table element
		this.forexTableElement = document.querySelector('#forex-tbody');
		
		console.log('Forex table element found:', !!this.forexTableElement);
		
		if (this.forexTableElement) {
			this.startLiveUpdates();
		} else {
			console.log('Forex table element not found, retrying in 1 second...');
			setTimeout(() => this.setup(), 1000);
		}
	}

	async startLiveUpdates() {
		// Initial data fetch
		await this.updateForexTable();

		// Set up real-time updates every 5 minutes to avoid rate limits
		this.updateInterval = setInterval(async () => {
			await this.updateForexTable();
		}, 300000); // 5 minutes = 5 * 60 * 1000
	}

	async updateForexTable() {
		try {
			console.log('Fetching forex data...');
			const response = await fetch('/api/forex');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('Forex API response:', result);
			
			if (result.error) {
				throw new Error(result.error);
			}

			console.log('Rendering forex table with data:', result.data);
			this.renderForexTable(result.data);
		} catch (error) {
			console.error('Error updating forex table:', error);
		}
	}

	renderForexTable(data) {
		if (!this.forexTableElement) return;

		console.log('Rendering forex table. Data length:', data.length);
		console.log('Forex table element:', this.forexTableElement);

		// Clear existing data
		this.forexTableElement.innerHTML = '';

		// Render new data
		data.forEach(forex => {
			const row = this.createForexRow(forex);
			this.forexTableElement.appendChild(row);
		});

		console.log('Forex table rendered successfully');
	}

	createForexRow(forex) {
		const row = document.createElement('tr');
		
		// Determine if change is positive or negative
		const changeValue = parseFloat(forex.change);
		const changePercentValue = parseFloat(forex.changePercent.replace('%', ''));
		const isPositive = changeValue >= 0 || changePercentValue >= 0;
		
		// Format the change display
		const changeDisplay = isPositive ? `+${forex.changePercent}` : forex.changePercent;
		
		// Set inline styles for the row
		row.style.transition = 'all 0.2s ease';
		row.style.cursor = 'pointer';
		
		// Create pair cell with flag
		const pairCell = forex.flag ? 
			`<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle;">
				<div style="display: flex; align-items: center; gap: 12px;">
					<span style="font-size: 1.5rem;">${forex.flag}</span>
					<span style="font-weight: 700; color: #1e293b; font-size: 1rem;">${forex.symbol}</span>
				</div>
			</td>` :
			`<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle; font-weight: 700; font-size: 1rem;">${forex.symbol}</td>`;
		
		row.innerHTML = `
			${pairCell}
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle; font-weight: 600; font-size: 1rem;">${forex.price}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; vertical-align: middle;">
				<span style="color: ${isPositive ? '#10b981' : '#ef4444'}; font-weight: 600; background: ${isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; padding: 4px 8px; border-radius: 6px; display: inline-block;">${changeDisplay}</span>
			</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${forex.dayRange}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${forex.week52Range}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${forex.spread}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${forex.pips}</td>
			<td style="padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #64748b; vertical-align: middle; font-size: 0.875rem;">${forex.liquidity}</td>
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
		await this.updateForexTable();
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

// Initialize the live forex data manager
const liveForexManager = new LiveForexDataManager();

// Make it available globally for manual refresh if needed
window.liveForexManager = liveForexManager;
