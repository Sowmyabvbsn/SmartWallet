import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Coffee,
  Car,
  Home,
  Smartphone,
  Brain,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  onScanReceipt: () => void;
}

export function Dashboard({ onScanReceipt }: DashboardProps) {
  const { user } = useUser();
  const financialScore = 78;
  const monthlySpending = 2840.50;
  const budgetRemaining = 1159.50;
  const savingsGoal = 85;

  const recentTransactions = [
    { id: 1, merchant: 'Starbucks', amount: 5.85, category: 'Food & Dining', time: '2 hours ago', icon: Coffee },
    { id: 2, merchant: 'Shell Gas Station', amount: 45.20, category: 'Transportation', time: '1 day ago', icon: Car },
    { id: 3, merchant: 'Amazon', amount: 89.99, category: 'Shopping', time: '2 days ago', icon: ShoppingBag },
    { id: 4, merchant: 'Electric Company', amount: 120.45, category: 'Utilities', time: '3 days ago', icon: Home },
  ];

  const aiInsights = [
    {
      type: 'warning',
      title: 'Coffee Spending Alert',
      message: 'You\'ve spent $47 on coffee this week, 40% above your usual pattern.',
      icon: AlertCircle
    },
    {
      type: 'success',
      title: 'Great Progress!',
      message: 'You\'re on track to save $200 extra this month by reducing dining out.',
      icon: TrendingUp
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Financial Health Score */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">
              {user?.firstName ? `${user.firstName}'s Financial Health` : 'Financial Health Score'}
            </h2>
            <p className="text-blue-100 text-sm">Based on your spending patterns</p>
          </div>
          <Brain className="h-8 w-8 text-blue-200" />
        </div>
        <div className="flex items-end space-x-4">
          <div className="text-4xl font-bold">{financialScore}</div>
          <div className="text-sm text-blue-100 mb-2">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            +5 from last month
          </div>
        </div>
        <div className="w-full bg-blue-500 rounded-full h-2 mt-4">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${financialScore}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${monthlySpending.toLocaleString()}</p>
              <p className="text-red-600 text-sm flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Budget Remaining</p>
              <p className="text-2xl font-bold text-gray-900">${budgetRemaining.toLocaleString()}</p>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                29% of budget left
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Savings Goal</p>
              <p className="text-2xl font-bold text-gray-900">{savingsGoal}%</p>
              <p className="text-blue-600 text-sm flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                On track for $500
              </p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray={`${savingsGoal}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-600" />
            AI Insights
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
              <insight.icon className={`h-5 w-5 mt-0.5 ${
                insight.type === 'warning' ? 'text-orange-500' : 'text-green-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <transaction.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">-${transaction.amount}</p>
                <p className="text-sm text-gray-500">{transaction.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onScanReceipt}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
          >
            <Smartphone className="h-5 w-5" />
            <span>Scan Receipt</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg transition-colors">
            <BarChart3 className="h-5 w-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}