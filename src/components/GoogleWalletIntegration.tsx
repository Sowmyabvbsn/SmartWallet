import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Wallet, Plus, QrCode, CreditCard, Gift } from 'lucide-react';
import { googleWalletService } from '../services/googleWalletService';

export function GoogleWalletIntegration() {
  const { user } = useUser();
  const [isCreatingPass, setIsCreatingPass] = useState(false);
  const [passUrl, setPassUrl] = useState<string | null>(null);

  const handleCreateLoyaltyPass = async () => {
    if (!user) return;
    
    setIsCreatingPass(true);
    try {
      // Mock account balance - in production, get from user's actual balance
      const accountBalance = 2450.75;
      const saveUrl = await googleWalletService.createLoyaltyPass(user.id, accountBalance);
      setPassUrl(saveUrl);
    } catch (error) {
      console.error('Failed to create Google Wallet pass:', error);
      alert('Failed to create wallet pass. Please try again.');
    } finally {
      setIsCreatingPass(false);
    }
  };

  const handleAddToWallet = () => {
    if (passUrl) {
      window.open(passUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Wallet Integration</h2>
          <p className="text-gray-600">Add your Smart Wallet card to Google Wallet for easy access</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <QrCode className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Quick Access</h3>
            <p className="text-sm text-gray-600">Access your balance and recent transactions instantly</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Loyalty Card</h3>
            <p className="text-sm text-gray-600">Show your Smart Wallet loyalty card at participating stores</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Gift className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Rewards</h3>
            <p className="text-sm text-gray-600">Earn points and rewards for using Smart Wallet</p>
          </div>
        </div>

        {/* Wallet Pass Preview */}
        <div className="max-w-sm mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Smart Wallet</h3>
                <p className="text-blue-100 text-sm">Premium Member</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-200" />
            </div>
            
            <div className="mb-4">
              <p className="text-blue-100 text-sm">Account Balance</p>
              <p className="text-2xl font-bold">$2,450.75</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-xs">Member Since</p>
                <p className="text-sm font-medium">2024</p>
              </div>
              <div className="bg-white p-2 rounded">
                <QrCode className="h-6 w-6 text-gray-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {!passUrl ? (
            <button
              onClick={handleCreateLoyaltyPass}
              disabled={isCreatingPass}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              {isCreatingPass ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Pass...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create Wallet Pass</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✅ Wallet pass created successfully!</p>
                <p className="text-green-700 text-sm mt-1">Click the button below to add it to Google Wallet</p>
              </div>
              
              <button
                onClick={handleAddToWallet}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
              >
                <Wallet className="h-4 w-4" />
                <span>Add to Google Wallet</span>
              </button>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Benefits of Google Wallet Integration</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Quick access to your account balance without opening the app</li>
            <li>• Use your phone to show loyalty card at stores</li>
            <li>• Receive notifications for transactions and rewards</li>
            <li>• Works offline - no internet connection required to show your card</li>
            <li>• Secure and encrypted - your financial data stays protected</li>
          </ul>
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-3">How to Use</h4>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. Create your Smart Wallet pass using the button above</li>
            <li>2. Add the pass to your Google Wallet</li>
            <li>3. Access your pass from Google Wallet or your phone's quick settings</li>
            <li>4. Show the QR code at participating merchants to earn rewards</li>
          </ol>
        </div>
      </div>
    </div>
  );
}