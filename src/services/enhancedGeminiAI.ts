import { GoogleGenerativeAI } from '@google/generative-ai';
import { weatherService } from './weatherService';
import { newsService } from './newsService';
import { stockService } from './stockService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will use enhanced mock responses.');
}

class EnhancedGeminiAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    }
  }

  async analyzeSpendingPatterns(transactions: any[], contextData?: any): Promise<any> {
    if (!this.model) {
      return this.getEnhancedMockSpendingAnalysis(contextData);
    }

    try {
      // Get additional context data
      const weather = contextData?.weather || await weatherService.getCurrentWeather();
      const marketSentiment = contextData?.marketSentiment || await newsService.getMarketSentiment();
      
      const prompt = `
        Analyze the following financial transactions with additional context:
        
        Transactions: ${JSON.stringify(transactions, null, 2)}
        
        Current Weather: ${JSON.stringify(weather, null, 2)}
        Market Sentiment: ${JSON.stringify(marketSentiment, null, 2)}
        
        Please provide enhanced insights considering:
        1. Spending patterns and trends
        2. Weather impact on spending behavior
        3. Market conditions influence on financial decisions
        4. Budget recommendations with seasonal adjustments
        5. Areas for potential savings
        6. Financial health score (1-100)
        7. Personalized advice based on external factors
        
        Format the response as JSON with the following structure:
        {
          "financialScore": number,
          "insights": [{"type": "warning|success|info", "title": string, "message": string, "category": string}],
          "recommendations": [{"action": string, "impact": string, "priority": "high|medium|low"}],
          "spendingTrends": [{"category": string, "trend": "up|down|stable", "percentage": number, "reason": string}],
          "weatherImpact": {"category": string, "recommendation": string, "potentialSavings": number},
          "marketImpact": {"sentiment": string, "recommendation": string, "investmentAdvice": string}
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getEnhancedMockSpendingAnalysis(contextData);
      }
    } catch (error) {
      console.error('Enhanced Gemini AI analysis failed:', error);
      return this.getEnhancedMockSpendingAnalysis(contextData);
    }
  }

  async processReceiptText(ocrText: string): Promise<any> {
    if (!this.model) {
      return this.getEnhancedMockReceiptData();
    }

    try {
      const prompt = `
        Extract structured data from this receipt text with enhanced categorization:
        "${ocrText}"
        
        Return JSON with this structure:
        {
          "merchant": string,
          "date": "YYYY-MM-DD",
          "total": number (in cents),
          "tax": number (in cents),
          "subtotal": number (in cents),
          "items": [{"name": string, "price": number (in cents), "category": string, "subcategory": string}],
          "paymentMethod": string,
          "confidence": number (1-100),
          "merchantCategory": string,
          "location": {"address": string, "city": string, "state": string},
          "environmentalImpact": {"carbonFootprint": number, "sustainabilityScore": number},
          "nutritionalInfo": [{"item": string, "calories": number, "healthScore": number}] // if food items
        }
        
        Enhanced categories: Groceries, Electronics, Clothing, Healthcare, Entertainment, Transportation, Utilities, Restaurants, Personal Care, Home & Garden, Education, Travel, Other
        
        Subcategories should be specific (e.g., "Organic Produce", "Fast Food", "Gas Station", "Pharmacy")
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getEnhancedMockReceiptData();
      }
    } catch (error) {
      console.error('Enhanced Gemini AI receipt processing failed:', error);
      return this.getEnhancedMockReceiptData();
    }
  }

  async answerFinancialQuery(query: string, userContext: any): Promise<string> {
    if (!this.model) {
      return this.getEnhancedMockResponse(query, userContext);
    }

    try {
      // Get real-time context
      const [weather, marketSentiment, financialNews] = await Promise.all([
        weatherService.getCurrentWeather(),
        newsService.getMarketSentiment(),
        newsService.getFinancialNews('business')
      ]);

      const prompt = `
        You are an advanced AI financial advisor with access to real-time data. Answer this question:
        
        Question: "${query}"
        
        User Context: ${JSON.stringify(userContext, null, 2)}
        
        Real-time Context:
        - Weather: ${JSON.stringify(weather, null, 2)}
        - Market Sentiment: ${JSON.stringify(marketSentiment, null, 2)}
        - Recent Financial News: ${JSON.stringify(financialNews.articles.slice(0, 3), null, 2)}
        
        Provide a comprehensive, personalized response that:
        1. Addresses the specific question
        2. Considers current market conditions
        3. Factors in weather/seasonal impacts if relevant
        4. Provides actionable advice
        5. References current events when appropriate
        6. Maintains a conversational, helpful tone
        
        Keep the response under 300 words but make it informative and valuable.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Enhanced Gemini AI query failed:', error);
      return this.getEnhancedMockResponse(query, userContext);
    }
  }

  async generateBudgetRecommendations(income: number, expenses: any[], contextData?: any): Promise<any> {
    if (!this.model) {
      return this.getEnhancedMockBudgetRecommendations(contextData);
    }

    try {
      const weather = contextData?.weather || await weatherService.getCurrentWeather();
      const marketConditions = contextData?.market || await stockService.getMarketOverview();
      
      const prompt = `
        Create enhanced budget recommendations based on:
        
        Monthly Income: $${income}
        Current Expenses: ${JSON.stringify(expenses, null, 2)}
        Weather Context: ${JSON.stringify(weather, null, 2)}
        Market Conditions: ${JSON.stringify(marketConditions, null, 2)}
        
        Provide comprehensive recommendations as JSON:
        {
          "recommendations": [{"category": string, "suggested": number, "current": number, "reasoning": string, "seasonalAdjustment": number}],
          "savingsGoal": number,
          "emergencyFund": number,
          "investmentAllocation": {"stocks": number, "bonds": number, "cash": number, "crypto": number},
          "seasonalBudgetTips": [string],
          "marketBasedAdvice": [string],
          "overallAdvice": string,
          "riskAssessment": {"level": "low|medium|high", "factors": [string]},
          "taxOptimization": [{"strategy": string, "potentialSavings": number}]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getEnhancedMockBudgetRecommendations(contextData);
      }
    } catch (error) {
      console.error('Enhanced Gemini AI budget recommendations failed:', error);
      return this.getEnhancedMockBudgetRecommendations(contextData);
    }
  }

  async analyzeInvestmentPortfolio(portfolio: any, marketData: any): Promise<any> {
    if (!this.model) {
      return this.getMockInvestmentAnalysis();
    }

    try {
      const prompt = `
        Analyze this investment portfolio with current market data:
        
        Portfolio: ${JSON.stringify(portfolio, null, 2)}
        Market Data: ${JSON.stringify(marketData, null, 2)}
        
        Provide analysis as JSON:
        {
          "riskScore": number (1-100),
          "diversificationScore": number (1-100),
          "performanceAnalysis": {"overall": string, "topPerformers": [string], "underperformers": [string]},
          "recommendations": [{"action": string, "reasoning": string, "priority": "high|medium|low"}],
          "marketTiming": {"buySignals": [string], "sellSignals": [string], "holdRecommendations": [string]},
          "riskManagement": [{"strategy": string, "implementation": string}],
          "taxImplications": [{"action": string, "taxImpact": string}],
          "rebalancingAdvice": {"frequency": string, "targetAllocations": object}
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getMockInvestmentAnalysis();
      }
    } catch (error) {
      console.error('Investment analysis failed:', error);
      return this.getMockInvestmentAnalysis();
    }
  }

  private getEnhancedMockSpendingAnalysis(contextData?: any) {
    return {
      financialScore: 82,
      insights: [
        {
          type: 'warning',
          title: 'Weather-Influenced Spending',
          message: 'Rainy weather has increased your transportation costs by 15% this week.',
          category: 'Transportation'
        },
        {
          type: 'success',
          title: 'Market-Savvy Savings',
          message: 'Your reduced discretionary spending aligns well with current market volatility.',
          category: 'Investment'
        },
        {
          type: 'info',
          title: 'Seasonal Adjustment Needed',
          message: 'Consider increasing your heating budget by 20% for the winter months.',
          category: 'Utilities'
        }
      ],
      recommendations: [
        {
          action: 'Set up weather-based spending alerts',
          impact: 'Could save $50-100/month on transportation',
          priority: 'medium'
        },
        {
          action: 'Increase emergency fund during market uncertainty',
          impact: 'Better financial security',
          priority: 'high'
        }
      ],
      spendingTrends: [
        { category: 'Food & Dining', trend: 'up', percentage: 12, reason: 'Cold weather increasing delivery orders' },
        { category: 'Transportation', trend: 'up', percentage: 15, reason: 'Weather-related ride-sharing usage' },
        { category: 'Entertainment', trend: 'down', percentage: -8, reason: 'Market uncertainty reducing discretionary spending' }
      ],
      weatherImpact: {
        category: 'Transportation',
        recommendation: 'Consider monthly transit pass during winter',
        potentialSavings: 75
      },
      marketImpact: {
        sentiment: 'cautious',
        recommendation: 'Maintain higher cash reserves during volatility',
        investmentAdvice: 'Focus on defensive stocks and bonds'
      }
    };
  }

  private getEnhancedMockReceiptData() {
    return {
      merchant: 'Whole Foods Market #1234',
      date: new Date().toISOString().split('T')[0],
      total: 8750,
      tax: 750,
      subtotal: 8000,
      items: [
        { name: 'Organic Avocados', price: 599, category: 'Groceries', subcategory: 'Organic Produce' },
        { name: 'Grass-Fed Beef', price: 1899, category: 'Groceries', subcategory: 'Organic Meat' },
        { name: 'Kombucha', price: 399, category: 'Groceries', subcategory: 'Health Drinks' },
        { name: 'Quinoa Salad', price: 1299, category: 'Groceries', subcategory: 'Prepared Foods' }
      ],
      paymentMethod: 'Credit Card ending in 4521',
      confidence: 94,
      merchantCategory: 'Organic Grocery Store',
      location: {
        address: '123 Health St',
        city: 'San Francisco',
        state: 'CA'
      },
      environmentalImpact: {
        carbonFootprint: 2.3,
        sustainabilityScore: 85
      },
      nutritionalInfo: [
        { item: 'Organic Avocados', calories: 160, healthScore: 92 },
        { item: 'Grass-Fed Beef', calories: 250, healthScore: 78 },
        { item: 'Kombucha', calories: 30, healthScore: 88 }
      ]
    };
  }

  private getEnhancedMockResponse(query: string, userContext: any): string {
    const responses = [
      `Based on current market conditions and your spending patterns, I'd recommend focusing on building your emergency fund to 6 months of expenses. The recent market volatility suggests maintaining higher cash reserves for now.`,
      
      `Looking at the weather forecast and your transportation spending, consider getting a monthly transit pass. With the rainy season approaching, this could save you $50-75 monthly on ride-sharing costs.`,
      
      `Given the current economic climate and your investment goals, I suggest a balanced approach: 60% stocks, 30% bonds, and 10% cash. This provides growth potential while managing risk during uncertain times.`,
      
      `Your coffee spending has increased 40% this month, likely due to colder weather. Consider investing in a good coffee maker - it could save you $100+ monthly while still enjoying quality coffee at home.`,
      
      `With inflation concerns and your current budget, focus on fixed-rate debt payments and consider I-bonds for inflation protection. Your emergency fund should be prioritized over aggressive investing right now.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getEnhancedMockBudgetRecommendations(contextData?: any) {
    return {
      recommendations: [
        {
          category: 'Food & Dining',
          suggested: 45000,
          current: 68000,
          reasoning: 'Reduce dining out frequency, especially during cold weather when delivery fees are higher',
          seasonalAdjustment: -5000
        },
        {
          category: 'Transportation',
          suggested: 35000,
          current: 42000,
          reasoning: 'Weather-adjusted budget for increased winter transportation costs',
          seasonalAdjustment: 8000
        }
      ],
      savingsGoal: 50000,
      emergencyFund: 120000,
      investmentAllocation: {
        stocks: 60,
        bonds: 30,
        cash: 8,
        crypto: 2
      },
      seasonalBudgetTips: [
        'Increase heating budget by 25% for winter months',
        'Plan for holiday spending starting in October',
        'Consider seasonal clothing budget adjustments'
      ],
      marketBasedAdvice: [
        'Maintain higher cash reserves during market volatility',
        'Consider defensive stock positions',
        'Review and rebalance portfolio quarterly'
      ],
      overallAdvice: 'Focus on building financial resilience through diversified savings and conservative investment strategies during uncertain market conditions.',
      riskAssessment: {
        level: 'medium',
        factors: ['Market volatility', 'Inflation concerns', 'Seasonal spending variations']
      },
      taxOptimization: [
        { strategy: 'Max out 401(k) contributions', potentialSavings: 12000 },
        { strategy: 'Tax-loss harvesting', potentialSavings: 3000 }
      ]
    };
  }

  private getMockInvestmentAnalysis() {
    return {
      riskScore: 72,
      diversificationScore: 68,
      performanceAnalysis: {
        overall: 'Portfolio showing moderate growth with some concentration risk',
        topPerformers: ['AAPL', 'MSFT'],
        underperformers: ['TSLA']
      },
      recommendations: [
        {
          action: 'Reduce tech concentration',
          reasoning: 'Over 40% allocation in technology sector increases risk',
          priority: 'high'
        },
        {
          action: 'Add international exposure',
          reasoning: 'Improve diversification with global markets',
          priority: 'medium'
        }
      ],
      marketTiming: {
        buySignals: ['VTI', 'International ETFs'],
        sellSignals: ['Overvalued growth stocks'],
        holdRecommendations: ['AAPL', 'MSFT']
      },
      riskManagement: [
        {
          strategy: 'Stop-loss orders',
          implementation: 'Set 15% stop-loss on individual positions'
        }
      ],
      taxImplications: [
        {
          action: 'Harvest losses on TSLA',
          taxImpact: 'Could offset $3,000 in gains'
        }
      ],
      rebalancingAdvice: {
        frequency: 'Quarterly',
        targetAllocations: {
          'US Stocks': 50,
          'International': 20,
          'Bonds': 25,
          'Cash': 5
        }
      }
    };
  }
}

export const enhancedGeminiAI = new EnhancedGeminiAIService();