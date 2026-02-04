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

    const { title, name, clientId, description, startDate, endDate, status, address, budget } = body;
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
      description: description || '',
      startDate: startDate || null,
      endDate: endDate || null,
      address: address || '',
      budget: budget ? parseFloat(budget) : null,
      status: status || 'active',
      userId,
      createdAt: new Date().toISOString(),
    };

    mockDb.jobs.push(newJob);

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
