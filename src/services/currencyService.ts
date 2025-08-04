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
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5 },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 }
  ];

  private baseCurrency: string = 'USD';
  private userCurrency: string = 'USD';

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
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / rates[fromCurrency];
    const convertedAmount = usdAmount * rates[toCurrency];
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
    const currency = this.currencies.find(c => c.code === currencyCode);
    if (!currency) return `${amount.toFixed(2)}`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  setUserCurrency(currencyCode: string): void {
    this.userCurrency = currencyCode;
    localStorage.setItem('userCurrency', currencyCode);
  }

  getUserCurrency(): string {
    return localStorage.getItem('userCurrency') || this.userCurrency;
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

  getCurrencySymbol(currencyCode: string): string {
    const currency = this.currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  }
}

export const currencyService = new CurrencyService();