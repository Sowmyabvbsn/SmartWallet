import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI features will use mock responses.');
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    }
  }

  async analyzeSpendingPatterns(transactions: any[]): Promise<any> {
    if (!this.model) {
      return this.getMockSpendingAnalysis();
    }

    try {
      const prompt = `
        Analyze the following financial transactions and provide insights:
        ${JSON.stringify(transactions, null, 2)}
        
        Please provide:
        1. Spending patterns and trends
        2. Budget recommendations
        3. Areas for potential savings
        4. Financial health score (1-100)
        5. Personalized advice
        
        Format the response as JSON with the following structure:
        {
          "financialScore": number,
          "insights": [{"type": "warning|success|info", "title": string, "message": string}],
          "recommendations": [string],
          "spendingTrends": {"category": string, "trend": "up|down|stable", "percentage": number}[]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getMockSpendingAnalysis();
      }
    } catch (error) {
      console.error('Gemini AI analysis failed:', error);
      return this.getMockSpendingAnalysis();
    }
  }

  async processReceiptText(ocrText: string): Promise<any> {
    if (!this.model) {
      return this.getMockReceiptData();
    }

    try {
      const prompt = `
        Extract structured data from this receipt text:
        "${ocrText}"
        
        Return JSON with this structure:
        {
          "merchant": string,
          "date": "YYYY-MM-DD",
          "total": number,
          "tax": number,
          "subtotal": number,
          "items": [{"name": string, "price": number, "category": string}],
          "paymentMethod": string,
          "confidence": number (1-100)
        }
        
        Categorize items into: Groceries, Electronics, Clothing, Healthcare, Entertainment, Transportation, Utilities, Other
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getMockReceiptData();
      }
    } catch (error) {
      console.error('Gemini AI receipt processing failed:', error);
      return this.getMockReceiptData();
    }
  }

  async answerFinancialQuery(query: string, userContext: any): Promise<string> {
    if (!this.model) {
      return "I'm here to help with your financial questions! (AI service currently unavailable)";
    }

    try {
      const prompt = `
        You are a financial advisor AI. Answer this question based on the user's financial context:
        
        Question: "${query}"
        
        User Context:
        ${JSON.stringify(userContext, null, 2)}
        
        Provide a helpful, personalized response focusing on actionable financial advice.
        Keep the response conversational and under 200 words.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI query failed:', error);
      return "I'm having trouble processing your question right now. Please try again later.";
    }
  }

  async generateBudgetRecommendations(income: number, expenses: any[]): Promise<any> {
    if (!this.model) {
      return this.getMockBudgetRecommendations();
    }

    try {
      const prompt = `
        Based on monthly income of $${income} and these expense categories:
        ${JSON.stringify(expenses, null, 2)}
        
        Provide budget recommendations as JSON:
        {
          "recommendations": [{"category": string, "suggested": number, "current": number, "reasoning": string}],
          "savingsGoal": number,
          "emergencyFund": number,
          "overallAdvice": string
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return this.getMockBudgetRecommendations();
      }
    } catch (error) {
      console.error('Gemini AI budget recommendations failed:', error);
      return this.getMockBudgetRecommendations();
    }
  }

  private getMockSpendingAnalysis() {
    return {
      financialScore: 78,
      insights: [
        {
          type: 'warning',
          title: 'Coffee Spending Alert',
          message: 'You\'ve spent 40% more on coffee this month compared to your average.'
        },
        {
          type: 'success',
          title: 'Great Savings Progress',
          message: 'You\'re on track to save $200 extra this month!'
        }
      ],
      recommendations: [
        'Consider setting a weekly coffee budget of $25',
        'Look into meal planning to reduce food expenses',
        'Review subscription services for potential savings'
      ],
      spendingTrends: [
        { category: 'Food & Dining', trend: 'up', percentage: 15 },
        { category: 'Transportation', trend: 'down', percentage: -8 },
        { category: 'Shopping', trend: 'stable', percentage: 2 }
      ]
    };
  }

  private getMockReceiptData() {
    return {
      merchant: 'Target Store #1234',
      date: new Date().toISOString().split('T')[0],
      total: 6995,
      tax: 595,
      subtotal: 6400,
      items: [
        { name: 'Organic Milk', price: 399, category: 'Groceries' },
        { name: 'Bread', price: 200, category: 'Groceries' },
        { name: 'Coffee Pods', price: 1039, category: 'Groceries' }
      ],
      paymentMethod: 'Credit Card ending in 4521',
      confidence: 85
    };
  }

  private getMockBudgetRecommendations() {
    return {
      recommendations: [
        {
          category: 'Food & Dining',
          suggested: 48000,
          current: 68000,
          reasoning: 'Consider reducing dining out frequency to meet savings goals'
        }
      ],
      savingsGoal: 40000,
      emergencyFund: 80000,
      overallAdvice: 'Focus on reducing discretionary spending to improve your financial health.'
    };
  }
}

export const geminiAI = new GeminiAIService();