import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/aia-billing/applications - List AIA billing applications
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('project_id') || searchParams.get('projectId');

    let applications = mockDb.aiaApplications.filter(app => app.userId === userId);

    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    if (projectId) {
      applications = applications.filter(app => app.projectId === projectId);
    }

    // Sort by period date descending
    applications.sort((a, b) => new Date(b.periodTo).getTime() - new Date(a.periodTo).getTime());

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// POST /api/aia-billing/applications - Create new AIA G702/G703 application
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const projectId = body.project_id || body.projectId;
    const projectName = body.project_name || body.projectName;
    const periodTo = body.period_to || body.periodTo;
    const scheduledValue = body.scheduled_value || body.scheduledValue;
    const retainagePercentage = body.retainage_percentage || body.retainagePercentage || 10;

    // Validation
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    if (!projectName) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (!periodTo) {
      return NextResponse.json(
        { error: 'Period end date is required' },
        { status: 400 }
      );
    }

    if (!scheduledValue || scheduledValue <= 0) {
      return NextResponse.json(
        { error: 'Scheduled value is required and must be greater than 0' },
        { status: 400 }
      );
    }

    // Get previous applications for this project to calculate previous completed
    const previousApps = mockDb.aiaApplications.filter(
      app => app.projectId === projectId && app.userId === userId && app.status === 'approved'
    );

    const previousCompleted = previousApps.reduce((sum, app) => sum + app.totalCompleted, 0);

    // Calculate application number (next in sequence for this project)
    const projectApps = mockDb.aiaApplications.filter(
      app => app.projectId === projectId && app.userId === userId
    );
    const applicationNumber = projectApps.length + 1;

    // Get work completed and materials stored from request
    const workCompleted = parseFloat(body.work_completed || body.workCompleted || '0');
    const materialsStored = parseFloat(body.materials_stored || body.materialsStored || '0');

    // Calculate AIA values
    const totalCompleted = workCompleted + materialsStored;
    const retainageAmount = totalCompleted * (retainagePercentage / 100);
    const lessRetainage = retainageAmount;
    const lessPreviousCertificates = previousCompleted * (1 - retainagePercentage / 100);
    const currentPaymentDue = totalCompleted - lessRetainage - lessPreviousCertificates;

    const newApplication = {
      id: generateId(),
      applicationNumber,
      projectId,
      projectName,
      periodTo,
      scheduledValue: parseFloat(scheduledValue),
      workCompleted,
      materialsStored,
      totalCompleted,
      retainagePercentage,
      retainageAmount,
      previousCompleted,
      currentPaymentDue: Math.max(0, currentPaymentDue),
      status: 'draft',
      userId,
      createdAt: new Date().toISOString(),
    };

    mockDb.aiaApplications.push(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application. Please try again.' },
      { status: 500 }
    );
  }
}
