export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  dividendYield?: number;
}

export interface Portfolio {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  investments: Investment[];
  assetAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    crypto: number;
  };
}

class InvestmentService {
  async getPortfolio(userId: string): Promise<Portfolio> {
    // Mock portfolio data - in production, integrate with brokerage APIs
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInvestments: Investment[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 10,
        currentPrice: 175.50,
        purchasePrice: 150.00,
        purchaseDate: '2023-06-15',
        currentValue: 1755.00,
        gainLoss: 255.00,
        gainLossPercentage: 17.0,
        dividendYield: 0.5
      },
      {
        id: '2',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        shares: 5,
        currentPrice: 140.25,
        purchasePrice: 120.00,
        purchaseDate: '2023-08-20',
        currentValue: 701.25,
        gainLoss: 101.25,
        gainLossPercentage: 16.9
      },
      {
        id: '3',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        shares: 8,
        currentPrice: 245.80,
        purchasePrice: 280.00,
        purchaseDate: '2023-09-10',
        currentValue: 1966.40,
        gainLoss: -273.60,
        gainLossPercentage: -12.2
      },
      {
        id: '4',
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        shares: 25,
        currentPrice: 220.15,
        purchasePrice: 200.00,
        purchaseDate: '2023-07-01',
        currentValue: 5503.75,
        gainLoss: 503.75,
        gainLossPercentage: 10.1,
        dividendYield: 1.8
      }
    ];

    const totalValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalGainLoss = mockInvestments.reduce((sum, inv) => sum + inv.gainLoss, 0);
    const totalGainLossPercentage = (totalGainLoss / (totalValue - totalGainLoss)) * 100;

    return {
      totalValue,
      totalGainLoss,
      totalGainLossPercentage,
      investments: mockInvestments,
      assetAllocation: {
        stocks: 75,
        bonds: 15,
        cash: 8,
        crypto: 2
      }
    };
  }

  async getMarketData(symbols: string[]): Promise<any[]> {
    // Mock market data - in production, integrate with financial data APIs
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return symbols.map(symbol => ({
      symbol,
      price: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5
    }));
  }

  async getInvestmentInsights(portfolio: Portfolio): Promise<any> {
    // Generate AI-powered investment insights
    return {
      riskScore: 65,
      diversificationScore: 78,
      recommendations: [
        'Consider rebalancing your portfolio to reduce Tesla exposure',
        'Your tech allocation is high - consider adding some defensive stocks',
        'Great job with the VTI ETF for broad market exposure'
      ],
      nextActions: [
        'Review quarterly earnings for AAPL',
        'Consider tax-loss harvesting with TSLA',
        'Increase bond allocation for better risk management'
      ]
    };
  }
}

export const investmentService = new InvestmentService();