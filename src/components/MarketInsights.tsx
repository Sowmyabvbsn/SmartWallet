import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Newspaper, AlertTriangle } from 'lucide-react';
import { stockService, StockQuote, MarketOverview } from '../services/stockService';
import { newsService, MarketNews } from '../services/newsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MarketInsights() {
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [watchlist, setWatchlist] = useState<StockQuote[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const defaultWatchlist = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

  useEffect(() => {
    loadMarketData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      refreshMarketData();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    try {
      const [overview, quotes, news, sentiment] = await Promise.all([
        stockService.getMarketOverview(),
        stockService.getMultipleQuotes(defaultWatchlist),
        newsService.getFinancialNews('business'),
        newsService.getMarketSentiment()
      ]);

      setMarketOverview(overview);
      setWatchlist(quotes);
      setMarketNews(news);
      setMarketSentiment(sentiment);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMarketData = async () => {
    setRefreshing(true);
    try {
      await loadMarketData();
    } catch (error) {
      console.error('Error refreshing market data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-600 bg-green-100';
      case 'bearish':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Insights</h2>
            <p className="text-gray-600">Real-time market data and financial news</p>
          </div>
          <button
            onClick={refreshMarketData}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Activity className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Market Sentiment */}
      {marketSentiment && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Market Sentiment Analysis
          </h3>
          <div className="flex items-center space-x-6">
            <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getSentimentColor(marketSentiment.overall)}`}>
              {getSentimentIcon(marketSentiment.overall)}
              <span className="font-medium capitalize">{marketSentiment.overall}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Confidence: {marketSentiment.confidence}%</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">Analysis based on:</p>
            <ul className="space-y-1">
              {marketSentiment.factors.map((factor: string, index: number) => (
                <li key={index}>• {factor}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Market Overview */}
      {marketOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketOverview.indices.map((index, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{index.name}</h3>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {index.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className={`flex items-center space-x-1 ${
                  index.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {index.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </span>
                  <span className="text-sm">
                    ({index.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Watchlist */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Stock Watchlist
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {watchlist.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                      <div className="text-xs">
                        ({stock.changePercent.toFixed(1)}%)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stock.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stock.marketCap ? `$${(stock.marketCap / 1e9).toFixed(1)}B` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Movers */}
      {marketOverview && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Top Gainers
            </h3>
            <div className="space-y-3">
              {marketOverview.topGainers.slice(0, 3).map((stock, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">${stock.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right text-green-600">
                    <p className="font-medium">+{stock.changePercent.toFixed(1)}%</p>
                    <p className="text-sm">+${stock.change.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
              Top Losers
            </h3>
            <div className="space-y-3">
              {marketOverview.topLosers.slice(0, 3).map((stock, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">${stock.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right text-red-600">
                    <p className="font-medium">{stock.changePercent.toFixed(1)}%</p>
                    <p className="text-sm">${stock.change.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Most Active
            </h3>
            <div className="space-y-3">
              {marketOverview.mostActive.slice(0, 3).map((stock, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">${stock.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {stock.volume.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Volume</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial News */}
      {marketNews && marketNews.articles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Newspaper className="h-5 w-5 mr-2 text-purple-600" />
              Financial News
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {marketNews.articles.slice(0, 5).map((article, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      {article.sentiment && (
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          article.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          article.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}