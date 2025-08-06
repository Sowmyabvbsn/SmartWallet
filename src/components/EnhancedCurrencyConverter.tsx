import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Globe, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { realCurrencyService, Currency, CurrencyConversion } from '../services/realCurrencyService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function EnhancedCurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState<string>('100');
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [currencyNews, setCurrencyNews] = useState<any[]>([]);

  useEffect(() => {
    loadCurrencies();
    loadHistoricalData();
    loadCurrencyNews();
    
    // Update rates every 5 minutes
    const interval = setInterval(() => {
      refreshRates();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      handleConvert();
    }
  }, [fromCurrency, toCurrency, amount]);

  const loadCurrencies = async () => {
    const currencyList = await realCurrencyService.getSupportedCurrencies();
    setCurrencies(currencyList);
  };

  const loadHistoricalData = async () => {
    try {
      const data = await realCurrencyService.getHistoricalRates(fromCurrency, 30);
      setHistoricalData(data);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const loadCurrencyNews = async () => {
    try {
      const news = await realCurrencyService.getCurrencyNews(fromCurrency);
      setCurrencyNews(news);
    } catch (error) {
      console.error('Failed to load currency news:', error);
    }
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setLoading(true);
    try {
      const result = await realCurrencyService.convertCurrency(
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

  const refreshRates = async () => {
    setRefreshing(true);
    try {
      await realCurrencyService.getExchangeRates(fromCurrency);
      setLastUpdated(new Date());
      if (amount && parseFloat(amount) > 0) {
        await handleConvert();
      }
      await loadHistoricalData();
    } catch (error) {
      console.error('Failed to refresh rates:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const popularPairs = [
    { from: 'USD', to: 'EUR', label: 'USD → EUR' },
    { from: 'USD', to: 'GBP', label: 'USD → GBP' },
    { from: 'EUR', to: 'GBP', label: 'EUR → GBP' },
    { from: 'USD', to: 'JPY', label: 'USD → JPY' },
    { from: 'USD', to: 'INR', label: 'USD → INR' },
    { from: 'EUR', to: 'INR', label: 'EUR → INR' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enhanced Currency Converter</h2>
          <p className="text-gray-600">Real-time exchange rates with market insights</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={refreshRates}
              disabled={refreshing}
              className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Converter */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* From Currency */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">From</label>
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
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
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg bg-gray-50 min-h-[52px] flex items-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : conversion ? (
                  <span className="font-semibold text-gray-900">
                    {realCurrencyService.formatCurrency(conversion.convertedAmount, toCurrency)}
                  </span>
                ) : (
                  <span className="text-gray-500">Enter amount to convert</span>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSwapCurrencies}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Conversion Result */}
          {conversion && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-2">Conversion Result</p>
                <p className="text-2xl font-bold text-blue-900 mb-2">
                  {realCurrencyService.formatCurrency(conversion.amount, conversion.from)} = {realCurrencyService.formatCurrency(conversion.convertedAmount, conversion.to)}
                </p>
                <p className="text-sm text-blue-700">
                  1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Converted at: {new Date(conversion.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Popular Pairs */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Popular Currency Pairs</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularPairs.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFromCurrency(pair.from);
                    setToCurrency(pair.to);
                  }}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Chart */}
      {historicalData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            30-Day Exchange Rate Trend ({fromCurrency})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Rate']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Currency News */}
      {currencyNews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Market News</h3>
          <div className="space-y-4">
            {currencyNews.map((article, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exchange Rate Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Exchange Rate Information
        </h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Real-time exchange rates updated every 5 minutes</p>
          <p>• Historical data shows 30-day trends for better decision making</p>
          <p>• Rates include market fluctuations and are for reference only</p>
          <p>• For large transactions, consult with your bank for exact rates</p>
          <p className="text-xs text-gray-500 mt-2">
            Data provided by multiple financial APIs with fallback to ensure reliability
          </p>
        </div>
      </div>
    </div>
  );
}