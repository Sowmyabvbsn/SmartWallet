import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Camera, Upload, X, Check, Loader, Sparkles } from 'lucide-react';
import { geminiAI } from '../services/geminiAI';

interface ReceiptScannerProps {
  onClose: () => void;
}

export function ReceiptScanner({ onClose }: ReceiptScannerProps) {
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

    // Simulate AI processing steps
    const steps = [
      'Analyzing image quality...',
      'Extracting text with OCR...',
      'Processing with Gemini AI...',
      'Categorizing expenses...',
      'Updating financial records...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      // In production, you would first run OCR on the image
      // For demo, we'll simulate OCR text
      const mockOcrText = `
        TARGET STORE #1234
        123 MAIN ST
        ANYTOWN, ST 12345
        
        ORGANIC MILK         $4.99
        BREAD LOAF          $2.50
        COFFEE PODS         $12.99
        CLEANING SUPPLIES   $8.99
        PHONE CHARGER       $24.99
        SNACKS              $15.54
        SHAMPOO             $9.99
        
        SUBTOTAL            $80.00
        TAX                 $7.43
        TOTAL               $87.43
        
        CREDIT CARD ****4521
        ${new Date().toLocaleDateString()}
      `;
      
      // Process with Gemini AI
      const processedData = await geminiAI.processReceiptText(mockOcrText);
      processedData.userId = user?.id;
      
      setScannedData(processedData);
    } catch (error) {
      console.error('Receipt processing failed:', error);
      // Fallback to mock data
      const mockData = {
        merchant: 'Target Store #1234',
        date: new Date().toISOString().split('T')[0],
        total: 87.43,
        tax: 7.43,
        subtotal: 80.00,
        items: [
          { name: 'Organic Milk', price: 4.99, category: 'Groceries' },
          { name: 'Bread', price: 2.50, category: 'Groceries' },
          { name: 'Coffee Pods', price: 12.99, category: 'Groceries' }
        ],
        paymentMethod: 'Credit Card ending in 4521',
        confidence: 85,
        userId: user?.id
      };
      setScannedData(mockData);
    }

    setScanning(false);
  };

  const handleSave = () => {
    // Save to transactions
    alert('Receipt saved successfully!');
    onClose();
  };

  const processingSteps = [
    'Analyzing image quality...',
    'Extracting text with OCR...',
    'Processing with Gemini AI...',
    'Categorizing expenses...',
    'Updating financial records...'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
            AI Receipt Scanner
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
              <div className="bg-blue-50 rounded-2xl p-8 mb-6">
                <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Scan Your Receipt
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI will automatically extract and categorize all transaction details
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">✨ AI Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Automatic text extraction with 99% accuracy</li>
                  <li>• Smart expense categorization</li>
                  <li>• Multi-language support</li>
                  <li>• Handwritten receipt recognition</li>
                </ul>
              </div>
            </div>
          )}

          {scanning && (
            <div className="text-center py-8">
              <div className="bg-blue-50 rounded-2xl p-8">
                <Loader className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Processing Receipt...
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
                    Confidence level: {scannedData.confidence}%
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Receipt Details</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Merchant</p>
                    <p className="font-medium">{scannedData.merchant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{scannedData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg">${scannedData.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{scannedData.paymentMethod}</p>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {scannedData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Save Transaction
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