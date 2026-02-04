import { NextRequest, NextResponse } from 'next/server';

// Mock database for AIA billing applications
let applications = [
  {
    id: '1',
    applicationNumber: 1,
    projectId: '1',
    projectName: 'Highland Shopping Center',
    periodTo: '2026-01-31',
    scheduledValue: 125000,
    workCompleted: 65000,
    materialsStored: 0,
    retainagePercentage: 10,
    status: 'draft',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.project_id && !body.projectId) {
      return NextResponse.json(
        { message: 'Project is required' },
        { status: 400 }
      );
    }

    // Generate application number
    const applicationNumber = applications.length + 1;

    // Create new application
    const newApplication = {
      id: String(Date.now()),
      applicationNumber: body.application_number || body.applicationNumber || applicationNumber,
      projectId: body.project_id || body.projectId,
      projectName: body.projectName || 'Unknown Project',
      periodTo: body.period_to || body.periodTo || new Date().toISOString().split('T')[0],
      scheduledValue: body.scheduled_value || body.scheduledValue || 0,
      workCompleted: body.work_completed || body.workCompleted || 0,
      materialsStored: body.materials_stored || body.materialsStored || 0,
      retainagePercentage: body.retainage_percentage || body.retainagePercentage || 10,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    applications.push(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { message: 'Failed to create application' },
      { status: 500 }
    );
  }
}
