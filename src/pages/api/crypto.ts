import type { APIRoute } from 'astro';

interface CryptoData {
	symbol: string;
	price: string;
	change: string;
	volume: string;
	high: string;
	low: string;
}

// Simple in-memory cache
const cryptoCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

export const GET: APIRoute = async ({ request }) => {
	console.log('[Crypto API] Request received');
	
	// Check cache first
	const now = Date.now();
	const cachedData = cryptoCache.get('crypto');
	if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
		console.log('[Crypto API] Returning cached data');
		return new Response(JSON.stringify({ data: cachedData.data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'ripple', 'dogecoin', 'matic-network'];
	
	try {
		console.log('[Crypto API] Fetching data from CoinGecko for:', cryptoIds.join(','));
		
		// Fetch ticker data from CoinGecko (free, no auth required)
		const response = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_high_low_24h=true`,
			{
				signal: AbortSignal.timeout(10000) // 10 second timeout
			}
		);

		if (!response.ok) {
			throw new Error(`CoinGecko API error! status: ${response.status}`);
		}

		const coinData = await response.json();
		console.log('[Crypto API] CoinGecko response keys:', Object.keys(coinData));

		// Map CoinGecko data to our format
		const symbolMap: Record<string, string> = {
			'bitcoin': 'BTCUSDT',
			'ethereum': 'ETHUSDT',
			'binancecoin': 'BNBUSDT',
			'cardano': 'ADAUSDT',
			'solana': 'SOLUSDT',
			'ripple': 'XRPUSDT',
			'dogecoin': 'DOGEUSDT',
			'matic-network': 'MATICUSDT'
		};

		const results: CryptoData[] = [];
		
		for (const [cryptoId, symbol] of Object.entries(symbolMap)) {
			const data = coinData[cryptoId];
			console.log(`[Crypto API] Processing ${cryptoId}:`, data ? 'found' : 'missing', data?.usd ? `($${data.usd})` : '');
			if (data && data.usd) {
				const result = {
					symbol: symbol,
					price: data.usd.toFixed(2),
					change: data.usd_24h_change?.toFixed(2) || '0.00',
					volume: formatVolume(data.usd_24h_vol || 0),
					high: data.usd_24h_high?.toFixed(2) || '0.00',
					low: data.usd_24h_low?.toFixed(2) || '0.00'
				};
				console.log(`[Crypto API] Added ${symbol}:`, result);
				results.push(result);
			}
		}

		console.log('[Crypto API] Successfully fetched', results.length, 'cryptocurrencies');
		console.log('[Crypto API] Results to send:', results);

		// Cache the results
		cryptoCache.set('crypto', {
			data: results,
			timestamp: now
		});

		return new Response(JSON.stringify({ data: results }), {
			status: 200,
			headers: { 
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=120'
			}
		});

	} catch (error) {
		console.error('[Crypto API] Error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		
		// Return cached data if available, even if expired
		const expiredCache = cryptoCache.get('crypto');
		if (expiredCache) {
			console.log('[Crypto API] Returning expired cached data as fallback');
			return new Response(JSON.stringify({ data: expiredCache.data }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		console.log('[Crypto API] Using mock data as fallback');
		// Return mock data as last resort
		const mockData = getMockCryptoData();

		cryptoCache.set('crypto', {
			data: mockData,
			timestamp: now
		});

		return new Response(JSON.stringify({ 
			data: mockData,
			note: 'Using mock data - API unavailable'
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

function getMockCryptoData(): CryptoData[] {
	return [
		{ symbol: 'BTCUSDT', price: '42500.00', change: '2.45', volume: '28.5B', high: '43200.00', low: '41800.00' },
		{ symbol: 'ETHUSDT', price: '2280.50', change: '3.12', volume: '15.2B', high: '2350.00', low: '2200.00' },
		{ symbol: 'BNBUSDT', price: '612.30', change: '1.85', volume: '1.8B', high: '625.00', low: '600.00' },
		{ symbol: 'ADAUSDT', price: '0.9850', change: '-0.50', volume: '850M', high: '1.05', low: '0.95' },
		{ symbol: 'SOLUSDT', price: '138.75', change: '4.20', volume: '2.1B', high: '142.00', low: '133.00' },
		{ symbol: 'XRPUSDT', price: '2.15', change: '1.30', volume: '1.5B', high: '2.25', low: '2.05' },
		{ symbol: 'DOGEUSDT', price: '0.3850', change: '2.10', volume: '500M', high: '0.41', low: '0.37' },
		{ symbol: 'MATICUSDT', price: '0.9425', change: '-1.20', volume: '650M', high: '0.98', low: '0.92' }
	];
}

function formatVolume(volume: number): string {
	if (volume >= 1000000000) {
		return `${(volume / 1000000000).toFixed(1)}B`;
	} else if (volume >= 1000000) {
		return `${(volume / 1000000).toFixed(1)}M`;
	} else if (volume >= 1000) {
		return `${(volume / 1000).toFixed(1)}K`;
	}
	return volume.toFixed(0);
}
