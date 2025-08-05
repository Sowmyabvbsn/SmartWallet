import React,{useState,useEffect} from 'react';
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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentTransactions();
  }, [user]);

  const loadRecentTransactions = async () => {
    if (!user) return;
    
    try {
      // Load user's transactions from localStorage
      const stored = localStorage.getItem(`transactions_${user.id}`);
      const userTransactions = stored ? JSON.parse(stored) : [];
      
      // Combine with mock data and get recent ones
      const mockTransactions = [
        { id: 1, merchant: 'Starbucks', amount: 5.85, category: 'Food & Dining', time: '2 hours ago', icon: Coffee },
        { id: 2, merchant: 'Shell Gas Station', amount: 45.20, category: 'Transportation', time: '1 day ago', icon: Car },
        { id: 3, merchant: 'Amazon', amount: 89.99, category: 'Shopping', time: '2 days ago', icon: ShoppingBag },
        { id: 4, merchant: 'Electric Company', amount: 120.45, category: 'Utilities', time: '3 days ago', icon: Home },
      ];
      
      const allTransactions = [...userTransactions, ...mockTransactions]
        .sort((a, b) => new Date(b.date || Date.now()).getTime() - new Date(a.date || Date.now()).getTime())
        .slice(0, 4);
      
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const financialScore = 78;
  const monthlySpending = 2840.50;
  const budgetRemaining = 1159.50;
  const savingsGoal = 85;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 md:pb-24">
      {/* Financial Health Score */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1">
              {user?.firstName ? `${user.firstName}'s Financial Health` : 'Financial Health Score'}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">Based on your spending patterns</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>
        <div className="flex items-end space-x-4 mb-4">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">{financialScore}</div>
          <div className="text-sm sm:text-base text-blue-100 mb-2">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            +5 from last month
          </div>
        </div>
        <div className="w-full bg-blue-500/50 rounded-full h-3 backdrop-blur-sm">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-1000 shadow-sm"
            style={{ width: `${financialScore}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">${monthlySpending.toLocaleString()}</p>
              <p className="text-red-600 text-sm flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-2xl">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Budget Remaining</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">${budgetRemaining.toLocaleString()}</p>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                29% of budget left
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-2xl">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Savings Goal</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{savingsGoal}%</p>
              <p className="text-blue-600 text-sm flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                On track for $500
              </p>
            </div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${savingsGoal}, 100`}
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <div className="bg-blue-50 p-2 rounded-xl mr-3">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            AI Insights
          </h3>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 hover:shadow-md transition-all duration-200">
              <div className={`p-2 rounded-xl ${
                insight.type === 'warning' ? 'text-orange-500' : 'text-green-500'
              } ${insight.type === 'warning' ? 'bg-orange-50' : 'bg-green-50'}`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-4 sm:p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl shadow-sm">
                  {transaction.icon ? (
                    <transaction.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  ) : (
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{transaction.merchant}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm sm:text-base">-${transaction.amount}</p>
                <p className="text-xs sm:text-sm text-gray-500">{transaction.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={onScanReceipt}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Smartphone className="h-5 w-5" />
            <span>Scan Receipt</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 p-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            <BarChart3 className="h-5 w-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}