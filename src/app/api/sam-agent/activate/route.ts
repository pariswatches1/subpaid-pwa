import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

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
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Find and update invoice
    const invoice = await prisma.invoice.findFirst({
      where: { id: invId, userId },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Enable autopilot on invoice
    await prisma.invoice.update({
      where: { id: invId },
      data: { autopilotEnabled: true },
    });

    // Schedule SAM calls
    const scheduledCalls: string[] = [];
    if (shouldSchedule) {
      for (const day of days) {
        const callDate = new Date();
        callDate.setDate(callDate.getDate() + day);

        await prisma.sAMAgentCall.create({
          data: {
            userId,
            callId: `call-${invId}-${day}`,
            callerPhone: invoice.client?.phone || null,
            callerName: invoice.client?.name || null,
            status: 'scheduled',
            summary: `Follow-up call for invoice ${invoice.invoiceNumber}`,
            intent: 'payment_reminder',
          },
        });

        scheduledCalls.push(callDate.toISOString());

        // In production, schedule with voice service (Twilio, Vapi, etc.)
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
    return NextResponse.json({ error: 'Failed to activate SAM Agent' }, { status: 500 });
  }
}

// GET /api/sam-agent/activate - Get SAM Agent calls
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();

    const calls = await prisma.sAMAgentCall.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCalls = calls.map(call => ({
      id: call.id,
      callId: call.callId,
      callerPhone: call.callerPhone,
      callerName: call.callerName,
      duration: call.duration,
      transcript: call.transcript,
      summary: call.summary,
      intent: call.intent,
      leadCreated: call.leadCreated,
      leadId: call.leadId,
      status: call.status,
      createdAt: call.createdAt.toISOString(),
    }));

    return NextResponse.json({ calls: formattedCalls });
  } catch (error) {
    console.error('Error fetching SAM calls:', error);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }
}
