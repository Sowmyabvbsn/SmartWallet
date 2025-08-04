import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Wallet, Brain, Shield, Zap, Camera, BarChart3 } from 'lucide-react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Smart Wallet</h1>
              <p className="text-blue-100">AI Financial Assistant</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Transform Your Financial Life with AI
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Digitize receipts, understand spending patterns, and get personalized insights 
                powered by advanced AI technology.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smart Receipt Scanning</h3>
                  <p className="text-blue-100">
                    AI-powered OCR extracts every detail from your receipts with 99% accuracy
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Intelligent Insights</h3>
                  <p className="text-blue-100">
                    Get personalized recommendations and spending pattern analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Advanced Analytics</h3>
                  <p className="text-blue-100">
                    Visualize your financial health with interactive charts and reports
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bank-Level Security</h3>
                  <p className="text-blue-100">
                    Your financial data is protected with enterprise-grade encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-blue-100">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Powered by Gemini AI</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>SOC 2 Compliant</span>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Wallet</h1>
                <p className="text-gray-600">AI Financial Assistant</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Start your journey to better financial health' 
                  : 'Sign in to access your financial dashboard'
                }
              </p>
            </div>

            <div className="space-y-6">
              {isSignUp ? (
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                      dividerLine: 'bg-gray-200',
                      dividerText: 'text-gray-500',
                      formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      footerActionLink: 'text-blue-600 hover:text-blue-700'
                    }
                  }}
                  redirectUrl="/"
                />
              ) : (
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                      dividerLine: 'bg-gray-200',
                      dividerText: 'text-gray-500',
                      formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      footerActionLink: 'text-blue-600 hover:text-blue-700'
                    }
                  }}
                  redirectUrl="/"
                />
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}