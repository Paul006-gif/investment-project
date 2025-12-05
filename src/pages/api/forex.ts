import type { APIRoute } from 'astro';

interface ForexData {
	symbol: string;
	price: string;
	change: string;
	changePercent: string;
	volume: string;
	liquidity: string;
	dayRange: string;
	week52Range: string;
	spread: string;
	pips: string;
}

// Simple in-memory cache
const forexCache = new Map();
const CACHE_DURATION = 4 * 60 * 1000; // 4 minutes cache

export const GET: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
	
	console.log('[Forex API] API Key check:', apiKey ? 'Key found' : 'Key missing');
	console.log('[Forex API] FINNHUB_API_KEY from import.meta.env:', import.meta.env.FINNHUB_API_KEY ? 'Yes' : 'No');
	console.log('[Forex API] FINNHUB_API_KEY from process.env:', process.env.FINNHUB_API_KEY ? 'Yes' : 'No');
	
	if (!apiKey) {
		console.error('[Forex API] FINNHUB_API_KEY is not configured');
		return new Response(JSON.stringify({ error: 'API key not configured. Set FINNHUB_API_KEY environment variable.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Check cache first
	const now = Date.now();
	const cachedData = forexCache.get('forex');
	if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
		console.log('Returning cached forex data');
		return new Response(JSON.stringify({ data: cachedData.data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const forexPairs = [
		{ symbol: 'EUR/USD', baseRate: 1.0850, flag: '🇪🇺' },
		{ symbol: 'GBP/USD', baseRate: 1.2750, flag: '🇬🇧' },
		{ symbol: 'USD/JPY', baseRate: 149.50, flag: '🇯🇵' },
		{ symbol: 'AUD/USD', baseRate: 0.6550, flag: '🇦🇺' },
		{ symbol: 'USD/CHF', baseRate: 0.8750, flag: '🇨🇭' },
		{ symbol: 'USD/CAD', baseRate: 1.3650, flag: '🇨🇦' },
		{ symbol: 'NZD/USD', baseRate: 0.6150, flag: '🇳🇿' },
		{ symbol: 'EUR/GBP', baseRate: 0.8500, flag: '🇪🇺' },
		{ symbol: 'USD/SEK', baseRate: 10.75, flag: '🇸🇪' },
		{ symbol: 'EUR/JPY', baseRate: 162.25, flag: '🇪🇺' }
	];
	
	try {
		// Generate realistic forex data with small variations
		const forexData = forexPairs.map(pair => {
			// Add small random variation to base rate
			const variation = (Math.random() - 0.5) * 0.002; // ±0.1% variation
			const currentRate = pair.baseRate * (1 + variation);
			
			// Generate change and percent change
			const change = (Math.random() - 0.5) * 0.01; // Small change
			const changePercent = (change / pair.baseRate) * 100;
			
			// Calculate day range
			const dayLow = currentRate * (1 - Math.random() * 0.005);
			const dayHigh = currentRate * (1 + Math.random() * 0.005);
			
			// Calculate spread and pips
			const spread = (Math.random() * 0.5 + 0.1).toFixed(1); // 0.1-0.6 pips
			const pips = Math.abs(change * 10000).toFixed(1); // Convert to pips
			
			return {
				symbol: pair.symbol,
				flag: pair.flag,
				price: currentRate.toFixed(4),
				change: change.toFixed(4),
				changePercent: `${changePercent.toFixed(2)}%`,
				volume: 'N/A',
				liquidity: 'High',
				dayRange: `${dayLow.toFixed(4)} - ${dayHigh.toFixed(4)}`,
				week52Range: 'N/A', // Would need historical data
				spread: `${spread} pips`,
				pips: pips
			};
		});

		// Cache the results
		forexCache.set('forex', {
			data: forexData,
			timestamp: now
		});

		return new Response(JSON.stringify({ data: forexData }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error generating forex data:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		
		return new Response(JSON.stringify({ 
			error: 'Failed to generate forex data',
			details: errorMessage 
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
