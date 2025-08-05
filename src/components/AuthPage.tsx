import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Wallet, Brain, Shield, Zap, Camera, BarChart3 } from 'lucide-react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex overflow-hidden">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 xl:p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-lg">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl xl:text-3xl font-bold">Smart Wallet</h1>
              <p className="text-blue-100">AI Financial Assistant</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl xl:text-3xl font-bold mb-4 leading-tight">
                Transform Your Financial Life with AI
              </h2>
              <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
                Digitize receipts, understand spending patterns, and get personalized insights 
                powered by advanced AI technology.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base xl:text-lg">Smart Receipt Scanning</h3>
                  <p className="text-blue-100 text-sm xl:text-base">
                    AI-powered OCR extracts every detail from your receipts with 99% accuracy
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base xl:text-lg">Intelligent Insights</h3>
                  <p className="text-blue-100 text-sm xl:text-base">
                    Get personalized recommendations and spending pattern analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base xl:text-lg">Advanced Analytics</h3>
                  <p className="text-blue-100 text-sm xl:text-base">
                    Visualize your financial health with interactive charts and reports
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base xl:text-lg">Bank-Level Security</h3>
                  <p className="text-blue-100 text-sm xl:text-base">
                    Your financial data is protected with enterprise-grade encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 xl:space-x-6 text-xs xl:text-sm text-blue-100 relative z-10">
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Smart Wallet</h1>
                <p className="text-gray-600">AI Financial Assistant</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100/50 backdrop-blur-sm">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isSignUp 
                  ? 'Start your journey to better financial health' 
                  : 'Sign in to access your financial dashboard'
                }
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {isSignUp ? (
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm normal-case shadow-lg',
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50 rounded-xl',
                      dividerLine: 'bg-gray-200',
                      dividerText: 'text-gray-500',
                      formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl',
                      footerActionLink: 'text-blue-600 hover:text-blue-700'
                    }
                  }}
                  redirectUrl="/"
                />
              ) : (
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm normal-case shadow-lg',
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50 rounded-xl',
                      dividerLine: 'bg-gray-200',
                      dividerText: 'text-gray-500',
                      formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl',
                      footerActionLink: 'text-blue-600 hover:text-blue-700'
                    }
                  }}
                  redirectUrl="/"
                />
              )}
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm sm:text-base"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}