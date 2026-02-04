import { NextRequest, NextResponse } from 'next/server';

// Mock database for lien guard projects
let projects = [
  {
    id: '1',
    name: 'Highland Shopping Center - Electrical',
    address: '1234 Highland Ave, Denver, CO 80202',
    gcName: 'Metro Builders Inc',
    contractAmount: 125000,
    startDate: '2025-08-01',
    preliminaryNoticeSent: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { message: 'Project name is required' },
        { status: 400 }
      );
    }

    // Create new project
    const newProject = {
      id: String(Date.now()),
      name: body.name,
      address: body.address || '',
      gcName: body.gc_name || body.gcName || '',
      contractAmount: body.contract_amount || body.contractAmount || 0,
      startDate: body.start_date || body.startDate || new Date().toISOString().split('T')[0],
      preliminaryNoticeSent: body.preliminary_notice_sent || false,
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Failed to add project' },
      { status: 500 }
    );
  }
}
