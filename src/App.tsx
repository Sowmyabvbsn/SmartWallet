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
import { InvestmentDashboard } from './components/InvestmentDashboard';
import { BillManager } from './components/BillManager';
import { AIAssistant } from './components/AIAssistant';
import { ExportCenter } from './components/ExportCenter';
import { CollaborativeBudgets } from './components/CollaborativeBudgets';
import { CurrencyConverter } from './components/CurrencyConverter';
import { GoogleWalletIntegration } from './components/GoogleWalletIntegration';
import { MockBankConnection } from './components/MockBankConnection';

type TabType = 'dashboard' | 'transactions' | 'analytics' | 'investments' | 'bills' | 'ai-assistant' | 'export' | 'budgets' | 'currency' | 'wallet' | 'settings';

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
      case 'investments':
        return <InvestmentDashboard />;
      case 'bills':
        return <BillManager />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'export':
        return <ExportCenter />;
      case 'budgets':
        return <CollaborativeBudgets />;
      case 'currency':
        return <CurrencyConverter />;
      case 'wallet':
        return <GoogleWalletIntegration />;
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
              <Route path="/investments" element={<InvestmentDashboard />} />
              <Route path="/bills" element={<BillManager />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/export" element={<ExportCenter />} />
              <Route path="/budgets" element={<CollaborativeBudgets />} />
              <Route path="/currency" element={<CurrencyConverter />} />
              <Route path="/wallet" element={<GoogleWalletIntegration />} />
              <Route path="/bank-connection" element={<MockBankConnection />} />
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