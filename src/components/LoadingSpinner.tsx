import React from 'react';
import { Wallet } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="bg-blue-600 p-4 rounded-2xl mb-4 animate-pulse">
            <Wallet className="h-12 w-12 text-white" />
          </div>
          <div className="absolute inset-0 bg-blue-600 rounded-2xl animate-ping opacity-20"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Smart Wallet</h2>
        <p className="text-gray-600">Loading your financial dashboard...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
}