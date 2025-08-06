export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: string;
}

class CurrencyService {
  private currencies: Currency[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1.0 }
  ];

  private baseCurrency: string = 'INR';
  private userCurrency: string = 'INR';

  async getSupportedCurrencies(): Promise<Currency[]> {
    return this.currencies;
  }

  async getExchangeRates(): Promise<{ [key: string]: number }> {
    // In production, fetch from a real exchange rate API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rates: { [key: string]: number } = {};
    this.currencies.forEach(currency => {
      rates[currency.code] = currency.rate;
    });
    
    return rates;
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<CurrencyConversion> {
    const rates = await this.getExchangeRates();
    
    // Since we only support INR, conversion is 1:1
    const convertedAmount = amount;
    const rate = rates[toCurrency] / rates[fromCurrency];
    
    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      rate: Math.round(rate * 10000) / 10000,
      timestamp: new Date().toISOString()
    };
  }

  formatCurrency(amount: number, currencyCode: string): string {
    // Always format as INR
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatCurrencySimple(amount: number): string {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Helper method to format large amounts in Indian style (lakhs, crores)
  formatIndianCurrency(amount: number): string {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return this.formatCurrencySimple(amount);
    }
  }

  setUserCurrency(currencyCode: string): void {
    // Always set to INR
    this.userCurrency = 'INR';
    localStorage.setItem('userCurrency', 'INR');
  }

  getUserCurrency(): string {
    return 'INR';
  }

  getCurrencySymbol(currencyCode: string): string {
    return '₹';
  }

  async convertTransactionAmounts(transactions: any[], targetCurrency: string): Promise<any[]> {
    const userCurrency = this.getUserCurrency();
    
    if (userCurrency === targetCurrency) {
      return transactions;
    }

    const convertedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const conversion = await this.convertCurrency(
          transaction.amount,
          transaction.currency || userCurrency,
          targetCurrency
        );
        
        return {
          ...transaction,
          originalAmount: transaction.amount,
          originalCurrency: transaction.currency || userCurrency,
          amount: conversion.convertedAmount,
          currency: targetCurrency
        };
      })
    );

    return convertedTransactions;
  }
}

export const currencyService = new CurrencyService();