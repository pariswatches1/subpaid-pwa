import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';

// GET /api/jobs/[id] - Get single job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getMockUserId();
    const { id } = params;

    const job = mockDb.jobs.find(j => j.id === id && j.userId === userId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const client = mockDb.clients.find(c => c.id === job.clientId);
    const timeEntries = mockDb.timeEntries.filter(t => t.jobId === id);
    const invoices = mockDb.invoices.filter(i => i.jobId === id);

    return NextResponse.json({
      ...job,
      client,
      timeEntries,
      invoices,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getMockUserId();
    const { id } = params;
    const body = await request.json();

    const jobIndex = mockDb.jobs.findIndex(j => j.id === id && j.userId === userId);

    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Update job with provided fields
    mockDb.jobs[jobIndex] = {
      ...mockDb.jobs[jobIndex],
      ...body,
      id, // Prevent ID from being changed
      userId, // Prevent userId from being changed
    };

    return NextResponse.json(mockDb.jobs[jobIndex]);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getMockUserId();
    const { id } = params;

    const jobIndex = mockDb.jobs.findIndex(j => j.id === id && j.userId === userId);

    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    mockDb.jobs.splice(jobIndex, 1);

    return NextResponse.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
