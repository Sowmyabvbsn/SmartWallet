import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link, CheckCircle, AlertCircle } from 'lucide-react';
import { plaidService, PlaidAccount } from '../services/plaidService';

interface PlaidLinkButtonProps {
  onSuccess?: (accounts: PlaidAccount[]) => void;
}

export function PlaidLinkButton({ onSuccess }: PlaidLinkButtonProps) {
  const { user } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConnect = async () => {
    if (!user) return;
    
    setIsConnecting(true);
    setConnectionStatus('idle');

    try {
      // Step 1: Create link token
      const linkToken = await plaidService.createLinkToken(user.id);
      
      // Step 2: Simulate Plaid Link flow (in production, use Plaid Link SDK)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 3: Exchange public token for access token
      const publicToken = 'public_token_example';
      const accessToken = await plaidService.exchangePublicToken(publicToken);
      
      // Step 4: Get accounts
      const accounts = await plaidService.getAccounts(accessToken);
      
      setConnectionStatus('success');
      onSuccess?.(accounts);
      
      // Store access token for future use (in production, store securely on backend)
      localStorage.setItem(`plaid_access_token_${user.id}`, accessToken);
      
    } catch (error) {
      console.error('Plaid connection failed:', error);
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonContent = () => {
    if (isConnecting) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </>
      );
    }

    if (connectionStatus === 'success') {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>Connected</span>
        </>
      );
    }

    if (connectionStatus === 'error') {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          <span>Connection Failed</span>
        </>
      );
    }

    return (
      <>
        <Link className="h-4 w-4" />
        <span>Connect Bank Account</span>
      </>
    );
  };

  const getButtonClass = () => {
    const baseClass = "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors";
    
    if (connectionStatus === 'success') {
      return `${baseClass} bg-green-600 text-white cursor-default`;
    }
    
    if (connectionStatus === 'error') {
      return `${baseClass} bg-red-600 hover:bg-red-700 text-white`;
    }
    
    return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400`;
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || connectionStatus === 'success'}
      className={getButtonClass()}
    >
      {getButtonContent()}
    </button>
  );
}