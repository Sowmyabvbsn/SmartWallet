// Mock API functions for demonstration
// In production, these would connect to your backend services

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  hasReceipt: boolean;
  items: string[];
  userId: string;
}

export interface ReceiptData {
  merchant: string;
  date: string;
  total: number;
  tax: number;
  subtotal: number;
  items: Array<{
    name: string;
    price: number;
    category: string;
  }>;
  paymentMethod: string;
  confidence: number;
  userId: string;
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    await delay(500);
    // In production, this would fetch from your backend
    const stored = localStorage.getItem(`transactions_${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    await delay(300);
    const existing = await this.getTransactions(transaction.userId);
    const updated = [transaction, ...existing];
    localStorage.setItem(`transactions_${transaction.userId}`, JSON.stringify(updated));
  },

  // Receipt processing
  async processReceipt(file: File, userId: string): Promise<ReceiptData> {
    await delay(2000); // Simulate AI processing time
    
    // Mock OCR and AI processing
    return {
      merchant: 'Target Store #1234',
      date: new Date().toISOString().split('T')[0],
      total: Math.round((Math.random() * 100 + 20) * 100) / 100,
      tax: Math.round((Math.random() * 10 + 2) * 100) / 100,
      subtotal: Math.round((Math.random() * 90 + 18) * 100) / 100,
      items: [
        { name: 'Organic Milk', price: 4.99, category: 'Groceries' },
        { name: 'Bread', price: 2.50, category: 'Groceries' },
        { name: 'Coffee Pods', price: 12.99, category: 'Groceries' },
        { name: 'Cleaning Supplies', price: 8.99, category: 'Household' },
      ],
      paymentMethod: 'Credit Card ending in 4521',
      confidence: Math.round(Math.random() * 10 + 90),
      userId
    };
  },

  // Financial insights
  async getFinancialInsights(userId: string): Promise<any> {
    await delay(800);
    return {
      financialScore: Math.round(Math.random() * 30 + 70),
      monthlySpending: Math.round((Math.random() * 1000 + 2000) * 100) / 100,
      budgetRemaining: Math.round((Math.random() * 500 + 1000) * 100) / 100,
      savingsRate: Math.round(Math.random() * 20 + 70),
      insights: [
        {
          type: 'warning',
          title: 'Coffee Spending Alert',
          message: 'You\'ve spent more on coffee this week than usual.',
        },
        {
          type: 'success',
          title: 'Great Progress!',
          message: 'You\'re on track to save extra money this month.',
        }
      ]
    };
  }
};