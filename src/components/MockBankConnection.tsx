import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link, CheckCircle, AlertCircle, CreditCard, Building } from 'lucide-react';
import { mockBankService, MockBankAccount } from '../services/mockBankService';

interface MockBankConnectionProps {
  onSuccess?: (accounts: MockBankAccount[]) => void;
}

export function MockBankConnection({ onSuccess }: MockBankConnectionProps) {
  const { user } = useUser();
  const [availableAccounts, setAvailableAccounts] = useState<MockBankAccount[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<MockBankAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const [available, connected] = await Promise.all([
        mockBankService.getAvailableAccounts(),
        mockBankService.getConnectedAccounts()
      ]);
      setAvailableAccounts(available);
      setConnectedAccounts(connected);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (accountId: string) => {
    setIsConnecting(true);
    try {
      const success = await mockBankService.connectAccount(accountId);
      if (success) {
        await loadAccounts();
        const connected = await mockBankService.getConnectedAccounts();
        onSuccess?.(connected);
        setShowAccountSelector(false);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      await mockBankService.disconnectAccount(accountId);
      await loadAccounts();
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const handleSyncTransactions = async () => {
    setSyncing(true);
    try {
      const newTransactions = await mockBankService.syncTransactions();
      console.log('Synced transactions:', newTransactions);
      alert(`Synced ${newTransactions.length} new transactions!`);
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Failed to sync transactions. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'savings':
        return <Building className="h-5 w-5 text-green-600" />;
      case 'credit':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'credit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
            <button
              onClick={handleSyncTransactions}
              disabled={syncing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              {syncing ? 'Syncing...' : 'Sync Transactions'}
            </button>
          </div>
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  {getAccountIcon(account.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{account.name}</h4>
                    <p className="text-sm text-gray-600">{account.institution} • {account.accountNumber}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${Math.abs(account.balance).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {account.type === 'credit' ? 'Available Credit' : 'Balance'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <button
                      onClick={() => handleDisconnectAccount(account.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connect New Account */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bank Accounts</h3>
          <button
            onClick={() => setShowAccountSelector(!showAccountSelector)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Link className="h-4 w-4" />
            <span>Connect Account</span>
          </button>
        </div>

        {showAccountSelector && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">Select Account to Connect</h4>
            <div className="space-y-3">
              {availableAccounts.filter(acc => !acc.isConnected).map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getAccountIcon(account.type)}
                    <div>
                      <h5 className="font-medium text-gray-900">{account.name}</h5>
                      <p className="text-sm text-gray-600">{account.institution} • {account.accountNumber}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnectAccount(account.id)}
                    disabled={isConnecting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">🔒 Secure Connection</h4>
        <p className="text-sm text-blue-800">
          This is a demo version using mock bank data. In production, we would use bank-grade security 
          and encryption to protect your financial information.
        </p>
      </div>
    </div>
  );
}