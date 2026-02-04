import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// POST /api/sam-agent/activate - Activate SAM Agent for invoice
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const { invoiceId, invoice_id, scheduleCall, schedule_call, followUpDays, follow_up_days } = body;
    const invId = invoiceId || invoice_id;
    const shouldSchedule = scheduleCall || schedule_call;
    const days = followUpDays || follow_up_days || [7, 14, 21];

    if (!invId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Find invoice
    const invoiceIndex = mockDb.invoices.findIndex(
      inv => inv.id === invId && inv.userId === userId
    );

    if (invoiceIndex === -1) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = mockDb.invoices[invoiceIndex];
    const client = mockDb.clients.find(c => c.id === invoice.clientId);

    // Enable autopilot on invoice
    mockDb.invoices[invoiceIndex] = {
      ...invoice,
      autopilotEnabled: true,
    };

    // Schedule SAM calls
    const scheduledCalls: string[] = [];
    if (shouldSchedule) {
      for (const day of days) {
        const callDate = new Date();
        callDate.setDate(callDate.getDate() + day);

        const call = {
          id: generateId(),
          invoiceId: invId,
          callStatus: 'scheduled',
          callDate: callDate.toISOString(),
          createdAt: new Date().toISOString(),
        };

        mockDb.samAgentCalls.push(call);
        scheduledCalls.push(callDate.toISOString());

        // In production, schedule with voice service (Twilio, Vapi, etc.)
        // await scheduleVoiceCall({
        //   phoneNumber: client?.phone,
        //   scheduledTime: callDate,
        //   invoiceId: invId,
        //   script: 'payment_reminder'
        // });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'SAM Agent activated',
      autopilotEnabled: true,
      scheduledCalls: scheduledCalls.length,
      nextCallDate: scheduledCalls[0] || null,
    });
  } catch (error) {
    console.error('Error activating SAM Agent:', error);
    return NextResponse.json(
      { error: 'Failed to activate SAM Agent' },
      { status: 500 }
    );
  }
}
