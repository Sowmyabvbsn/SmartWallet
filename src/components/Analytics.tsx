import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Target } from 'lucide-react';

export function Analytics() {
  const { user } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const spendingByCategory = [
    { name: 'Food & Dining', amount: 850.50, percentage: 32, color: '#FF8042' },
    { name: 'Shopping', amount: 650.25, percentage: 25, color: '#8884D8' },
    { name: 'Transportation', amount: 420.80, percentage: 16, color: '#00C49F' },
    { name: 'Utilities', amount: 380.45, percentage: 14, color: '#FFBB28' },
    { name: 'Entertainment', amount: 215.90, percentage: 8, color: '#FF8042' },
    { name: 'Healthcare', amount: 125.60, percentage: 5, color: '#8DD1E1' }
  ];

  const monthlyTrends = [
    { month: 'Aug', spending: 2400, income: 4500, savings: 2100 },
    { month: 'Sep', spending: 2200, income: 4500, savings: 2300 },
    { month: 'Oct', spending: 2600, income: 4500, savings: 1900 },
    { month: 'Nov', spending: 2300, income: 4500, savings: 2200 },
    { month: 'Dec', spending: 2800, income: 4500, savings: 1700 },
    { month: 'Jan', spending: 2840, income: 4500, savings: 1660 }
  ];

  const savingsRate = 37;
  const avgMonthlyExpense = 2528;
  const highestCategory = spendingByCategory[0];

  const COLORS = ['#FF8042', '#8884D8', '#00C49F', '#FFBB28', '#FF8042', '#8DD1E1'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Analytics</h2>
            <p className="text-gray-600">Insights into your spending patterns and financial health</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-green-500" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Savings Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{savingsRate}%</p>
          <p className="text-sm text-green-600">+5% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Monthly Expense</h3>
          <p className="text-2xl font-bold text-gray-900">${avgMonthlyExpense.toLocaleString()}</p>
          <p className="text-sm text-red-600">+8% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="h-8 w-8 text-purple-500" />
            <div className="text-sm text-gray-500">{highestCategory.percentage}%</div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Top Category</h3>
          <p className="text-2xl font-bold text-gray-900">{highestCategory.name}</p>
          <p className="text-sm text-gray-600">${highestCategory.amount.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-orange-500" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Budget Adherence</h3>
          <p className="text-2xl font-bold text-gray-900">78%</p>
          <p className="text-sm text-green-600">On track this month</p>
        </div>
      </div>

      {/* Spending Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Spending Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Spending"
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                name="Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          <div className="space-y-6">
            <div className="h-64 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {spendingByCategory.map((category, index) => (
                <div key={category.name} className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <span className="text-sm text-gray-600">${category.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 w-12 text-right">
                    {category.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Goals</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Emergency Fund</span>
                <span className="text-sm text-gray-600">$8,500 / $10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: '85%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">85% complete</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Vacation Fund</span>
                <span className="text-sm text-gray-600">$2,100 / $5,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '42%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">42% complete</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">New Car</span>
                <span className="text-sm text-gray-600">$12,000 / $25,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: '48%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">48% complete</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Investment Portfolio</span>
                <span className="text-sm text-gray-600">$15,500 / $20,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: '77.5%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">77.5% complete</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
              Set New Goal
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Reduce Food & Dining</h4>
            <p className="text-sm text-gray-600">
              You spent 32% more on dining out this month. Consider meal planning to save ~$200/month.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Optimize Subscriptions</h4>
            <p className="text-sm text-gray-600">
              You have 7 active subscriptions. Canceling unused ones could save $45/month.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Increase Emergency Fund</h4>
            <p className="text-sm text-gray-600">
              You're close to your emergency fund goal. Consider increasing contributions by $100/month.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Investment Opportunity</h4>
            <p className="text-sm text-gray-600">
              With your current savings rate, you could invest an additional $300/month.
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="spending" fill="#3B82F6" name="Spending" />
              <Bar dataKey="savings" fill="#F59E0B" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}