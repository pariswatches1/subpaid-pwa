import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/time-entries - List time entries
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { userId };
    if (jobId) where.jobId = jobId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const entries = await prisma.timeEntry.findMany({
      where,
      include: {
        job: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

// POST /api/time-entries - Create time entry
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const jobId = body.job_id || body.jobId;
    const hours = body.hours;
    const date = body.date || new Date().toISOString().split('T')[0];

    // Validation
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job is required' },
        { status: 400 }
      );
    }

    if (!hours || parseFloat(hours) <= 0) {
      return NextResponse.json(
        { error: 'Valid hours are required (must be greater than 0)' },
        { status: 400 }
      );
    }

    if (parseFloat(hours) > 24) {
      return NextResponse.json(
        { error: 'Hours cannot exceed 24 per day' },
        { status: 400 }
      );
    }

    // Verify job exists
    const job = await prisma.job.findFirst({
      where: { id: jobId, userId },
    });
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const newEntry = await prisma.timeEntry.create({
      data: {
        userId,
        jobId,
        date: new Date(date),
        hours: parseFloat(hours),
        description: body.description || null,
        rate: body.rate ? parseFloat(body.rate) : null,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH /api/time-entries - Update time entry
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const { id, hours, description, date, rate } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Time entry ID is required' },
        { status: 400 }
      );
    }

    // Verify entry exists and belongs to user
    const existingEntry = await prisma.timeEntry.findFirst({
      where: { id, userId },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (hours !== undefined) updateData.hours = parseFloat(hours);
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (rate !== undefined) updateData.rate = rate ? parseFloat(rate) : null;

    const updatedEntry = await prisma.timeEntry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      timeEntry: updatedEntry,
    });
  } catch (error) {
    console.error('Error updating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to update time entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/time-entries - Delete time entry
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Time entry ID is required' },
        { status: 400 }
      );
    }

    // Verify entry exists and belongs to user
    const existingEntry = await prisma.timeEntry.findFirst({
      where: { id, userId },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    await prisma.timeEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Time entry deleted',
    });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete time entry' },
      { status: 500 }
    );
  }
}
