import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// POST /api/invoices/[id]/remind - Send payment reminder
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const body = await request.json();

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { channel = 'email', reminder_type = 'payment_due' } = body;
    const sentChannels: string[] = [];

    // Send email reminder
    if (channel === 'email' || channel === 'both') {
      if (invoice.client.email) {
        // In production, send via email service
        // await sendReminderEmail({
        //   to: invoice.client.email,
        //   invoiceNumber: invoice.invoiceNumber,
        //   amount: invoice.total,
        //   dueDate: invoice.dueDate
        // });
        sentChannels.push('email');
      }
    }

    // Send SMS reminder
    if (channel === 'sms' || channel === 'both') {
      if (invoice.client.phone) {
        // In production, send via SMS service (Twilio, etc.)
        // await sendReminderSMS({
        //   to: invoice.client.phone,
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

    // Update reminder count
    await prisma.invoice.update({
      where: { id },
      data: {
        remindersSent: { increment: 1 },
        lastReminderAt: new Date(),
      },
    });

    // Create timeline event if linked to lead source
    if (invoice.leadSourceId) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId: invoice.leadSourceId,
          userId,
          eventType: 'reminder_sent',
          entityId: invoice.id,
          description: `Payment reminder sent for Invoice ${invoice.invoiceNumber} via ${sentChannels.join(' and ')}`,
        },
      });
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
