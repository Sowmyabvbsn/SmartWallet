import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'pdf' | 'csv';
  dateRange: {
    start: string;
    end: string;
  };
  categories?: string[];
  includeCharts?: boolean;
}

class ExportService {
  async exportTransactionsPDF(transactions: any[], options: ExportOptions): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Smart Wallet - Transaction Report', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Period: ${options.dateRange.start} to ${options.dateRange.end}`, 20, 45);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    
    // Summary
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    pdf.text(`Total Transactions: ${transactions.length}`, 20, 70);
    pdf.text(`Total Amount: $${total.toFixed(2)}`, 20, 80);
    
    // Transactions table
    let yPosition = 100;
    pdf.setFontSize(10);
    
    // Table headers
    pdf.text('Date', 20, yPosition);
    pdf.text('Merchant', 60, yPosition);
    pdf.text('Category', 120, yPosition);
    pdf.text('Amount', 160, yPosition);
    
    yPosition += 10;
    
    transactions.forEach((transaction, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.text(transaction.date, 20, yPosition);
      pdf.text(transaction.merchant.substring(0, 20), 60, yPosition);
      pdf.text(transaction.category, 120, yPosition);
      pdf.text(`$${transaction.amount.toFixed(2)}`, 160, yPosition);
      
      yPosition += 8;
    });
    
    pdf.save(`smart-wallet-report-${Date.now()}.pdf`);
  }

  async exportTransactionsCSV(transactions: any[]): Promise<void> {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Payment Method', 'Status'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        `"${t.merchant}"`,
        t.category,
        t.amount,
        `"${t.paymentMethod}"`,
        t.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-wallet-transactions-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  async exportAnalyticsReport(analyticsData: any): Promise<void> {
    const pdf = new jsPDF();
    
    // Capture charts if available
    const chartElements = document.querySelectorAll('.recharts-wrapper');
    let yPosition = 30;
    
    pdf.setFontSize(20);
    pdf.text('Smart Wallet - Analytics Report', 20, yPosition);
    yPosition += 30;
    
    // Add summary data
    pdf.setFontSize(12);
    pdf.text(`Financial Score: ${analyticsData.financialScore || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    pdf.text(`Monthly Spending: $${analyticsData.monthlySpending || 'N/A'}`, 20, yPosition);
    yPosition += 15;
    
    pdf.text(`Savings Rate: ${analyticsData.savingsRate || 'N/A'}%`, 20, yPosition);
    yPosition += 30;
    
    // Capture and add charts
    for (let i = 0; i < chartElements.length && i < 2; i++) {
      try {
        const canvas = await html2canvas(chartElements[i] as HTMLElement);
        const imgData = canvas.toDataURL('image/png');
        
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.addImage(imgData, 'PNG', 20, yPosition, 160, 80);
        yPosition += 90;
      } catch (error) {
        console.error('Error capturing chart:', error);
      }
    }
    
    pdf.save(`smart-wallet-analytics-${Date.now()}.pdf`);
  }
}

export const exportService = new ExportService();