import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/aia-billing/applications - List AIA billing applications
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const applications = await prisma.aIAApplication.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to frontend format
    const formattedApps = applications.map(app => ({
      id: app.id,
      applicationNumber: app.applicationNumber,
      projectName: app.projectName,
      contractSum: Number(app.contractSum),
      changeOrdersTotal: Number(app.changeOrdersTotal),
      completedToDate: Number(app.completedToDate),
      retainagePercentage: Number(app.retainagePercent),
      previousPayments: Number(app.previousPayments),
      currentPaymentDue: Number(app.currentDue),
      periodFrom: app.periodFrom?.toISOString().split('T')[0],
      periodTo: app.periodTo?.toISOString().split('T')[0],
      status: app.status,
      lineItems: app.lineItems,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({ applications: formattedApps });
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

    const projectName = body.project_name || body.projectName;
    const contractSum = parseFloat(body.contract_sum || body.contractSum || body.scheduledValue || '0');
    const changeOrdersTotal = parseFloat(body.change_orders || body.changeOrdersTotal || '0');
    const completedToDate = parseFloat(body.completed_to_date || body.completedToDate || body.totalCompleted || '0');
    const retainagePercent = parseFloat(body.retainage_percentage || body.retainagePercentage || body.retainagePercent || '10');
    const previousPayments = parseFloat(body.previous_payments || body.previousPayments || '0');
    const periodFrom = body.period_from || body.periodFrom ? new Date(body.period_from || body.periodFrom) : null;
    const periodTo = body.period_to || body.periodTo ? new Date(body.period_to || body.periodTo) : null;
    const lineItems = body.line_items || body.lineItems || [];

    // Validation
    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    if (contractSum <= 0) {
      return NextResponse.json({ error: 'Contract sum must be greater than 0' }, { status: 400 });
    }

    // Calculate application number (next in sequence for user)
    const existingApps = await prisma.aIAApplication.count({
      where: { userId },
    });
    const applicationNumber = existingApps + 1;

    // Calculate current due
    const totalContractValue = contractSum + changeOrdersTotal;
    const retainageAmount = completedToDate * (retainagePercent / 100);
    const currentDue = completedToDate - retainageAmount - previousPayments;

    const newApplication = await prisma.aIAApplication.create({
      data: {
        userId,
        applicationNumber,
        projectName,
        contractSum,
        changeOrdersTotal,
        completedToDate,
        retainagePercent,
        previousPayments,
        currentDue: Math.max(0, currentDue),
        periodFrom,
        periodTo,
        status: 'draft',
        lineItems,
      },
    });

    const formattedApp = {
      id: newApplication.id,
      applicationNumber: newApplication.applicationNumber,
      projectName: newApplication.projectName,
      contractSum: Number(newApplication.contractSum),
      changeOrdersTotal: Number(newApplication.changeOrdersTotal),
      completedToDate: Number(newApplication.completedToDate),
      retainagePercentage: Number(newApplication.retainagePercent),
      retainageAmount,
      previousPayments: Number(newApplication.previousPayments),
      currentPaymentDue: Number(newApplication.currentDue),
      totalContractValue,
      periodFrom: newApplication.periodFrom?.toISOString().split('T')[0],
      periodTo: newApplication.periodTo?.toISOString().split('T')[0],
      status: newApplication.status,
      lineItems: newApplication.lineItems,
      createdAt: newApplication.createdAt.toISOString(),
    };

    return NextResponse.json({ application: formattedApp }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application. Please try again.' }, { status: 500 });
  }
}
