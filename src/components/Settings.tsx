import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Target, 
  Smartphone,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

export function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [notifications, setNotifications] = useState({
    spendingAlerts: true,
    budgetWarnings: true,
    monthlyReports: true,
    receiptReminders: false,
    goalUpdates: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analyticsTracking: true,
    personalizedAds: false
  });

  const [showBalance, setShowBalance] = useState(true);

  const budgetCategories = [
    { name: 'Food & Dining', budget: 600, spent: 520, color: 'bg-orange-500' },
    { name: 'Transportation', budget: 300, spent: 245, color: 'bg-blue-500' },
    { name: 'Shopping', budget: 400, spent: 380, color: 'bg-purple-500' },
    { name: 'Entertainment', budget: 200, spent: 145, color: 'bg-pink-500' },
    { name: 'Utilities', budget: 250, spent: 220, color: 'bg-green-500' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2 text-blue-600" />
            Profile
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-100 rounded-full p-6">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <User className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.fullName || 'User'}
              </h3>
              <p className="text-gray-600">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Budget Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Target className="h-6 w-6 mr-2 text-green-600" />
            Budget Management
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {budgetCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <div className="text-sm text-gray-600">
                    ${category.spent} / ${category.budget}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color} transition-all duration-300`}
                    style={{ width: `${Math.min((category.spent / category.budget) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round((category.spent / category.budget) * 100)}% used</span>
                  <span>${category.budget - category.spent} remaining</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors">
            Adjust Budgets
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2 text-yellow-600" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'spendingAlerts' && 'Get notified when you make large purchases'}
                  {key === 'budgetWarnings' && 'Alerts when you\'re approaching budget limits'}
                  {key === 'monthlyReports' && 'Monthly financial summary and insights'}
                  {key === 'receiptReminders' && 'Reminders to scan and categorize receipts'}
                  {key === 'goalUpdates' && 'Updates on your savings and financial goals'}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-purple-600" />
            Connected Accounts
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Account Connection</h3>
            <p className="text-gray-600 mb-4">
              Connect your bank accounts to automatically sync transactions and get better insights.
            </p>
            <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
              💡 This demo uses mock bank data. In production, we would integrate with secure banking APIs 
              to safely connect your real accounts with bank-grade security.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-red-600" />
            Privacy & Security
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {key === 'dataSharing' && 'Share anonymized data to improve AI features'}
                    {key === 'analyticsTracking' && 'Allow usage analytics for better experience'}
                    {key === 'personalizedAds' && 'Show personalized financial product recommendations'}
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, [key]: !value }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Show Balance in App</h4>
                <p className="text-sm text-gray-600">Hide sensitive financial information</p>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
              Change Password
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors">
              Enable Two-Factor Authentication
            </button>
            <button 
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Smartphone className="h-6 w-6 mr-2 text-indigo-600" />
            App Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Currency</h4>
              <p className="text-sm text-gray-600">Default currency for all transactions</p>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Date Format</h4>
              <p className="text-sm text-gray-600">How dates are displayed in the app</p>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Theme</h4>
              <p className="text-sm text-gray-600">Choose your preferred app theme</p>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}