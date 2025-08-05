import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Calendar, Bell, Plus, Check, AlertCircle, CreditCard } from 'lucide-react';
import { billReminderService, Bill, BillReminder } from '../services/billReminderService';

export function BillManager() {
  const { user } = useUser();
  const [bills, setBills] = useState<Bill[]>([]);
  const [reminders, setReminders] = useState<BillReminder[]>([]);
  const [showAddBill, setShowAddBill] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Utilities',
    isRecurring: false,
    frequency: 'monthly' as const,
    paymentMethod: '',
    notes: ''
  });

  useEffect(() => {
    loadBillsData();
    setupNotifications();
  }, [user]);

  const loadBillsData = async () => {
    if (!user) return;
    
    try {
      const [billsData, remindersData] = await Promise.all([
        billReminderService.getBills(user.id),
        billReminderService.getUpcomingReminders(user.id)
      ]);
      
      setBills(billsData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupNotifications = async () => {
    await billReminderService.setupNotifications();
    if (user) {
      billReminderService.scheduleReminders(user.id);
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBill.name || !newBill.amount || !newBill.dueDate) return;
    
    const bill: Bill = {
      id: `bill_${Date.now()}`,
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      category: newBill.category,
      isRecurring: newBill.isRecurring,
      frequency: newBill.isRecurring ? newBill.frequency : undefined,
      isPaid: false,
      paymentMethod: newBill.paymentMethod || undefined,
      notes: newBill.notes || undefined,
      userId: user.id
    };
    
    try {
      await billReminderService.addBill(bill);
      setBills(prev => [...prev, bill]);
      setNewBill({
        name: '',
        amount: '',
        dueDate: '',
        category: 'Utilities',
        isRecurring: false,
        frequency: 'monthly',
        paymentMethod: '',
        notes: ''
      });
      setShowAddBill(false);
      loadBillsData(); // Refresh data
    } catch (error) {
      console.error('Failed to add bill:', error);
      alert('Failed to add bill. Please try again.');
    }
  };

  const handleMarkAsPaid = async (billId: string) => {
    await billReminderService.markBillAsPaid(billId);
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, isPaid: true } : bill
    ));
    loadBillsData(); // Refresh reminders
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Utilities': 'bg-blue-100 text-blue-800',
      'Insurance': 'bg-green-100 text-green-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Taxes': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (bill: Bill) => {
    if (bill.isPaid) return 'text-green-600';
    
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'text-red-600';
    if (daysDiff <= 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const upcomingBills = bills.filter(bill => !bill.isPaid);
  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header with Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bill Manager</h2>
            <p className="text-gray-600">Track and manage your recurring bills</p>
          </div>
          <button
            onClick={() => setShowAddBill(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Bill</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Upcoming Bills</p>
            <p className="text-2xl font-bold text-gray-900">{upcomingBills.length}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Total Amount Due</p>
            <p className="text-2xl font-bold text-gray-900">${totalUpcoming.toFixed(2)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Active Reminders</p>
            <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
          </div>
        </div>
      </div>

      {/* Urgent Reminders */}
      {reminders.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Urgent Reminders
          </h3>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    reminder.type === 'overdue' ? 'bg-red-100' : 'bg-orange-100'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      reminder.type === 'overdue' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{reminder.message}</p>
                    <p className="text-sm text-gray-600">Due: {reminder.reminderDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAsPaid(reminder.billId)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Mark Paid
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Bills</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {bills.map((bill) => (
            <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{bill.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(bill.category)}`}>
                      {bill.category}
                    </span>
                    {bill.isRecurring && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {bill.frequency}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Due: {bill.dueDate}</p>
                    {bill.paymentMethod && <p>Payment: {bill.paymentMethod}</p>}
                    {bill.notes && <p>Notes: {bill.notes}</p>}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-gray-900">
                    ${bill.amount.toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className={`text-sm font-medium ${getStatusColor(bill)}`}>
                      {bill.isPaid ? 'Paid' : 'Pending'}
                    </p>
                    {!bill.isPaid && (
                      <button
                        onClick={() => handleMarkAsPaid(bill.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bills.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills added yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first recurring bill</p>
            <button
              onClick={() => setShowAddBill(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Your First Bill
            </button>
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      {showAddBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Bill</h3>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Name</label>
                <input
                  type="text"
                  value={newBill.name}
                  onChange={(e) => setNewBill(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Electric Bill"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBill.amount}
                  onChange={(e) => setNewBill(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newBill.category}
                  onChange={(e) => setNewBill(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Utilities">Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Taxes">Taxes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method (Optional)</label>
                <input
                  type="text"
                  value={newBill.paymentMethod}
                  onChange={(e) => setNewBill(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Auto-pay, Credit Card"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="recurring" 
                  checked={newBill.isRecurring}
                  onChange={(e) => setNewBill(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="rounded" 
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">Recurring bill</label>
              </div>
              
              {newBill.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select 
                    value={newBill.frequency}
                    onChange={(e) => setNewBill(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={newBill.notes}
                  onChange={(e) => setNewBill(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Add Bill
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBill(false)}
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