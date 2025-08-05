import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Users, Plus, Share2,  Crown, UserPlus, } from 'lucide-react';

interface BudgetMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  contribution: number;
}

interface SharedBudget {
  id: string;
  name: string;
  description: string;
  totalBudget: number;
  spent: number;
  members: BudgetMember[];
  categories: {
    name: string;
    budget: number;
    spent: number;
    color: string;
  }[];
  createdAt: string;
  isOwner: boolean;
}

export function CollaborativeBudgets() {
  const { user } = useUser();
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState({
    name: '',
    description: '',
    totalBudget: ''
  });
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'member' as 'member' | 'admin',
    message: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Mock shared budgets data
  const sharedBudgets: SharedBudget[] = [
    {
      id: '1',
      name: 'Family Budget 2024',
      description: 'Monthly household expenses and savings goals',
      totalBudget: 5000,
      spent: 3250,
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'owner',
          contribution: 60
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'admin',
          contribution: 40
        }
      ],
      categories: [
        { name: 'Groceries', budget: 800, spent: 650, color: 'bg-green-500' },
        { name: 'Utilities', budget: 400, spent: 380, color: 'bg-blue-500' },
        { name: 'Entertainment', budget: 300, spent: 220, color: 'bg-purple-500' },
        { name: 'Transportation', budget: 600, spent: 520, color: 'bg-orange-500' }
      ],
      createdAt: '2024-01-01',
      isOwner: true
    },
    {
      id: '2',
      name: 'Vacation Fund',
      description: 'Saving for our summer vacation to Europe',
      totalBudget: 8000,
      spent: 2400,
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'member',
          contribution: 50
        },
        {
          id: '3',
          name: 'Mike Smith',
          email: 'mike@example.com',
          role: 'owner',
          contribution: 50
        }
      ],
      categories: [
        { name: 'Flights', budget: 3000, spent: 0, color: 'bg-blue-500' },
        { name: 'Hotels', budget: 2500, spent: 800, color: 'bg-green-500' },
        { name: 'Activities', budget: 1500, spent: 600, color: 'bg-purple-500' },
        { name: 'Food', budget: 1000, spent: 1000, color: 'bg-orange-500' }
      ],
      createdAt: '2024-01-15',
      isOwner: false
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBudget.name || !newBudget.totalBudget) return;
    
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const budget: SharedBudget = {
        id: Date.now().toString(),
        name: newBudget.name,
        description: newBudget.description,
        totalBudget: parseFloat(newBudget.totalBudget),
        spent: 0,
        members: [{
          id: user.id,
          name: user.fullName || 'You',
          email: user.primaryEmailAddress?.emailAddress || '',
          role: 'owner',
          contribution: 100
        }],
        categories: [],
        createdAt: new Date().toISOString(),
        isOwner: true
      };
      
      // In production, this would be saved to a database
      console.log('Created budget:', budget);
      
      setNewBudget({ name: '', description: '', totalBudget: '' });
      setShowCreateBudget(false);
      alert('Budget created successfully!');
    } catch (error) {
      console.error('Failed to create budget:', error);
      alert('Failed to create budget. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !selectedBudget) return;
    
    setIsSendingInvite(true);
    try {
      // Simulate sending invite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sending invite:', {
        budgetId: selectedBudget,
        email: inviteForm.email,
        role: inviteForm.role,
        message: inviteForm.message
      });
      
      setInviteForm({ email: '', role: 'member', message: '' });
      setShowInviteModal(false);
      setSelectedBudget(null);
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Failed to send invite:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Collaborative Budgets</h2>
            <p className="text-gray-600">Manage shared budgets with family and friends</p>
          </div>
          <button
            onClick={() => setShowCreateBudget(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Shared Budgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sharedBudgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                <p className="text-sm text-gray-600">{budget.description}</p>
              </div>
              {budget.isOwner && (
                <button
                  onClick={() => {
                    setSelectedBudget(budget.id);
                    setShowInviteModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Progress</span>
                <span className="text-sm text-gray-600">
                  ${budget.spent.toLocaleString()} / ${budget.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((budget.spent / budget.totalBudget) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{Math.round((budget.spent / budget.totalBudget) * 100)}% used</span>
                <span>${(budget.totalBudget - budget.spent).toLocaleString()} remaining</span>
              </div>
            </div>

            {/* Members */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Members ({budget.members.length})</h4>
              <div className="space-y-2">
                {budget.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full p-2">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                          {getRoleIcon(member.role)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{member.contribution}%</p>
                      <p className="text-xs text-gray-600">contribution</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
              <div className="space-y-2">
                {budget.categories.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        ${category.spent} / ${category.budget}
                      </span>
                    </div>
                  </div>
                ))}
                {budget.categories.length > 3 && (
                  <p className="text-xs text-gray-500">+{budget.categories.length - 3} more categories</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sharedBudgets.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Shared Budgets Yet</h3>
          <p className="text-gray-600 mb-6">Create your first collaborative budget to start managing finances with others</p>
          <button
            onClick={() => setShowCreateBudget(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Budget
          </button>
        </div>
      )}

      {/* Create Budget Modal */}
      {showCreateBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Shared Budget</h3>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Name</label>
                <input
                  type="text"
                  value={newBudget.name}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Family Budget 2024"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBudget.description}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of this budget..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.totalBudget}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, totalBudget: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000.00"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Budget'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateBudget(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Members</h3>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="friend@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Join our family budget to track expenses together..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSendingInvite}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isSendingInvite ? 'Sending...' : 'Send Invite'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}