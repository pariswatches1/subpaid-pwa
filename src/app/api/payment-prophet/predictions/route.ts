import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';

// GET /api/payment-prophet/predictions - Get payment predictions
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();

    // Get unpaid invoices
    const unpaidInvoices = mockDb.invoices.filter(
      inv => inv.userId === userId && ['sent', 'viewed', 'overdue'].includes(inv.status)
    );

    // Calculate predictions for each invoice
    const predictions = unpaidInvoices.map(invoice => {
      const client = mockDb.clients.find(c => c.id === invoice.clientId);

      // Get client payment history
      const paidInvoices = mockDb.invoices.filter(
        inv => inv.clientId === invoice.clientId && inv.status === 'paid' && inv.sentAt && inv.paidAt
      );

      // Calculate average payment time
      let avgPaymentDays = 30;
      if (paidInvoices.length > 0) {
        const totalDays = paidInvoices.reduce((sum, inv) => {
          const sent = new Date(inv.sentAt!);
          const paid = new Date(inv.paidAt!);
          return sum + Math.round((paid.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
        avgPaymentDays = Math.round(totalDays / paidInvoices.length);
      } else if (client?.payScore) {
        // Estimate from PayScore
        avgPaymentDays = client.payScore >= 85 ? 20 : client.payScore >= 70 ? 28 : client.payScore >= 50 ? 38 : 50;
      }

      // Calculate risk score
      const dueDate = new Date(invoice.dueDate);
      const today = new Date();
      const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let riskLevel = 'low';
      let confidence = 90;
      const factors: string[] = [];

      if (daysUntilDue < 0) {
        riskLevel = 'high';
        confidence = 70 + Math.min(20, Math.abs(daysUntilDue));
        factors.push(`Invoice is ${Math.abs(daysUntilDue)} days overdue`);
      } else if (avgPaymentDays > 45) {
        riskLevel = 'high';
        confidence = 75;
        factors.push(`History of late payments (avg ${avgPaymentDays} days)`);
      } else if (avgPaymentDays > 30) {
        riskLevel = 'medium';
        confidence = 85;
        factors.push(`Moderate payment history (avg ${avgPaymentDays} days)`);
      } else {
        factors.push(`Good payment history (avg ${avgPaymentDays} days)`);
      }

      if (invoice.total > 10000) {
        factors.push('Large invoice amount');
        if (riskLevel === 'low') confidence -= 5;
      }

      if (client?.payScore && client.payScore >= 85) {
        factors.push(`Excellent PayScore (${client.payScore})`);
      } else if (client?.payScore && client.payScore < 60) {
        factors.push(`Low PayScore (${client.payScore})`);
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Predict payment date
      const sentDate = invoice.sentAt ? new Date(invoice.sentAt) : new Date(invoice.createdAt);
      const expectedPaymentDate = new Date(sentDate);
      expectedPaymentDate.setDate(expectedPaymentDate.getDate() + avgPaymentDays);

      const daysFromNow = Math.round((expectedPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Generate recommendation
      let recommendation = 'No action needed - payment expected on time';
      if (riskLevel === 'high') {
        recommendation = 'Activate SAM Voice Agent for immediate follow-up';
      } else if (riskLevel === 'medium') {
        recommendation = 'Send friendly reminder 3 days before due date';
      } else if (daysUntilDue <= 7) {
        recommendation = 'Due date approaching - consider sending a reminder';
      }

      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: client?.name || 'Unknown Client',
        clientId: invoice.clientId,
        amount: invoice.total,
        dueDate: invoice.dueDate,
        status: invoice.status,
        prediction: {
          expectedDate: expectedPaymentDate.toISOString().split('T')[0],
          daysFromNow: Math.max(0, daysFromNow),
          confidence,
          factors,
          recommendation,
          risk: riskLevel,
        },
      };
    });

    // Sort by risk level (high first) then by due date
    predictions.sort((a, b) => {
      const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      if (riskOrder[a.prediction.risk] !== riskOrder[b.prediction.risk]) {
        return riskOrder[a.prediction.risk] - riskOrder[b.prediction.risk];
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Error generating predictions:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
