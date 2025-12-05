class BinanceWebSocket {
  constructor() {
    this.ws = null;
    this.tickers = new Map();
    this.callbacks = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    try {
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      this.ws.onopen = () => {
        console.log('Connected to Binance WebSocket');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.updateTickers(data);
      };

      this.ws.onclose = () => {
        console.log('Disconnected from Binance WebSocket');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to Binance WebSocket:', error);
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
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
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
  }
}

export default BinanceWebSocket;
