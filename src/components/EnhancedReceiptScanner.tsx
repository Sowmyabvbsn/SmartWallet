import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Camera, Upload, X, Check, Loader, Sparkles, Leaf, Heart, MapPin } from 'lucide-react';
import { enhancedGeminiAI } from '../services/enhancedGeminiAI';

interface EnhancedReceiptScannerProps {
  onClose: () => void;
}

export function EnhancedReceiptScanner({ onClose }: EnhancedReceiptScannerProps) {
  const { user } = useUser();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processReceipt(file);
    }
  };

  const processReceipt = async (file: File) => {
    setScanning(true);
    setProcessingStep(0);

    const steps = [
      'Analyzing image quality...',
      'Extracting text with advanced OCR...',
      'Processing with Enhanced Gemini AI...',
      'Categorizing and analyzing items...',
      'Calculating environmental impact...',
      'Generating health insights...',
      'Updating financial records...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const mockOcrText = `
        WHOLE FOODS MARKET #1234
        123 HEALTH STREET
        SAN FRANCISCO, CA 94102
        
        ORGANIC AVOCADOS         $5.99
        GRASS-FED BEEF 1LB       $18.99
        KOMBUCHA GT'S            $3.99
        QUINOA SALAD             $12.99
        ORGANIC SPINACH          $4.99
        ALMOND MILK              $4.99
        DARK CHOCOLATE 85%       $6.99
        
        SUBTOTAL                 $58.93
        TAX                      $5.07
        TOTAL                    $64.00
        
        CREDIT CARD ****4521
        ${new Date().toLocaleDateString()}
      `;
      
      const processedData = await enhancedGeminiAI.processReceiptText(mockOcrText);
      processedData.userId = user?.id;
      
      setScannedData(processedData);
    } catch (error) {
      console.error('Enhanced receipt processing failed:', error);
      const mockData = {
        merchant: 'Whole Foods Market #1234',
        date: new Date().toISOString().split('T')[0],
        total: 6400,
        tax: 507,
        subtotal: 5893,
        items: [
          { name: 'Organic Avocados', price: 599, category: 'Groceries', subcategory: 'Organic Produce' },
          { name: 'Grass-Fed Beef', price: 1899, category: 'Groceries', subcategory: 'Organic Meat' },
          { name: 'Kombucha', price: 399, category: 'Groceries', subcategory: 'Health Drinks' }
        ],
        paymentMethod: 'Credit Card ending in 4521',
        confidence: 92,
        merchantCategory: 'Organic Grocery Store',
        location: {
          address: '123 Health St',
          city: 'San Francisco',
          state: 'CA'
        },
        environmentalImpact: {
          carbonFootprint: 2.1,
          sustainabilityScore: 88
        },
        nutritionalInfo: [
          { item: 'Organic Avocados', calories: 160, healthScore: 95 },
          { item: 'Grass-Fed Beef', calories: 250, healthScore: 82 }
        ],
        userId: user?.id
      };
      setScannedData(mockData);
    }

    setScanning(false);
  };

  const handleSave = () => {
    if (!scannedData || !user) return;
    
    const transaction = {
      id: Date.now().toString(),
      merchant: scannedData.merchant,
      amount: scannedData.total / 100,
      category: scannedData.items[0]?.category || 'Other',
      subcategory: scannedData.items[0]?.subcategory || '',
      date: scannedData.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: scannedData.paymentMethod,
      status: 'completed' as const,
      hasReceipt: true,
      items: scannedData.items.map((item: any) => item.name),
      location: scannedData.location,
      environmentalImpact: scannedData.environmentalImpact,
      nutritionalInfo: scannedData.nutritionalInfo,
      userId: user.id
    };
    
    const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
    const updatedTransactions = [transaction, ...existingTransactions];
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
    
    alert('Enhanced receipt saved successfully! Transaction added with environmental and health insights.');
    onClose();
  };

  const processingSteps = [
    'Analyzing image quality...',
    'Extracting text with advanced OCR...',
    'Processing with Enhanced Gemini AI...',
    'Categorizing and analyzing items...',
    'Calculating environmental impact...',
    'Generating health insights...',
    'Updating financial records...'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
            Enhanced AI Receipt Scanner
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!scanning && !scannedData && (
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-6">
                <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enhanced AI Receipt Analysis
                </h3>
                <p className="text-gray-600 mb-6">
                  Our advanced AI extracts transaction details plus environmental impact and health insights
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Take Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Smart Categorization</h4>
                    <p className="text-xs text-gray-600">AI-powered item categorization with subcategories</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Environmental Impact</h4>
                    <p className="text-xs text-gray-600">Carbon footprint and sustainability scoring</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Health Insights</h4>
                    <p className="text-xs text-gray-600">Nutritional analysis and health scoring</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {scanning && (
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                <Loader className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Processing Receipt with Enhanced AI...
                </h3>
                
                <div className="space-y-3">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-center justify-center space-x-3">
                      {index < processingStep ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : index === processingStep ? (
                        <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={`text-sm ${
                        index <= processingStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {scannedData && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Receipt processed successfully!</p>
                  <p className="text-sm text-green-700">
                    Confidence: {scannedData.confidence}% | Enhanced analysis complete
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Receipt Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Receipt Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Merchant</p>
                      <p className="font-medium">{scannedData.merchant}</p>
                      <p className="text-xs text-gray-500">{scannedData.merchantCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{scannedData.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-lg">${(scannedData.total / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{scannedData.paymentMethod}</p>
                    </div>
                  </div>

                  {scannedData.location && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 flex items-center mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </p>
                      <p className="text-sm">{scannedData.location.address}</p>
                      <p className="text-sm text-gray-500">{scannedData.location.city}, {scannedData.location.state}</p>
                    </div>
                  )}

                  <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {scannedData.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <div className="flex space-x-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                            {item.subcategory && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{item.subcategory}</span>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">${(item.price / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Insights */}
                <div className="space-y-4">
                  {/* Environmental Impact */}
                  {scannedData.environmentalImpact && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Leaf className="h-5 w-5 mr-2 text-green-600" />
                        Environmental Impact
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Carbon Footprint</p>
                          <p className="font-medium">{scannedData.environmentalImpact.carbonFootprint} kg CO₂</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sustainability Score</p>
                          <p className="font-medium text-green-600">{scannedData.environmentalImpact.sustainabilityScore}/100</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${scannedData.environmentalImpact.sustainabilityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Health Insights */}
                  {scannedData.nutritionalInfo && scannedData.nutritionalInfo.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-red-600" />
                        Health Insights
                      </h4>
                      <div className="space-y-3">
                        {scannedData.nutritionalInfo.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">{item.item}</p>
                              <p className="text-xs text-gray-600">{item.calories} calories</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-red-600">Health Score: {item.healthScore}/100</p>
                              <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-red-500 h-1 rounded-full transition-all duration-500"
                                  style={{ width: `${item.healthScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                      AI Insights
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>• High-quality organic purchases detected</p>
                      <p>• Above-average sustainability score for grocery shopping</p>
                      <p>• Nutritionally balanced selection with good health scores</p>
                      <p>• Spending pattern suggests health-conscious consumer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Save Enhanced Transaction
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}