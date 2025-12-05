import type { APIRoute } from 'astro';

interface FinnhubQuote {
	c: number; // Current price
	d: number; // Change
	dp: number; // Percent change
	h: number; // High price of the day
	l: number; // Low price of the day
	o: number; // Open price of the day
	pc: number; // Previous close price
}

interface FinnhubProfile {
	marketCapitalization: number;
	shareOutstanding: number;
	ticker: string;
	name: string;
	logo: string;
	ipo: string;
	weburl: string;
	finnhubIndustry: string;
	country: string;
	currency: string;
}

interface StockData {
	symbol: string;
	name: string;
	logo: string;
	price: string;
	change: string;
	changePercent: string;
	volume: string;
	marketCap: string;
	dayRange: string;
	week52Range: string;
	peRatio: string;
	eps: string;
	weburl: string;
	sector: string;
	industry: string;
}

// Simple in-memory cache
const stockCache = new Map();
const CACHE_DURATION = 4 * 60 * 1000; // 4 minutes cache

export const GET: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
	
	console.log('[Stocks API] API Key check:', apiKey ? 'Key found' : 'Key missing');
	console.log('[Stocks API] FINNHUB_API_KEY from import.meta.env:', import.meta.env.FINNHUB_API_KEY ? 'Yes' : 'No');
	console.log('[Stocks API] FINNHUB_API_KEY from process.env:', process.env.FINNHUB_API_KEY ? 'Yes' : 'No');
	
	if (!apiKey) {
		console.error('[Stocks API] FINNHUB_API_KEY is not configured in environment variables');
		return new Response(JSON.stringify({ error: 'API key not configured. Set FINNHUB_API_KEY environment variable.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Check cache first
	const now = Date.now();
	const cachedData = stockCache.get('stocks');
	if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
		console.log('Returning cached stock data');
		return new Response(JSON.stringify({ data: cachedData.data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'JPM', 'V', 'JNJ'];
	
	try {
		// Add delay between API calls to avoid rate limiting
		const stockPromises = symbols.map(async (symbol, index) => {
			// Add delay for each symbol to avoid rate limiting
			await new Promise(resolve => setTimeout(resolve, index * 200)); // 200ms delay between requests
			
			try {
				// Fetch both quote and profile data from Finnhub
				const [quoteResponse, profileResponse] = await Promise.all([
					fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
					fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`)
				]);

				if (!quoteResponse.ok || !profileResponse.ok) {
					throw new Error(`HTTP error! status: ${quoteResponse.status}, ${profileResponse.status}`);
				}

				const quote: FinnhubQuote = await quoteResponse.json();
				const profile: FinnhubProfile = await profileResponse.json();

				console.log(`Profile data for ${symbol}:`, profile);
				console.log(`Market cap from API: ${profile.marketCapitalization}`);

				// Check if we got valid data
				if (!quote.c || quote.c === 0) {
					throw new Error('Invalid quote data');
				}

				const stockData: StockData = {
					symbol: symbol,
					name: profile.name || symbol,
					logo: profile.logo || '',
					price: `$${quote.c.toFixed(2)}`,
					change: quote.d.toFixed(2),
					changePercent: `${quote.dp.toFixed(2)}%`,
					volume: calculateVolume(profile),
					marketCap: formatMarketCap(profile.marketCapitalization),
					dayRange: `$${quote.l.toFixed(2)} - $${quote.h.toFixed(2)}`,
					week52Range: 'N/A', // Would need additional API call for 52-week data
					peRatio: 'N/A', // Would need additional API call for P/E ratio
					eps: 'N/A', // Would need additional API call for EPS
					weburl: profile.weburl || '',
					sector: 'N/A', // Would need additional API call
					industry: profile.finnhubIndustry || 'N/A'
				};

				return stockData;
			} catch (error) {
				console.error(`Error fetching data for ${symbol}:`, error);
				return null;
			}
		});

		const results = await Promise.all(stockPromises);
		const validResults = results.filter(result => result !== null) as StockData[];

		// Cache the results
		stockCache.set('stocks', {
			data: validResults,
			timestamp: now
		});

		return new Response(JSON.stringify({ data: validResults }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error fetching stock data:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		const errorStack = error instanceof Error ? error.stack : 'No stack trace';
		
		console.error('Error details:', errorMessage);
		console.error('Error stack:', errorStack);
		
		return new Response(JSON.stringify({ 
			error: 'Failed to fetch stock data',
			details: errorMessage 
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

function calculateVolume(profile: FinnhubProfile): string {
	// Finnhub doesn't provide volume in the basic endpoints, so we'll estimate
	if (profile.shareOutstanding) {
		const volume = profile.shareOutstanding * 0.1; // Assume 10% of shares traded daily
		return formatVolume(volume);
	}
	return 'N/A';
}

function formatVolume(volume: number): string {
	if (volume >= 1000000) {
		return `${(volume / 1000000).toFixed(1)}M`;
	} else if (volume >= 1000) {
		return `${(volume / 1000).toFixed(1)}K`;
	}
	return volume.toString();
}

function formatMarketCap(marketCap: number): string {
	if (!marketCap || marketCap === 0) {
		return 'N/A';
	}
	
	console.log(`Raw market cap: ${marketCap}`);
	
	// Finnhub returns market cap in millions, so we need to convert
	const marketCapInBillions = marketCap / 1000;
	const marketCapInTrillions = marketCap / 1000000;
	
	console.log(`Market cap in billions: ${marketCapInBillions}`);
	console.log(`Market cap in trillions: ${marketCapInTrillions}`);
	
	// Convert to appropriate format
	if (marketCapInTrillions >= 1) {
		return `$${marketCapInTrillions.toFixed(2)}T`;
	} else if (marketCapInBillions >= 1) {
		return `$${marketCapInBillions.toFixed(2)}B`;
	} else if (marketCap >= 1) {
		return `$${marketCap.toFixed(2)}M`;
	} else {
		return `$${(marketCap * 1000).toFixed(2)}K`;
	}
}
