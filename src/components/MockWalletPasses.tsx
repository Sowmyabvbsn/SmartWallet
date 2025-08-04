import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Wallet, Plus, QrCode, Download, Calendar, CreditCard, Gift, Users, User } from 'lucide-react';
import { mockWalletService, MockWalletPass } from '../services/mockWalletService';

export function MockWalletPasses() {
  const { user } = useUser();
  const [passes, setPasses] = useState<MockWalletPass[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'loyalty' | 'membership' | 'event'>('loyalty');

  useEffect(() => {
    loadPasses();
  }, [user]);

  const loadPasses = async () => {
    if (!user) return;
    
    try {
      const userPasses = await mockWalletService.getUserPasses(user.id);
      setPasses(userPasses);
    } catch (error) {
      console.error('Error loading passes:', error);
    }
  };

  const handleCreateLoyaltyPass = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      // Mock account balance
      const accountBalance = 2450.75;
      const pass = await mockWalletService.createLoyaltyPass(user.id, accountBalance);
      setPasses(prev => [...prev, pass]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create loyalty pass:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateMembershipPass = async (details: any) => {
    setIsCreating(true);
    try {
      const pass = await mockWalletService.createMembershipPass(details);
      setPasses(prev => [...prev, pass]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create membership pass:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateEventTicket = async (details: any) => {
    setIsCreating(true);
    try {
      const pass = await mockWalletService.createEventTicket(details);
      setPasses(prev => [...prev, pass]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create event ticket:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadPass = (pass: MockWalletPass) => {
    const passFile = mockWalletService.generatePassFile(pass);
    const link = document.createElement('a');
    link.href = passFile;
    link.download = `${pass.title.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const getPassIcon = (type: string) => {
    switch (type) {
      case 'loyalty':
        return <Gift className="h-6 w-6" />;
      case 'membership':
        return <Users className="h-6 w-6" />;
      case 'event':
        return <Calendar className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Digital Wallet Passes</h2>
            <p className="text-gray-600">Create and manage your digital passes</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Pass</span>
          </button>
        </div>

        {/* Passes Grid */}
        {passes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {passes.map((pass) => (
              <div key={pass.id} className="relative">
                <div 
                  className="rounded-2xl p-6 text-white shadow-lg"
                  style={{ backgroundColor: pass.backgroundColor }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{pass.title}</h3>
                      <p className="text-sm opacity-90">{pass.subtitle}</p>
                    </div>
                    <div className="text-white opacity-80">
                      {getPassIcon(pass.type)}
                    </div>
                  </div>
                  
                  {pass.balance && (
                    <div className="mb-4">
                      <p className="text-sm opacity-90">Balance</p>
                      <p className="text-2xl font-bold">{pass.balance}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {pass.fields.slice(0, 4).map((field, index) => (
                      <div key={index}>
                        <p className="text-xs opacity-75">{field.label}</p>
                        <p className="text-sm font-medium">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <p className="text-xs font-medium">{pass.barcode}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <QrCode className="h-6 w-6 text-gray-800" />
                    </div>
                  </div>
                </div>
                
                {/* Download Button */}
                <button
                  onClick={() => handleDownloadPass(pass)}
                  className="absolute top-4 right-4 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Passes Yet</h3>
            <p className="text-gray-600 mb-6">Create your first digital pass to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Pass
            </button>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Gift className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Loyalty Cards</h3>
            <p className="text-sm text-gray-600">Create loyalty cards with balance tracking</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Membership Cards</h3>
            <p className="text-sm text-gray-600">Digital membership cards with QR codes</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Event Tickets</h3>
            <p className="text-sm text-gray-600">Digital event tickets and boarding passes</p>
          </div>
        </div>
      </div>

      {/* Create Pass Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Pass</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pass Type</label>
                <select
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="loyalty">Loyalty Card</option>
                  <option value="membership">Membership Card</option>
                  <option value="event">Event Ticket</option>
                </select>
              </div>

              {createType === 'loyalty' && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Create a Smart Wallet loyalty card with your current balance
                  </p>
                  <button
                    onClick={handleCreateLoyaltyPass}
                    disabled={isCreating}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {isCreating ? 'Creating...' : 'Create Loyalty Card'}
                  </button>
                </div>
              )}

              {createType === 'membership' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleCreateMembershipPass({
                    title: formData.get('title'),
                    subtitle: formData.get('subtitle'),
                    memberNumber: formData.get('memberNumber'),
                    expiryDate: formData.get('expiryDate')
                  });
                }}>
                  <div className="space-y-3">
                    <input
                      name="title"
                      placeholder="Organization Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="subtitle"
                      placeholder="Membership Type"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="memberNumber"
                      placeholder="Member Number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="expiryDate"
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
                    >
                      {isCreating ? 'Creating...' : 'Create Membership Card'}
                    </button>
                  </div>
                </form>
              )}

              {createType === 'event' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleCreateEventTicket({
                    name: formData.get('name'),
                    venue: formData.get('venue'),
                    date: formData.get('date'),
                    time: formData.get('time'),
                    seat: formData.get('seat')
                  });
                }}>
                  <div className="space-y-3">
                    <input
                      name="name"
                      placeholder="Event Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="venue"
                      placeholder="Venue"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="date"
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="time"
                      type="time"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      name="seat"
                      placeholder="Seat (optional)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
                    >
                      {isCreating ? 'Creating...' : 'Create Event Ticket'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}