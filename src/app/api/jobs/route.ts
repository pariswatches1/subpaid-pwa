import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/jobs - List all jobs
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    let jobs = mockDb.jobs.filter(job => job.userId === userId);

    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }
    if (clientId) {
      jobs = jobs.filter(job => job.clientId === clientId);
    }

    // Include client data
    const jobsWithClient = jobs.map(job => ({
      ...job,
      client: mockDb.clients.find(c => c.id === job.clientId),
    }));

    return NextResponse.json(jobsWithClient);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const { title, name, clientId, description, startDate, endDate, status, leadSourceId } = body;
    const jobTitle = title || name;

    // Validation
    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title/name is required' },
        { status: 400 }
      );
    }
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = mockDb.clients.find(c => c.id === clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const newJob = {
      id: generateId(),
      title: jobTitle,
      clientId,
      description: description || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: status || 'active',
      userId,
      createdAt: new Date().toISOString(),
      leadSourceId: leadSourceId || undefined,
    };

    mockDb.jobs.push(newJob);

    // If leadSourceId is provided, create a timeline event
    if (leadSourceId) {
      const timelineEvent = {
        id: generateId(),
        leadSourceId,
        userId,
        eventType: 'job_created' as const,
        entityId: newJob.id,
        description: `Job created: "${jobTitle}"`,
        createdAt: new Date().toISOString(),
      };
      mockDb.leadTimelineEvents.push(timelineEvent);

      // Update lead source stats (only if user owns the lead source)
      const leadSource = mockDb.leadSources.find(ls => ls.id === leadSourceId && ls.userId === userId);
      if (leadSource) {
        leadSource.stats.jobsLinked = (leadSource.stats.jobsLinked || 0) + 1;
      }
    }

    return NextResponse.json(
      { ...newJob, client },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Failed to create job. Please try again.' },
      { status: 500 }
    );
  }
}
