import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET - Get timeline events for a lead source
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getMockUserId();

  // Verify lead source exists and belongs to user
  const leadSource = mockDb.leadSources.find(
    ls => ls.id === id && ls.userId === userId
  );

  if (!leadSource) {
    return NextResponse.json(
      { error: 'Lead source not found' },
      { status: 404 }
    );
  }

  // Get timeline events
  const events = mockDb.leadTimelineEvents
    .filter(e => e.leadSourceId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    events,
    total: events.length,
  });
}

// POST - Add a manual timeline event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const body = await request.json();

    // Verify lead source exists
    const leadSource = mockDb.leadSources.find(
      ls => ls.id === id && ls.userId === userId
    );

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

    const newEvent = {
      id: generateId(),
      leadSourceId: id,
      userId,
      eventType,
      entityId: entityId || undefined,
      description,
      amount: amount || undefined,
      createdAt: new Date().toISOString(),
    };

    mockDb.leadTimelineEvents.push(newEvent);

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
