import { NextRequest, NextResponse } from 'next/server';

// Mock database for jobs
let jobs = [
  {
    id: '1',
    name: 'Downtown Office Tower - Electrical',
    clientId: '1',
    clientName: 'ABC General Contractors',
    address: '123 Main St, Denver, CO 80202',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    budget: 125000,
    description: 'Complete electrical installation for 10-story office building',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.clientId) {
      return NextResponse.json(
        { message: 'Job name and client are required' },
        { status: 400 }
      );
    }

    // Create new job
    const newJob = {
      id: String(Date.now()),
      name: body.name,
      clientId: body.clientId,
      clientName: body.clientName || 'Unknown Client',
      address: body.address || '',
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      budget: body.budget || null,
      description: body.description || '',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    jobs.push(newJob);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { message: 'Failed to create job' },
      { status: 500 }
    );
  }
}
