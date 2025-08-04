import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { Search, Filter, Calendar, ChevronDown, Receipt } from 'lucide-react';

export function Transactions() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const transactions = [
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
                         transaction.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {filteredTransactions.length} transactions
              </span>
              <span className="text-lg font-semibold text-gray-900">
                -$1,364.91
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
                <option value="all-time">All Time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{transaction.merchant}</h3>
                    {transaction.hasReceipt && (
                      <Receipt className="h-4 w-4 text-blue-600" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{transaction.date} at {transaction.time}</p>
                    <p>{transaction.paymentMethod}</p>
                    <p className="text-xs">
                      {transaction.items.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-gray-900">
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
          <div className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}