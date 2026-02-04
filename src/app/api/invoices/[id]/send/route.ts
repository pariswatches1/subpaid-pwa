import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';

// POST /api/invoices/[id]/send - Send invoice to client
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getMockUserId();
    const { id } = params;

    const invoiceIndex = mockDb.invoices.findIndex(
      inv => inv.id === id && inv.userId === userId
    );

    if (invoiceIndex === -1) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = mockDb.invoices[invoiceIndex];
    const client = mockDb.clients.find(c => c.id === invoice.clientId);

    if (!client?.email) {
      return NextResponse.json(
        { error: 'Client email not found' },
        { status: 400 }
      );
    }

    // In production, send email using SendGrid, Resend, etc.
    // await sendInvoiceEmail({
    //   to: client.email,
    //   subject: `Invoice ${invoice.invoiceNumber}`,
    //   invoiceId: invoice.id,
    //   amount: invoice.total,
    //   dueDate: invoice.dueDate
    // });

    // Update invoice status
    mockDb.invoices[invoiceIndex] = {
      ...invoice,
      status: 'sent',
      sentAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${client.email}`,
      invoice: mockDb.invoices[invoiceIndex],
    });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
