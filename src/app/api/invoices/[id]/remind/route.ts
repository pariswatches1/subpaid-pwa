import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';

// POST /api/invoices/[id]/remind - Send payment reminder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getMockUserId();
    const { id } = params;
    const body = await request.json();

    const invoice = mockDb.invoices.find(
      inv => inv.id === id && inv.userId === userId
    );

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const client = mockDb.clients.find(c => c.id === invoice.clientId);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { channel = 'email', reminder_type = 'payment_due' } = body;
    const sentChannels: string[] = [];

    // Send email reminder
    if (channel === 'email' || channel === 'both') {
      if (client.email) {
        // In production, send via email service
        // await sendReminderEmail({
        //   to: client.email,
        //   invoiceNumber: invoice.invoiceNumber,
        //   amount: invoice.total,
        //   dueDate: invoice.dueDate
        // });
        sentChannels.push('email');
      }
    }

    // Send SMS reminder
    if (channel === 'sms' || channel === 'both') {
      if (client.phone) {
        // In production, send via SMS service (Twilio, etc.)
        // await sendReminderSMS({
        //   to: client.phone,
        //   message: `Reminder: Invoice ${invoice.invoiceNumber} for $${invoice.total} is due`
        // });
        sentChannels.push('sms');
      }
    }

    if (sentChannels.length === 0) {
      return NextResponse.json(
        { error: 'No valid contact method found for client' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Reminder sent via ${sentChannels.join(' and ')}`,
      channels: sentChannels,
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
