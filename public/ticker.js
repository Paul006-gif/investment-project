class BinanceWebSocket {
	constructor() {
		this.ws = null;
		this.tickers = new Map();
		this.callbacks = [];
		this.reconnectAttempts = 0;
		this.maxReconnectAttempts = 3;
		this.reconnectDelay = 2000;
		this.pollInterval = null;
		this.pollDelay = 5000; // Poll every 5 seconds as fallback
		this.useFallback = false;
	}

	connect() {
		try {
			console.log('[Ticker WS] Attempting to connect to Binance WebSocket...');
			console.log('[Ticker WS] Browser support check - WebSocket:', typeof WebSocket !== 'undefined');
			
			// Connect to Binance WebSocket for all ticker symbols
			this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
			
			// Set a timeout to fallback if connection takes too long
			const connectionTimeout = setTimeout(() => {
				if (this.ws && this.ws.readyState !== 1) {
					console.warn('[Ticker WS] Connection timeout - switching to fallback');
					this.ws.close();
					this.useFallback = true;
					this.startFallbackPolling();
				}
			}, 5000);
			
			this.ws.onopen = () => {
				clearTimeout(connectionTimeout);
				console.log('[Ticker WS] Successfully connected to Binance WebSocket');
				this.reconnectAttempts = 0;
			};

			this.ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					this.updateTickers(data);
				} catch (parseError) {
					console.error('[Ticker WS] Failed to parse message:', parseError);
				}
			};

			this.ws.onclose = () => {
				clearTimeout(connectionTimeout);
				console.log('[Ticker WS] Disconnected from Binance WebSocket');
				this.handleReconnect();
			};

			this.ws.onerror = (error) => {
				clearTimeout(connectionTimeout);
				console.error('[Ticker WS] WebSocket connection error');
				console.error('[Ticker WS] Error details:', error);
				if (this.ws) {
					console.error('[Ticker WS] ReadyState:', this.ws.readyState, '(0=connecting, 1=open, 2=closing, 3=closed)');
				}
			};
		} catch (error) {
			console.error('[Ticker WS] Failed to create WebSocket:', error);
			this.handleReconnect();
		}
	}

	updateTickers(data) {
		data.forEach(ticker => {
			this.tickers.set(ticker.s, {
				symbol: ticker.s,
				price: parseFloat(ticker.c).toFixed(4),
				change: parseFloat(ticker.P).toFixed(2),
				volume: parseFloat(ticker.v).toFixed(0),
				high: parseFloat(ticker.h).toFixed(4),
				low: parseFloat(ticker.l).toFixed(4)
			});
		});
		
		this.callbacks.forEach(callback => callback(this.tickers));
	}

	handleReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			console.log(`[Ticker WS] Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
			
			setTimeout(() => {
				this.connect();
			}, this.reconnectDelay * this.reconnectAttempts);
		} else {
			console.error('[Ticker WS] Max reconnection attempts reached. Switching to fallback polling...');
			this.useFallback = true;
			this.startFallbackPolling();
		}
	}

	async startFallbackPolling() {
		console.log('[Ticker WS] Starting fallback API polling via /api/crypto...');
		const pollData = async () => {
			try {
				const response = await fetch('/api/crypto');
				console.log('[Ticker WS Fallback] API response status:', response.status);
				const result = await response.json();
				console.log('[Ticker WS Fallback] API response:', result);
				
				if (result.data && Array.isArray(result.data) && result.data.length > 0) {
					result.data.forEach(data => {
						if (data && data.symbol) {
							this.tickers.set(data.symbol, {
								symbol: data.symbol,
								price: data.price,
								change: data.change,
								volume: data.volume,
								high: data.high,
								low: data.low
							});
						}
					});
					
					console.log('[Ticker WS Fallback] Updated', this.tickers.size, 'tickers');
					this.callbacks.forEach(callback => callback(this.tickers));
				} else {
					console.warn('[Ticker WS Fallback] No data in response:', result);
				}
			} catch (error) {
				console.error('[Ticker WS Fallback] Polling error:', error);
			}
		};
		
		// Initial poll
		await pollData();
		
		// Set up periodic polling (every 2 minutes to respect API cache)
		this.pollInterval = setInterval(pollData, 120000);
	}

	stopPolling() {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
			this.pollInterval = null;
		}
	}

	subscribe(callback) {
		this.callbacks.push(callback);
	}

	unsubscribe(callback) {
		this.callbacks = this.callbacks.filter(cb => cb !== callback);
	}

	getTickers() {
		return this.tickers;
	}

	getPopularTickers() {
		const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'MATICUSDT'];
		return popularSymbols.map(symbol => this.tickers.get(symbol)).filter(Boolean);
	}

	disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.stopPolling();
	}
}

class TickerManager {
	constructor() {
		this.binanceWs = new BinanceWebSocket();
		this.container = document.getElementById('ticker-container');
		this.scrollWrapper = null;
		this.scrollPosition = 0;
		this.scrollSpeed = 0.6; // tuned speed for readability
		this.isScrolling = true;
		this.animationId = null;
		this.lastUpdateTime = 0;
		this.updateThrottle = 1500; // throttle updates to avoid jitter
		this.popularSymbols = [
			'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT',
			'DOGEUSDT', 'MATICUSDT', 'DOTUSDT', 'LINKUSDT', 'AVAXUSDT', 'UNIUSDT',
			'LTCUSDT', 'ATOMUSDT', 'FILUSDT', 'TRXUSDT', 'XLMUSDT', 'VETUSDT',
			'ETCUSDT', 'THETAUSDT', 'ICXUSDT', 'HBARUSDT', 'EOSUSDT', 'XTZUSDT'
		];
		this.renderTickerStrip(this.getPlaceholderTickers(), false);
		this.init();
	}

	init() {
		console.log('[TickerManager] Initializing...');
		if (!this.container) {
			console.warn('[TickerManager] ticker-container element not found');
			return;
		}
		
		console.log('[TickerManager] Starting Binance WebSocket connection...');
		this.binanceWs.connect();
		
		this.binanceWs.subscribe((tickers) => {
			console.log('[TickerManager] Received ticker data with', tickers.size, 'symbols');
			const now = Date.now();
			if (now - this.lastUpdateTime > this.updateThrottle) {
				this.updateDisplay(tickers);
				this.lastUpdateTime = now;
			}
		});
		
		// Start auto-scroll after a short delay to ensure DOM is ready
		setTimeout(() => {
			this.startAutoScroll();
		}, 500);
	}

	startAutoScroll() {
		if (!this.scrollWrapper) return;
		
		const scroll = () => {
			if (!this.isScrolling) {
				this.animationId = requestAnimationFrame(scroll);
				return;
			}

			this.scrollPosition += this.scrollSpeed;
			
			// Reset when we've scrolled half the width (for seamless loop)
			const halfWidth = this.scrollWrapper.scrollWidth / 2;
			if (this.scrollPosition >= halfWidth) {
				this.scrollPosition = 0;
			}
			
			this.scrollWrapper.scrollLeft = this.scrollPosition;
			this.animationId = requestAnimationFrame(scroll);
		};
		
		this.animationId = requestAnimationFrame(scroll);
	}

	stopAutoScroll() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}

	updateDisplay(tickers) {
		const displayTickers = this.popularSymbols.map((symbol) => {
			const data = tickers.get(symbol);
			if (!data) {
				return {
					symbol,
					price: '--',
					change: '--'
				};
			}
			return {
				symbol: data.symbol,
				price: data.price,
				change: data.change
			};
		});

		this.renderTickerStrip(displayTickers, true);
	}

	renderTickerStrip(tickers, resumeScrolling = true) {
		if (!this.container) {
			console.warn('[TickerManager] Container not available for rendering');
			return;
		}

		console.log('[TickerManager] Rendering', tickers.length, 'tickers');

		// Preserve current scroll state
		const currentScrollPosition = this.scrollWrapper ? this.scrollWrapper.scrollLeft : 0;
		const wasScrolling = this.isScrolling;

		const tickerHTML = tickers.map((ticker) => {
			const isPlaceholder = ticker.price === '--';
			const changeColor = isPlaceholder
				? '#94a3b8'
				: (parseFloat(ticker.change) >= 0 ? '#10b981' : '#ef4444');

			return `
				<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; min-width: 280px; transition: all 0.3s ease; cursor: pointer; white-space: normal; display: flex; align-items: center; gap: 16px;">
					<div style="width: 32px; height: 32px; border-radius: 50%; background: #64748b; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">
						${ticker.symbol.charAt(0)}
					</div>
					<div style="flex: 1;">
						<div style="font-size: 0.875rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">${ticker.symbol}</div>
						<div style="display: flex; align-items: baseline; gap: 8px;">
							<div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${ticker.price === '--' ? '--' : `$${ticker.price}`}</div>
							<div style="font-size: 0.875rem; font-weight: 600; color: ${changeColor};">
								${isPlaceholder ? '--' : `${parseFloat(ticker.change) >= 0 ? '+' : ''}${ticker.change}%`}
							</div>
						</div>
					</div>
				</div>
			`;
		}).join('');

		const duplicatedHTML = tickerHTML.repeat(3);

		this.container.innerHTML = `
			<div style="width: 100%; overflow: hidden; padding: 40px 0;">
				<div class="ticker-scroll-wrapper" style="width: 100%; overflow: hidden; padding: 20px 0;">
					<div class="ticker-grid" style="display: flex; gap: 20px; width: max-content; padding: 0 5vw; box-sizing: border-box;">
						${duplicatedHTML}
					</div>
				</div>
			</div>
		`;

		// Re-initialize scroll wrapper and restore scroll position
		this.scrollWrapper = this.container.querySelector('.ticker-scroll-wrapper');
		if (this.scrollWrapper) {
			setTimeout(() => {
				this.scrollWrapper.scrollLeft = currentScrollPosition;
				this.scrollPosition = currentScrollPosition;
			}, 30);

			this.scrollWrapper.addEventListener('mouseenter', () => {
				this.isScrolling = false;
			});

			this.scrollWrapper.addEventListener('mouseleave', () => {
				this.isScrolling = true;
			});

			if (resumeScrolling) {
				if (!this.animationId) {
					this.startAutoScroll();
				} else if (!wasScrolling) {
					this.isScrolling = false;
				}
			}
		}
	}

	getPlaceholderTickers() {
		return this.popularSymbols.map((symbol) => ({
			symbol,
			price: '--',
			change: '--'
		}));
	}

	getCoinId(symbol) {
		const coinMap = {
			'BTCUSDT': 'bitcoin',
			'ETHUSDT': 'ethereum',
			'BNBUSDT': 'binancecoin',
			'ADAUSDT': 'cardano',
			'SOLUSDT': 'solana',
			'XRPUSDT': 'ripple',
			'DOGEUSDT': 'dogecoin',
			'MATICUSDT': 'polygon',
			'DOTUSDT': 'polkadot',
			'LINKUSDT': 'chainlink',
			'AVAXUSDT': 'avalanche-2',
			'UNIUSDT': 'uniswap',
			'LTCUSDT': 'litecoin',
			'ATOMUSDT': 'cosmos',
			'FILUSDT': 'filecoin',
			'TRXUSDT': 'tron',
			'XLMUSDT': 'stellar',
			'VETUSDT': 'vechain',
			'ETCUSDT': 'ethereum-classic',
			'THETAUSDT': 'theta-token',
			'ICXUSDT': 'icon',
			'HBARUSDT': 'hedera-hashgraph',
			'EOSUSDT': 'eos',
			'XTZUSDT': 'tezos'
		};
		return coinMap[symbol] || symbol.toLowerCase().replace('usdt', '');
	}

	formatVolume(volume) {
		const num = parseFloat(volume);
		if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
		if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
		if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
		return num.toFixed(0);
	}
}

// Initialize when DOM is ready
function initTicker() {
	console.log('[ticker.js] DOM ready, checking for ticker-container...');
	const container = document.getElementById('ticker-container');
	if (container) {
		console.log('[ticker.js] ticker-container found, initializing TickerManager');
		new TickerManager();
	} else {
		console.warn('[ticker.js] ticker-container element not found in DOM');
	}
}

console.log('[ticker.js] Script loaded, readyState:', document.readyState);
if (document.readyState === 'loading') {
	console.log('[ticker.js] DOM still loading, adding DOMContentLoaded listener');
	document.addEventListener('DOMContentLoaded', initTicker);
} else {
	console.log('[ticker.js] DOM already ready, initializing immediately');
	initTicker();
}
