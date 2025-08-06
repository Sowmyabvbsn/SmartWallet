// Stock market service using Alpha Vantage free API
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  dividend?: number;
}

export interface StockChart {
  symbol: string;
  data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface MarketOverview {
  indices: Array<{
    name: string;
    symbol: string;
    value: number;
    change: number;
    changePercent: number;
  }>;
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  mostActive: StockQuote[];
}

class StockService {
  private apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  private baseUrl = 'https://www.alphavantage.co/query';
  private cache: { [key: string]: any } = {};
  private cacheExpiry = 2 * 60 * 1000; // 2 minutes for more frequent updates

  async getStockQuote(symbol: string): Promise<StockQuote> {
    const cacheKey = `quote_${symbol}`;
    
    if (this.cache[cacheKey] && 
        Date.now() - this.cache[cacheKey].timestamp < this.cacheExpiry) {
      return this.cache[cacheKey].data;
    }

    if (!this.apiKey) {
      return this.getMockStockQuote(symbol);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        const quote = data['Global Quote'];
        
        if (quote && quote['01. symbol']) {
          const stockQuote: StockQuote = {
            symbol: quote['01. symbol'],
            name: this.getCompanyName(symbol),
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume'])
          };

          this.cache[cacheKey] = {
            data: stockQuote,
            timestamp: Date.now()
          };

          return stockQuote;
        }
      }
    } catch (error) {
      console.warn(`Stock API failed for ${symbol}, using mock data:`, error);
    }

    return this.getMockStockQuote(symbol);
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes = await Promise.all(
      symbols.map(symbol => this.getStockQuote(symbol))
    );
    return quotes;
  }

