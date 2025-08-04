// Free alternative to Google Wallet - Mock digital wallet service
export interface MockWalletPass {
  id: string;
  type: 'loyalty' | 'membership' | 'coupon' | 'event';
  title: string;
  subtitle: string;
  balance?: string;
  barcode: string;
  backgroundColor: string;
  textColor: string;
  fields: Array<{
    label: string;
    value: string;
  }>;
  isActive: boolean;
  createdAt: string;
}

class MockWalletService {
  private passes: MockWalletPass[] = [];

  async createLoyaltyPass(userId: string, accountBalance: number): Promise<MockWalletPass> {
    // Simulate pass creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pass: MockWalletPass = {
      id: `pass_${userId}_${Date.now()}`,
      type: 'loyalty',
      title: 'Smart Wallet',
      subtitle: 'Premium Member',
      balance: `$${accountBalance.toFixed(2)}`,
      barcode: `SW${userId.slice(-6).toUpperCase()}${Date.now().toString().slice(-4)}`,
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      fields: [
        { label: 'Account Balance', value: `$${accountBalance.toFixed(2)}` },
        { label: 'Member Since', value: new Date().getFullYear().toString() },
        { label: 'Status', value: 'Premium' },
        { label: 'Points', value: Math.floor(accountBalance * 10).toString() }
      ],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.passes.push(pass);
    return pass;
  }

  async createMembershipPass(details: {
    title: string;
    subtitle: string;
    memberNumber: string;
    expiryDate: string;
  }): Promise<MockWalletPass> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const pass: MockWalletPass = {
      id: `pass_membership_${Date.now()}`,
      type: 'membership',
      title: details.title,
      subtitle: details.subtitle,
      barcode: `MEM${details.memberNumber}`,
      backgroundColor: '#10B981',
      textColor: '#FFFFFF',
      fields: [
        { label: 'Member Number', value: details.memberNumber },
        { label: 'Expires', value: details.expiryDate },
        { label: 'Status', value: 'Active' }
      ],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.passes.push(pass);
    return pass;
  }

  async createEventTicket(eventDetails: {
    name: string;
    venue: string;
    date: string;
    time: string;
    seat?: string;
  }): Promise<MockWalletPass> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const pass: MockWalletPass = {
      id: `pass_event_${Date.now()}`,
      type: 'event',
      title: eventDetails.name,
      subtitle: eventDetails.venue,
      barcode: `EVT${Date.now().toString().slice(-8)}`,
      backgroundColor: '#8B5CF6',
      textColor: '#FFFFFF',
      fields: [
        { label: 'Date', value: eventDetails.date },
        { label: 'Time', value: eventDetails.time },
        { label: 'Venue', value: eventDetails.venue },
        ...(eventDetails.seat ? [{ label: 'Seat', value: eventDetails.seat }] : [])
      ],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.passes.push(pass);
    return pass;
  }

  async getUserPasses(userId: string): Promise<MockWalletPass[]> {
    // Filter passes for user (in a real app, you'd have user association)
    return this.passes.filter(pass => pass.isActive);
  }

  async updatePassBalance(passId: string, newBalance: number): Promise<void> {
    const pass = this.passes.find(p => p.id === passId);
    if (pass && pass.type === 'loyalty') {
      pass.balance = `$${newBalance.toFixed(2)}`;
      const balanceField = pass.fields.find(f => f.label === 'Account Balance');
      if (balanceField) {
        balanceField.value = `$${newBalance.toFixed(2)}`;
      }
    }
  }

  async deactivatePass(passId: string): Promise<boolean> {
    const pass = this.passes.find(p => p.id === passId);
    if (pass) {
      pass.isActive = false;
      return true;
    }
    return false;
  }

  // Generate a downloadable pass (mock implementation)
  generatePassFile(pass: MockWalletPass): string {
    // In a real implementation, this would generate a .pkpass file
    // For now, return a data URL with pass information
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: `pass.smartwallet.${pass.type}`,
      serialNumber: pass.id,
      teamIdentifier: 'SMARTWALLET',
      organizationName: 'Smart Wallet',
      description: pass.title,
      logoText: 'Smart Wallet',
      backgroundColor: pass.backgroundColor,
      foregroundColor: pass.textColor,
      generic: {
        primaryFields: [
          {
            key: 'balance',
            label: pass.fields[0]?.label || 'Value',
            value: pass.fields[0]?.value || pass.balance || ''
          }
        ],
        secondaryFields: pass.fields.slice(1, 3).map((field, index) => ({
          key: `field_${index}`,
          label: field.label,
          value: field.value
        })),
        auxiliaryFields: pass.fields.slice(3).map((field, index) => ({
          key: `aux_${index}`,
          label: field.label,
          value: field.value
        }))
      },
      barcode: {
        message: pass.barcode,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      }
    };

    return `data:application/json;base64,${btoa(JSON.stringify(passData, null, 2))}`;
  }
}

export const mockWalletService = new MockWalletService();