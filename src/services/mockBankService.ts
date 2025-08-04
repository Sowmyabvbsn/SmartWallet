// Free alternative to Plaid - Mock bank account linking service
export interface MockBankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  accountNumber: string;
  routingNumber: string;
  institution: string;
  isConnected: boolean;
}

export interface MockTransaction {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  merchant: string;
  category: string;
  description: string;
  pending: boolean;
}

class MockBankService {
  private accounts: MockBankAccount[] = [
    {
      id: 'acc_1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 2450.75,
      accountNumber: '****1234',
      routingNumber: '021000021',
      institution: 'Chase Bank',
      isConnected: false
    },
    {
      id: 'acc_2',
      name: 'Savings Account',
      type: 'savings',
      balance: 8750.20,
      accountNumber: '****5678',
      routingNumber: '021000021',
      institution: 'Chase Bank',
      isConnected: false
    },
    {
      id: 'acc_3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.45,
      accountNumber: '****4521',
      routingNumber: '',
      institution: 'Chase Bank',
      isConnected: false
    }
  ];

  private mockTransactions: MockTransaction[] = [
    {
      id: 'txn_1',
      accountId: 'acc_1',
      amount: -4.50,
      date: '2024-01-15',
      merchant: 'Starbucks',
      category: 'Food & Dining',
      description: 'Coffee purchase',
      pending: false
    },
    {
      id: 'txn_2',
      accountId: 'acc_3',
      amount: -89.99,
      date: '2024-01-14',
      merchant: 'Amazon',
      category: 'Shopping',
      description: 'Online purchase',
      pending: false
    },
    {
      id: 'txn_3',
      accountId: 'acc_1',
      amount: -45.20,
      date: '2024-01-13',
      merchant: 'Shell',
      category: 'Transportation',
      description: 'Gas station',
      pending: false
    }
  ];

  async connectAccount(accountId: string): Promise<boolean> {
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      account.isConnected = true;
      return true;
    }
    return false;
  }

  async getAvailableAccounts(): Promise<MockBankAccount[]> {
    // Simulate fetching available accounts
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.accounts;
  }

  async getConnectedAccounts(): Promise<MockBankAccount[]> {
    return this.accounts.filter(acc => acc.isConnected);
  }

  async getAccountTransactions(accountId: string): Promise<MockTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.mockTransactions.filter(txn => txn.accountId === accountId);
  }

  async getAllTransactions(): Promise<MockTransaction[]> {
    const connectedAccounts = await this.getConnectedAccounts();
    const connectedAccountIds = connectedAccounts.map(acc => acc.id);
    
    return this.mockTransactions.filter(txn => 
      connectedAccountIds.includes(txn.accountId)
    );
  }

  async disconnectAccount(accountId: string): Promise<boolean> {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      account.isConnected = false;
      return true;
    }
    return false;
  }

  async syncTransactions(): Promise<MockTransaction[]> {
    // Simulate syncing new transactions
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add some new mock transactions
    const newTransactions: MockTransaction[] = [
      {
        id: `txn_${Date.now()}`,
        accountId: 'acc_1',
        amount: -12.50,
        date: new Date().toISOString().split('T')[0],
        merchant: 'Local Cafe',
        category: 'Food & Dining',
        description: 'Lunch',
        pending: false
      }
    ];

    this.mockTransactions.push(...newTransactions);
    return newTransactions;
  }
}

export const mockBankService = new MockBankService();