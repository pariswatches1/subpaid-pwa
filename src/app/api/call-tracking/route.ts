import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET - List all call tracking records
export async function GET(request: NextRequest) {
  const userId = getMockUserId();
  const { searchParams } = new URL(request.url);
  const leadSourceId = searchParams.get('leadSourceId');

  let records = mockDb.callTrackingRecords.filter(c => c.userId === userId);

  if (leadSourceId) {
    records = records.filter(c => c.leadSourceId === leadSourceId);
  }

  // Sort by date descending
  records.sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime());

  return NextResponse.json({
    records,
    total: records.length,
  });
}

// POST - Log a new call (webhook endpoint for call tracking services)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leadSourceId,
      trackingNumber,
      callerNumber,
      callDate,
      duration,
      answered,
      outcome,
    } = body;

    if (!leadSourceId || !trackingNumber || !callerNumber) {
      return NextResponse.json(
        { error: 'leadSourceId, trackingNumber, and callerNumber are required' },
        { status: 400 }
      );
    }

    // Verify lead source exists
    const leadSource = mockDb.leadSources.find(ls => ls.id === leadSourceId);
    if (!leadSource) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    const userId = leadSource.userId;

    const newRecord = {
      id: generateId(),
      leadSourceId,
      userId,
      trackingNumber,
      callerNumber,
      callDate: callDate || new Date().toISOString(),
      duration: duration || 0,
      answered: answered !== undefined ? answered : false,  // Default to false for safety
      outcome: outcome || undefined,
      createdAt: new Date().toISOString(),
    };

    mockDb.callTrackingRecords.push(newRecord);

    // Update lead source stats
    leadSource.stats.totalCalls = (leadSource.stats.totalCalls || 0) + 1;
    if (newRecord.answered) {
      leadSource.stats.callsAnswered = (leadSource.stats.callsAnswered || 0) + 1;
    }

    // Create timeline event
    const timelineEvent = {
      id: generateId(),
      leadSourceId,
      userId,
      eventType: 'call' as const,
      entityId: newRecord.id,
      description: `Call ${answered ? 'answered' : 'missed'} from ${callerNumber}${duration ? ` (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')})` : ''}`,
      createdAt: newRecord.callDate,
    };
    mockDb.leadTimelineEvents.push(timelineEvent);

    return NextResponse.json({
      success: true,
      record: newRecord,
    });
  } catch (error) {
    console.error('Error logging call:', error);
    return NextResponse.json(
      { error: 'Failed to log call' },
      { status: 500 }
    );
  }
}

// PATCH - Update call record (e.g., convert to job)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, outcome, convertedToJobId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Call record ID is required' },
        { status: 400 }
      );
    }

    const userId = getMockUserId();
    const recordIndex = mockDb.callTrackingRecords.findIndex(
      c => c.id === id && c.userId === userId
    );

    if (recordIndex === -1) {
      return NextResponse.json(
        { error: 'Call record not found' },
        { status: 404 }
      );
    }

    const record = mockDb.callTrackingRecords[recordIndex];

    if (outcome !== undefined) record.outcome = outcome;
    if (convertedToJobId !== undefined) record.convertedToJobId = convertedToJobId;

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('Error updating call record:', error);
    return NextResponse.json(
      { error: 'Failed to update call record' },
      { status: 500 }
    );
  }
}
