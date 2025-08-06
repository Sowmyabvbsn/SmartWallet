import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Wallet, Home, FileText, BarChart3, Settings, Camera, TrendingUp, Calendar, Bot, Download, Users, Globe, CreditCard, Menu, X } from 'lucide-react';

type TabType = 'dashboard' | 'transactions' | 'analytics' | 'investments' | 'bills' | 'ai-assistant' | 'export' | 'budgets' | 'currency' | 'wallet' | 'market-insights' | 'settings';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onScanReceipt: () => void;
}

export function Header({ activeTab, onTabChange, onScanReceipt }: HeaderProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleTabChange = (tab: TabType) => {
    onTabChange(tab);
    navigate(`/${tab === 'dashboard' ? '' : tab}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 flex-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Smart Wallet
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Welcome back, {user?.firstName || 'User'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={onScanReceipt}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Scan Receipt</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-blue-100"
                  }
                }}
                afterSignOutUrl="/auth"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black bg-opacity-50 z-40">
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 p-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'dashboard', icon: Home, label: 'Home' },
                { id: 'transactions', icon: FileText, label: 'Transactions' },
                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                { id: 'investments', icon: TrendingUp, label: 'Investments' },
                { id: 'bills', icon: Calendar, label: 'Bills' },
                { id: 'ai-assistant', icon: Bot, label: 'AI Chat' },
                { id: 'export', icon: Download, label: 'Export' },
                { id: 'budgets', icon: Users, label: 'Budgets' },
                { id: 'currency', icon: Globe, label: 'Currency' },
                { id: 'wallet', icon: CreditCard, label: 'Passes' },
                { id: 'market-insights', icon: TrendingUp, label: 'Market' },
                { id: 'bank-connection', icon: CreditCard, label: 'Banks' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id as TabType)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    (location.pathname === `/${id}` || (location.pathname === '/' && id === 'dashboard'))
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Bottom Navigation */}
      <nav className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around py-2 overflow-x-auto">
            {[
              { id: 'dashboard', icon: Home, label: 'Home' },
              { id: 'transactions', icon: FileText, label: 'Transactions' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'investments', icon: TrendingUp, label: 'Investments' },
              { id: 'bills', icon: Calendar, label: 'Bills' },
              { id: 'ai-assistant', icon: Bot, label: 'AI Chat' },
              { id: 'export', icon: Download, label: 'Export' },
              { id: 'budgets', icon: Users, label: 'Budgets' },
              { id: 'currency', icon: Globe, label: 'Currency' },
              { id: 'wallet', icon: CreditCard, label: 'Passes' },
              { id: 'market-insights', icon: TrendingUp, label: 'Market' },
              { id: 'bank-connection', icon: CreditCard, label: 'Banks' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id as TabType)}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 transform hover:scale-105 ${
                  (location.pathname === `/${id}` || (location.pathname === '/' && id === 'dashboard'))
                    ? 'text-blue-600 bg-gradient-to-t from-blue-50 to-blue-100 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50 shadow-lg">
        <div className="px-2">
          <div className="flex justify-around py-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Home' },
              { id: 'transactions', icon: FileText, label: 'Transactions' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'ai-assistant', icon: Bot, label: 'AI Chat' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id as TabType)}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 ${
                  (location.pathname === `/${id}` || (location.pathname === '/' && id === 'dashboard'))
                    ? 'text-blue-600 bg-gradient-to-t from-blue-50 to-blue-100 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}