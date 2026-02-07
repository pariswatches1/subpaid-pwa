import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET - List all call tracking records
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const leadSourceId = searchParams.get('leadSourceId');

    const records = await prisma.callTrackingRecord.findMany({
      where: {
        userId,
        ...(leadSourceId ? { leadSourceId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedRecords = records.map(r => ({
      id: r.id,
      leadSourceId: r.leadSourceId,
      trackingNumber: r.trackingNumber,
      callerNumber: r.callerNumber,
      duration: r.duration,
      recording: r.recording,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      records: formattedRecords,
      total: formattedRecords.length,
    });
  } catch (error) {
    console.error('Error fetching call records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

// POST - Log a new call (webhook endpoint for call tracking services)
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();
    const {
      leadSourceId,
      trackingNumber,
      callerNumber,
      duration,
      recording,
      status,
    } = body;

    if (!trackingNumber || !callerNumber) {
      return NextResponse.json(
        { error: 'trackingNumber and callerNumber are required' },
        { status: 400 }
      );
    }

    const newRecord = await prisma.callTrackingRecord.create({
      data: {
        userId,
        leadSourceId: leadSourceId || null,
        trackingNumber,
        callerNumber,
        duration: duration || 0,
        recording: recording || null,
        status: status || 'completed',
      },
    });

    // Create timeline event if linked to a lead source
    if (leadSourceId) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId,
          userId,
          eventType: 'call',
          entityId: newRecord.id,
          description: `Call received from ${callerNumber}${duration ? ` (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')})` : ''}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      record: {
        id: newRecord.id,
        leadSourceId: newRecord.leadSourceId,
        trackingNumber: newRecord.trackingNumber,
        callerNumber: newRecord.callerNumber,
        duration: newRecord.duration,
        status: newRecord.status,
        createdAt: newRecord.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error logging call:', error);
    return NextResponse.json({ error: 'Failed to log call' }, { status: 500 });
  }
}
