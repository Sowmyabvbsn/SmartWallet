import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { ReceiptScanner } from './components/ReceiptScanner';
import { AuthPage } from './components/AuthPage';
import { LoadingSpinner } from './components/LoadingSpinner';

type TabType = 'dashboard' | 'transactions' | 'analytics' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const renderContent = () => {
    if (showScanner) {
      return <ReceiptScanner onClose={() => setShowScanner(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onScanReceipt={() => setShowScanner(true)} />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onScanReceipt={() => setShowScanner(true)} />;
    }
  };

  return (
    <>
      <SignedOut>
        <Routes>
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <Header 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onScanReceipt={() => setShowScanner(true)}
          />
          <main className="pb-20">
            <Routes>
              <Route path="/" element={renderContent()} />
              <Route path="/dashboard" element={<Dashboard onScanReceipt={() => setShowScanner(true)} />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </SignedIn>
    </>
  );
}

export default App;