import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Globe, TrendingUp } from 'lucide-react';
import { currencyService, Currency, CurrencyConversion } from '../services/currencyService';

export function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState<string>('100');
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadCurrencies();
    // Update rates every 5 minutes
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      if (amount && parseFloat(amount) > 0) {
        handleConvert();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      handleConvert();
    }
  }, [fromCurrency, toCurrency, amount]);

  const loadCurrencies = async () => {
    const currencyList = await currencyService.getSupportedCurrencies();
    setCurrencies(currencyList);
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setLoading(true);
    try {
      const result = await currencyService.convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      );
      setConversion(result);
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    // Since we only support INR, no need to swap
    return;
  };

  const popularPairs = [
    { from: 'INR', to: 'INR', label: 'INR → INR' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Indian Rupee Calculator</h2>
          <p className="text-gray-600">Calculate amounts in Indian Rupees (₹)</p>
        </div>

        {/* Converter */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* From Currency */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">From</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* To Currency */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">To</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg bg-gray-50 min-h-[52px] flex items-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : amount && parseFloat(amount) > 0 ? (
                  <span className="font-semibold text-gray-900">
                    ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-gray-500">Enter amount to convert</span>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}

          {/* Conversion Result */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-2">Amount in Indian Rupees</p>
                <p className="text-2xl font-bold text-blue-900 mb-2">
                  ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-blue-700">
                  Indian Rupee (₹)
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              </div>
            </div>
          )}


          {/* Exchange Rate Trends */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Indian Rupee Information
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• All amounts are displayed in Indian Rupees (₹)</p>
              <p>• Currency formatting follows Indian numbering system</p>
              <p>• Large amounts are displayed in Lakhs and Crores</p>
              <p>• For international transactions, consult with your bank</p>
              <p className="text-xs text-gray-500 mt-2">
                Last rate update: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}