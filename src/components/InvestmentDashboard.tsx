import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { investmentService, Portfolio } from '../services/investmentService';

export function InvestmentDashboard() {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, [user]);

  const loadPortfolioData = async () => {
    if (!user) return;
    
    try {
      const portfolioData = await investmentService.getPortfolio(user.id);
      const insightsData = await investmentService.getInvestmentInsights(portfolioData);
      
      setPortfolio(portfolioData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Investment Data</h3>
        <p className="text-gray-600">Connect your brokerage account to track investments</p>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const allocationData = [
    { name: 'Stocks', value: portfolio.assetAllocation.stocks, color: '#3B82F6' },
    { name: 'Bonds', value: portfolio.assetAllocation.bonds, color: '#10B981' },
    { name: 'Cash', value: portfolio.assetAllocation.cash, color: '#F59E0B' },
    { name: 'Crypto', value: portfolio.assetAllocation.crypto, color: '#EF4444' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Investment Portfolio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ${portfolio.totalValue.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {portfolio.totalGainLoss >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${
              portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolio.totalGainLoss >= 0 ? '+' : ''}${portfolio.totalGainLoss.toFixed(2)}
            </p>
            <p className={`text-sm ${
              portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ({portfolio.totalGainLossPercentage.toFixed(2)}%)
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Risk Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {insights?.riskScore || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Moderate Risk</p>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Holdings</h3>
          <div className="space-y-4">
            {portfolio.investments.slice(0, 5).map((investment) => (
              <div key={investment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{investment.symbol}</p>
                  <p className="text-sm text-gray-600">{investment.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${investment.currentValue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {investment.gainLoss >= 0 ? '+' : ''}
                    {investment.gainLossPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Insights */}
      {insights && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Investment Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {insights.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">• {rec}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Next Actions</h4>
              <ul className="space-y-1">
                {insights.nextActions.map((action: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Holdings Detail */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dividend Yield
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{investment.symbol}</div>
                      <div className="text-sm text-gray-500">{investment.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {investment.shares}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${investment.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${investment.currentValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.gainLoss >= 0 ? '+' : ''}${investment.gainLoss.toFixed(2)}
                      <div className="text-xs">
                        ({investment.gainLossPercentage.toFixed(1)}%)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {investment.dividendYield ? `${investment.dividendYield}%` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}