import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET - Get timeline events for a lead source
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    // Verify lead source exists and belongs to user
    const leadSource = await prisma.leadSource.findFirst({
      where: { id, userId },
    });

    if (!leadSource) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    // Get timeline events
    const events = await prisma.leadTimelineEvent.findMany({
      where: { leadSourceId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      events,
      total: events.length,
    });
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline events' },
      { status: 500 }
    );
  }
}

// POST - Add a manual timeline event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const body = await request.json();

    // Verify lead source exists
    const leadSource = await prisma.leadSource.findFirst({
      where: { id, userId },
    });

    if (!leadSource) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    const { eventType, entityId, description, amount } = body;

    if (!eventType || !description) {
      return NextResponse.json(
        { error: 'eventType and description are required' },
        { status: 400 }
      );
    }

    // Validate eventType is one of the allowed values
    const validEventTypes = [
      'call', 'form_submit', 'job_created', 'estimate_sent',
      'estimate_accepted', 'invoice_sent', 'reminder_sent',
      'sam_call', 'payment_received'
    ];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `Invalid eventType. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount is non-negative if provided
    if (amount !== undefined && amount < 0) {
      return NextResponse.json(
        { error: 'Amount cannot be negative' },
        { status: 400 }
      );
    }

    const newEvent = await prisma.leadTimelineEvent.create({
      data: {
        leadSourceId: id,
        userId,
        eventType,
        entityId: entityId || null,
        description,
        amount: amount || null,
      },
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json(
      { error: 'Failed to create timeline event' },
      { status: 500 }
    );
  }
}
