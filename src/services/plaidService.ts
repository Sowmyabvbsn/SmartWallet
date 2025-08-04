// Plaid integration for bank account linking
export interface PlaidAccount {
  id: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
  institution: string;
}

export interface PlaidTransaction {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  merchant: string;
  category: string[];
  pending: boolean;
}

class PlaidService {
  private clientId: string;
  private secret: string;
  private env: string;

  constructor() {
    this.clientId = import.meta.env.VITE_PLAID_CLIENT_ID || '';
    this.secret = import.meta.env.VITE_PLAID_SECRET || '';
    this.env = import.meta.env.VITE_PLAID_ENV || 'sandbox';
  }

  async createLinkToken(userId: string): Promise<string> {
    // In production, this would call Plaid's API
    // For demo purposes, return a mock token
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `link-${userId}-${Date.now()}`;
  }

  async exchangePublicToken(publicToken: string): Promise<string> {
    // Exchange public token for access token
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `access-${publicToken}-${Date.now()}`;
  }

  async getAccounts(accessToken: string): Promise<PlaidAccount[]> {
    // Mock accounts data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 'acc_1',
        name: 'Chase Checking',
        type: 'depository',
        subtype: 'checking',
        balance: 2450.75,
        institution: 'Chase Bank'
      },
      {
        id: 'acc_2',
        name: 'Chase Savings',
        type: 'depository',
        subtype: 'savings',
        balance: 8750.20,
        institution: 'Chase Bank'
      },
      {
        id: 'acc_3',
        name: 'Chase Sapphire',
        type: 'credit',
        subtype: 'credit card',
        balance: -1250.45,
        institution: 'Chase Bank'
      }
    ];
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string): Promise<PlaidTransaction[]> {
    // Mock transactions data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockTransactions: PlaidTransaction[] = [
      {
        id: 'txn_1',
        accountId: 'acc_1',
        amount: 4.50,
        date: '2024-01-15',
        merchant: 'Starbucks',
        category: ['Food and Drink', 'Restaurants', 'Coffee Shop'],
        pending: false
      },
      {
        id: 'txn_2',
        accountId: 'acc_3',
        amount: 89.99,
        date: '2024-01-14',
        merchant: 'Amazon',
        category: ['Shops', 'Digital Purchase'],
        pending: false
      },
      {
        id: 'txn_3',
        accountId: 'acc_1',
        amount: 45.20,
        date: '2024-01-13',
        merchant: 'Shell',
        category: ['Transportation', 'Gas Stations'],
        pending: false
      }
    ];

    return mockTransactions;
  }

  async syncTransactions(userId: string): Promise<PlaidTransaction[]> {
    // Sync latest transactions for user
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // In production, get access tokens for user's linked accounts
    const mockAccessToken = 'access_token_example';
    return this.getTransactions(mockAccessToken, startDate, endDate);
  }
}

export const plaidService = new PlaidService();