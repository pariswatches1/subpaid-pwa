import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/time-entries - List time entries
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let entries = mockDb.timeEntries.filter(entry => entry.userId === userId);

    if (jobId) {
      entries = entries.filter(entry => entry.jobId === jobId);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      entries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    }

    // Include job data
    const entriesWithJob = entries.map(entry => ({
      ...entry,
      job: mockDb.jobs.find(j => j.id === entry.jobId),
    }));

    // Sort by date descending
    entriesWithJob.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(entriesWithJob);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

// POST /api/time-entries - Create time entry
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
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
    const job = mockDb.jobs.find(j => j.id === jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const newEntry = {
      id: generateId(),
      jobId,
      userId,
      date,
      hours: parseFloat(hours),
      description: body.description || '',
      billable: body.billable !== false,
      createdAt: new Date().toISOString(),
    };

    mockDb.timeEntries.push(newEntry);

    return NextResponse.json(
      { ...newEntry, job },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry. Please try again.' },
      { status: 500 }
    );
  }
}
