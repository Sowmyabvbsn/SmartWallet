import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, Home, FileText, BarChart3, Settings, Camera } from 'lucide-react';

type TabType = 'dashboard' | 'transactions' | 'analytics' | 'settings';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onScanReceipt: () => void;
}

export function Header({ activeTab, onTabChange, onScanReceipt }: HeaderProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: TabType) => {
    onTabChange(tab);
    navigate(`/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Wallet</h1>
                <p className="text-xs text-gray-500">Welcome back, {user?.firstName || 'User'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onScanReceipt}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Scan Receipt</span>
              </button>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
                afterSignOutUrl="/auth"
              />
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Home' },
              { id: 'transactions', icon: FileText, label: 'Transactions' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id as TabType)}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  (location.pathname === `/${id}` || (location.pathname === '/' && id === 'dashboard'))
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}