import React, { useState,useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { Search, Filter, Calendar, ChevronDown, Receipt } from 'lucide-react';

export function Transactions() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      // Load transactions from localStorage (in production, this would be an API call)
      const stored = localStorage.getItem(`transactions_${user.id}`);
      const userTransactions = stored ? JSON.parse(stored) : [];
      
      // Merge with default mock transactions
      const mockTransactions = [
        {
          id: 1,
          merchant: 'Target Store #1234',
          amount: 87.43,
          category: 'Shopping',
          date: format(new Date(), 'yyyy-MM-dd'),
          time: '14:32',
          paymentMethod: 'Credit Card •••• 4521',
          status: 'completed',
          hasReceipt: true,
          items: ['Organic Milk', 'Bread', 'Coffee Pods', '+4 more']
        },
        {
          id: 2,
          merchant: 'Starbucks Coffee',
          amount: 5.85,
          category: 'Food & Dining',
          date: format(new Date(), 'yyyy-MM-dd'),
          time: '08:15',
          paymentMethod: 'Debit Card •••• 1234',
          status: 'completed',
          hasReceipt: false,
          items: ['Grande Latte', 'Blueberry Muffin']
        },
        {
          id: 3,
          merchant: 'Shell Gas Station',
          amount: 45.20,
          category: 'Transportation',
          date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
          time: '18:45',
          paymentMethod: 'Credit Card •••• 4521',
          status: 'completed',
          hasReceipt: true,
          items: ['Fuel - Regular']
        },
        {
          id: 4,
          merchant: 'Amazon',
          amount: 89.99,
          category: 'Shopping',
          date: format(new Date(Date.now() - 172800000), 'yyyy-MM-dd'),
          time: '11:22',
          paymentMethod: 'Credit Card •••• 4521',
          status: 'completed',
          hasReceipt: false,
          items: ['Wireless Headphones']
        },
        {
          id: 5,
          merchant: 'Electric Company',
          amount: 120.45,
          category: 'Utilities',
          date: format(new Date(Date.now() - 259200000), 'yyyy-MM-dd'),
          time: '09:00',
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          hasReceipt: true,
          items: ['Monthly Electric Bill']
        },
        {
          id: 6,
          merchant: 'Netflix',
          amount: 15.99,
          category: 'Entertainment',
          date: format(new Date(Date.now() - 432000000), 'yyyy-MM-dd'),
          time: '00:01',
          paymentMethod: 'Credit Card •••• 4521',
          status: 'completed',
          hasReceipt: false,
          items: ['Monthly Subscription']
        }
      ];
      
      // Combine and sort by date (newest first)
      const allTransactions = [...userTransactions, ...mockTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };


  const categories = [
    'all',
    'Food & Dining',
    'Shopping',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Education'
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.items.some((item: string) => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Utilities': 'bg-green-100 text-green-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Education': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-24">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Transactions</h2>
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm text-gray-600">
                {filteredTransactions.length} transactions
              </span>
              <span className="text-base sm:text-lg font-semibold text-gray-900">
                -${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-0 sm:min-w-[160px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-full"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            </div>

            {/* Date Filter */}
            <div className="relative min-w-0 sm:min-w-[140px]">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-full"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
                <option value="all-time">All Time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-50">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{transaction.merchant}</h3>
                    {transaction.hasReceipt && (
                      <div className="bg-blue-50 p-1 rounded">
                        <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)} hidden sm:inline-block`}>
                      {transaction.category}
                    </span>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)} sm:hidden`}>
                      {transaction.category}
                    </span>
                    <p>{transaction.date} at {transaction.time}</p>
                    <p className="hidden sm:block">{transaction.paymentMethod}</p>
                    <p className="text-xs hidden sm:block">
                      {transaction.items.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="text-right ml-2 sm:ml-4">
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    -${transaction.amount.toFixed(2)}
                  </p>
                  <p className={`text-xs font-medium ${
                    transaction.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 sm:p-12 text-center">
            <div className="bg-gray-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}