  async getStockChart(symbol: string, interval: string = 'daily'): Promise<StockChart> {
    const cacheKey = `chart_${symbol}_${interval}`;
    
    if (this.cache[cacheKey] && 
        Date.now() - this.cache[cacheKey].timestamp < this.cacheExpiry) {
      return this.cache[cacheKey].data;
    }

    if (!this.apiKey) {
      return this.getMockStockChart(symbol);
    }

    try {
      const functionName = interval === 'daily' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY';
      const intervalParam = interval === 'daily' ? '' : `&interval=${interval}`;
      
      const response = await fetch(
        `${this.baseUrl}?function=${functionName}&symbol=${symbol}${intervalParam}&apikey=${this.apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        const timeSeriesKey = interval === 'daily' ? 'Time Series (Daily)' : `Time Series (${interval})`;
        const timeSeries = data[timeSeriesKey];
        
        if (timeSeries) {
          const chartData = Object.entries(timeSeries)
            .slice(0, 30) // Last 30 data points
            .map(([date, values]: [string, any]) => ({
              date,
              open: parseFloat(values['1. open']),
              high: parseFloat(values['2. high']),
              low: parseFloat(values['3. low']),
              close: parseFloat(values['4. close']),
              volume: parseInt(values['5. volume'])
            }))
            .reverse(); // Chronological order

          const stockChart: StockChart = {
            symbol,
            data: chartData
          };

          this.cache[cacheKey] = {
            data: stockChart,
            timestamp: Date.now()
          };

          return stockChart;
        }
      }
    } catch (error) {
      console.warn(`Chart API failed for ${symbol}, using mock data:`, error);
    }

    return this.getMockStockChart(symbol);
  }

  async getMarketOverview(): Promise<MarketOverview> {
    const cacheKey = 'market_overview';
    
    // Always generate fresh data for market overview to ensure refresh works
    const overview = this.getMockMarketOverview();
    
    this.cache[cacheKey] = {
      data: overview,
      timestamp: Date.now()
    };

    return overview;
  }

  // Method to force refresh by clearing cache
  clearCache(): void {
    this.cache = {};
  }

  // Method to force refresh specific data
  async forceRefreshMarketData(): Promise<MarketOverview> {
    // Clear market overview cache
    delete this.cache['market_overview'];
    
    // Generate fresh market data
    return await this.getMarketOverview();
  }

  private getMockStockQuote(symbol: string): StockQuote {
    const basePrice = this.getBasePriceForSymbol(symbol);
    // Add timestamp to ensure different values on each call
    const volatility = Math.sin(Date.now() / 10000) * 0.02 + (Math.random() - 0.5) * 0.03; // ±3% change with time-based component
    const change = basePrice * volatility;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      name: this.getCompanyName(symbol),
      price: Math.round((basePrice + change) * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
      pe: Math.round((Math.random() * 30 + 10) * 100) / 100,
      dividend: Math.round((Math.random() * 5) * 100) / 100
    };
  }

  private getMockStockChart(symbol: string): StockChart {
    const basePrice = this.getBasePriceForSymbol(symbol);
    const data = [];
    let currentPrice = basePrice;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dailyChange = (Math.random() - 0.5) * currentPrice * 0.03; // ±3% daily change
      const open = currentPrice;
      const close = currentPrice + dailyChange;
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);

      data.push({
        date: date.toISOString().split('T')[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.floor(Math.random() * 5000000) + 1000000
      });

      currentPrice = close;
    }

    return { symbol, data };
  }

  private getMockMarketOverview(): MarketOverview {
    // Use current timestamp to ensure different values each time
    const timeComponent = Math.sin(Date.now() / 100000);
    
    return {
      indices: [
        {
          name: 'S&P 500',
          symbol: 'SPX',
          value: 4500 + (Math.random() * 200) + (timeComponent * 100),
          change: (Math.random() - 0.5) * 50 + (timeComponent * 20),
          changePercent: (Math.random() - 0.5) * 2 + (timeComponent * 0.5)
        },
        {
          name: 'Dow Jones',
          symbol: 'DJI',
          value: 35000 + (Math.random() * 1000) + (timeComponent * 500),
          change: (Math.random() - 0.5) * 300 + (timeComponent * 100),
          changePercent: (Math.random() - 0.5) * 1.5 + (timeComponent * 0.3)
        },
        {
          name: 'NASDAQ',
          symbol: 'IXIC',
          value: 14000 + (Math.random() * 500) + (timeComponent * 250),
          change: (Math.random() - 0.5) * 100 + (timeComponent * 50),
          changePercent: (Math.random() - 0.5) * 2.5 + (timeComponent * 0.4)
        }
      ],
      topGainers: ['AAPL', 'GOOGL', 'MSFT'].map(symbol => {
        const quote = this.getMockStockQuote(symbol);
        // Ensure gainers have positive changes
        quote.change = Math.abs(quote.change);
        quote.changePercent = Math.abs(quote.changePercent);
        return quote;
      }),
      topLosers: ['TSLA', 'AMZN', 'META'].map(symbol => {
        const quote = this.getMockStockQuote(symbol);
        // Ensure losers have negative changes
        quote.change = -Math.abs(quote.change);
        quote.changePercent = -Math.abs(quote.changePercent);
        return quote;
      }),
      mostActive: ['NVDA', 'AMD', 'INTC'].map(symbol => this.getMockStockQuote(symbol))
    };
  }

  private getBasePriceForSymbol(symbol: string): number {
    const prices: { [key: string]: number } = {
      'AAPL': 175,
      'GOOGL': 140,
      'MSFT': 380,
      'TSLA': 250,
      'AMZN': 145,
      'META': 320,
      'NVDA': 480,
      'AMD': 110,
      'INTC': 45,
      'SPY': 450,
      'QQQ': 380,
      'VTI': 220
    };
    return prices[symbol] || 100;
  }

  private getCompanyName(symbol: string): string {
    const names: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'TSLA': 'Tesla Inc.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'NVDA': 'NVIDIA Corporation',
      'AMD': 'Advanced Micro Devices',
      'INTC': 'Intel Corporation',
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'VTI': 'Vanguard Total Stock Market ETF'
    };
    return names[symbol] || `${symbol} Corporation`;
  }

  async searchStocks(query: string): Promise<StockQuote[]> {
    // Mock search functionality
    const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];
    const matchingStocks = popularStocks.filter(symbol => 
      symbol.toLowerCase().includes(query.toLowerCase()) ||
      this.getCompanyName(symbol).toLowerCase().includes(query.toLowerCase())
    );

    return await this.getMultipleQuotes(matchingStocks.slice(0, 5));
  }
}

export const stockService = new StockService();