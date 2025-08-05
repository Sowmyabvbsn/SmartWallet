export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  paymentMethod?: string;
  notes?: string;
  userId: string;
}

export interface BillReminder {
  id: string;
  billId: string;
  reminderDate: string;
  type: 'due_soon' | 'overdue' | 'paid';
  message: string;
}

class BillReminderService {
  async getBills(userId: string): Promise<Bill[]> {
    // Mock bills data
    const mockBills: Bill[] = [
      {
        id: '1',
        name: 'Electric Bill',
        amount: 120.45,
        dueDate: '2024-01-25',
        category: 'Utilities',
        isRecurring: true,
        frequency: 'monthly',
        isPaid: false,
        paymentMethod: 'Auto-pay',
        userId
      },
      {
        id: '2',
        name: 'Internet Service',
        amount: 79.99,
        dueDate: '2024-01-28',
        category: 'Utilities',
        isRecurring: true,
        frequency: 'monthly',
        isPaid: true,
        paymentMethod: 'Credit Card',
        userId
      },
      {
        id: '3',
        name: 'Car Insurance',
        amount: 145.50,
        dueDate: '2024-02-15',
        category: 'Insurance',
        isRecurring: true,
        frequency: 'monthly',
        isPaid: false,
        paymentMethod: 'Bank Transfer',
        userId
      },
      {
        id: '4',
        name: 'Netflix Subscription',
        amount: 15.99,
        dueDate: '2024-01-20',
        category: 'Entertainment',
        isRecurring: true,
        frequency: 'monthly',
        isPaid: true,
        paymentMethod: 'Credit Card',
        userId
      },
      {
        id: '5',
        name: 'Property Tax',
        amount: 1250.00,
        dueDate: '2024-03-31',
        category: 'Taxes',
        isRecurring: true,
        frequency: 'quarterly',
        isPaid: false,
        notes: 'Q1 2024 payment',
        userId
      }
    ];

    return mockBills;
  }

  async getUpcomingReminders(userId: string): Promise<BillReminder[]> {
    const bills = await this.getBills(userId);
    const today = new Date();
    const reminders: BillReminder[] = [];

    bills.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (!bill.isPaid) {
        if (daysDiff < 0) {
          reminders.push({
            id: `reminder_${bill.id}`,
            billId: bill.id,
            reminderDate: bill.dueDate,
            type: 'overdue',
            message: `${bill.name} is ${Math.abs(daysDiff)} days overdue`
          });
        } else if (daysDiff <= 3) {
          reminders.push({
            id: `reminder_${bill.id}`,
            billId: bill.id,
            reminderDate: bill.dueDate,
            type: 'due_soon',
            message: `${bill.name} is due in ${daysDiff} days`
          });
        }
      }
    });

    return reminders;
  }

  async markBillAsPaid(billId: string): Promise<void> {
    // Get all bills and update the specific one
    const allBills = JSON.parse(localStorage.getItem('bills_all') || '[]');
    const updatedBills = allBills.map((bill: Bill) => 
      bill.id === billId ? { ...bill, isPaid: true } : bill
    );
    localStorage.setItem('bills_all', JSON.stringify(updatedBills));
    console.log(`Marked bill ${billId} as paid`);
  }

  async addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
    const newBill: Bill = {
      ...bill,
      id: `bill_${Date.now()}`
    };
    
    // Save bill to localStorage (in production, this would be an API call)
    const existingBills = await this.getBills(bill.userId);
    const updatedBills = [...existingBills, newBill];
    localStorage.setItem(`bills_${bill.userId}`, JSON.stringify(updatedBills));
    
    console.log('Added new bill:', newBill);
    return newBill;
  }

  async setupNotifications(): Promise<void> {
    // Request notification permissions
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  async sendNotification(reminder: BillReminder): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Smart Wallet - Bill Reminder', {
        body: reminder.message,
        icon: '/favicon.ico',
        tag: reminder.id
      });
    }
  }

  async scheduleReminders(userId: string): Promise<void> {
    const reminders = await this.getUpcomingReminders(userId);
    
    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.reminderDate);
      const now = new Date();
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      
      if (timeUntilReminder > 0) {
        setTimeout(() => {
          this.sendNotification(reminder);
        }, timeUntilReminder);
      }
    });
  }
}

export const billReminderService = new BillReminderService();