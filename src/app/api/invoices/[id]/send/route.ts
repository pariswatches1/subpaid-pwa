import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// POST /api/invoices/[id]/send - Send invoice to client
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.client?.email) {
      return NextResponse.json(
        { error: 'Client email not found' },
        { status: 400 }
      );
    }

    // In production, send email using SendGrid, Resend, etc.
    // await sendInvoiceEmail({
    //   to: invoice.client.email,
    //   subject: `Invoice ${invoice.invoiceNumber}`,
    //   invoiceId: invoice.id,
    //   amount: invoice.total,
    //   dueDate: invoice.dueDate
    // });

    // Update invoice status
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
      include: { client: true },
    });

    // Create timeline event if linked to lead source
    if (invoice.leadSourceId) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId: invoice.leadSourceId,
          userId,
          eventType: 'invoice_sent',
          entityId: invoice.id,
          description: `Invoice ${invoice.invoiceNumber} sent to ${invoice.client.email}`,
          amount: Number(invoice.total),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${invoice.client.email}`,
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
