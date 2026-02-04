import { NextRequest, NextResponse } from 'next/server';

// Mock database for time entries
let timeEntries = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Jose Martinez',
    jobId: '1',
    jobName: 'Riverside Apartments - Electrical',
    date: '2026-02-02',
    hours: 8,
    description: 'Electrical rough-in work',
    billable: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(timeEntries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.job_id && !body.jobId) {
      return NextResponse.json(
        { message: 'Job is required' },
        { status: 400 }
      );
    }

    if (!body.hours || body.hours <= 0) {
      return NextResponse.json(
        { message: 'Valid hours are required' },
        { status: 400 }
      );
    }

    // Create new time entry
    const newEntry = {
      id: String(Date.now()),
      employeeId: body.employee_id || body.employeeId || '1',
      employeeName: body.employeeName || 'Current User',
      jobId: body.job_id || body.jobId,
      jobName: body.jobName || 'Unknown Job',
      date: body.date || new Date().toISOString().split('T')[0],
      hours: parseFloat(body.hours),
      description: body.description || '',
      billable: body.billable !== false,
      createdAt: new Date().toISOString(),
    };

    timeEntries.push(newEntry);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { message: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}
