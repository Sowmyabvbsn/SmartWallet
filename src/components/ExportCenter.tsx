import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Download, FileText, BarChart3, Calendar, Filter } from 'lucide-react';
import { exportService, ExportOptions } from '../services/exportService';

export function ExportCenter() {
  const { user } = useUser();
  const [exportType, setExportType] = useState<'transactions' | 'analytics'>('transactions');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const categories = [
    'Food & Dining',
    'Shopping',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Education'
  ];

  // Mock transactions data
  const mockTransactions = [
    {
      id: '1',
      date: '2024-01-15',
      merchant: 'Starbucks',
      category: 'Food & Dining',
      amount: 5.85,
      paymentMethod: 'Credit Card •••• 4521',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-14',
      merchant: 'Amazon',
      category: 'Shopping',
      amount: 89.99,
      paymentMethod: 'Credit Card •••• 4521',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-13',
      merchant: 'Shell Gas Station',
      category: 'Transportation',
      amount: 45.20,
      paymentMethod: 'Credit Card •••• 4521',
      status: 'completed'
    }
  ];

  const mockAnalyticsData = {
    financialScore: 78,
    monthlySpending: 2840.50,
    savingsRate: 37
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        format,
        dateRange,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        includeCharts
      };

      if (exportType === 'transactions') {
        if (format === 'pdf') {
          await exportService.exportTransactionsPDF(mockTransactions, options);
        } else {
          await exportService.exportTransactionsCSV(mockTransactions);
        }
      } else {
        await exportService.exportAnalyticsReport(mockAnalyticsData);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Download className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Center</h2>
          <p className="text-gray-600">Download your financial data in various formats</p>
        </div>

        {/* Export Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">What would you like to export?</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setExportType('transactions')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                exportType === 'transactions'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className={`h-6 w-6 ${
                  exportType === 'transactions' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900">Transaction Report</h3>
                  <p className="text-sm text-gray-600">Detailed list of all transactions</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setExportType('analytics')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                exportType === 'analytics'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className={`h-6 w-6 ${
                  exportType === 'analytics' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900">Analytics Report</h3>
                  <p className="text-sm text-gray-600">Charts and financial insights</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setFormat('pdf')}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                format === 'pdf'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              PDF Report
            </button>
            {exportType === 'transactions' && (
              <button
                onClick={() => setFormat('csv')}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  format === 'csv'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                CSV Data
              </button>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {exportType === 'transactions' && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories (optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Additional Options */}
        {format === 'pdf' && exportType === 'analytics' && (
          <div className="mb-8">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include charts and graphs</span>
            </label>
          </div>
        )}

        {/* Export Button */}
        <div className="text-center">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export {exportType === 'transactions' ? 'Transactions' : 'Analytics'}</span>
              </>
            )}
          </button>
        </div>

        {/* Export Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Export Information</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• PDF reports include formatted tables and charts</li>
            <li>• CSV files can be opened in Excel or Google Sheets</li>
            <li>• All exports include data from your selected date range</li>
            <li>• Personal information is included for your records only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}