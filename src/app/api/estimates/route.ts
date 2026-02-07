import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, generateEstimateNumber } from '@/lib/auth';

// GET /api/estimates - List all estimates
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { userId };
    if (status) where.status = status;

    const estimates = await prisma.estimate.findMany({
      where,
      include: {
        client: true,
        job: true,
        leadSource: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(estimates);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json({ error: 'Failed to fetch estimates' }, { status: 500 });
  }
}

// POST /api/estimates - Create new estimate
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const clientId = body.client_id || body.clientId;
    const lineItems = body.line_items || body.lineItems || [];

    // Validation
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId },
    });
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    const subtotal = lineItems.reduce(
      (sum: number, item: { quantity?: number; rate?: number; amount?: number; total?: number }) =>
        sum + (item.quantity && item.rate ? item.quantity * item.rate : item.amount || item.total || 0),
      0
    );
    const markupPercentage = body.markup_percentage || body.markup || 0;
    const markup = subtotal * (markupPercentage / 100);
    const total = body.total || subtotal + markup;

    // Generate estimate number
    const estimateNumber = generateEstimateNumber();

    const newEstimate = await prisma.estimate.create({
      data: {
        userId,
        clientId,
        jobId: body.jobId || null,
        leadSourceId: body.leadSourceId || null,
        estimateNumber,
        title: body.title || 'Untitled Estimate',
        lineItems: lineItems.map((item: { description?: string; quantity?: number; rate?: number; amount?: number }, index: number) => ({
          id: String(index + 1),
          description: item.description || '',
          quantity: item.quantity || 1,
          rate: item.rate || item.amount || 0,
          total: item.quantity && item.rate ? item.quantity * item.rate : item.amount || 0,
        })),
        subtotal,
        markup,
        tax: body.tax || 0,
        total,
        status: body.status || 'draft',
        validUntil: body.validUntil || body.valid_until ? new Date(body.validUntil || body.valid_until) : null,
        notes: body.notes || null,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(newEstimate, { status: 201 });
  } catch (error) {
    console.error('Create estimate error:', error);
    return NextResponse.json(
      { error: 'Failed to create estimate. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH /api/estimates - Update estimate status
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const { id, status, acceptedAt, sentAt, convertedToInvoiceId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Estimate ID is required' },
        { status: 400 }
      );
    }

    // Find estimate and verify ownership
    const estimate = await prisma.estimate.findFirst({
      where: { id, userId },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (acceptedAt) updateData.acceptedAt = new Date(acceptedAt);
    if (sentAt) updateData.sentAt = new Date(sentAt);
    if (convertedToInvoiceId) updateData.convertedToInvoiceId = convertedToInvoiceId;

    const updatedEstimate = await prisma.estimate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      estimate: updatedEstimate,
    });
  } catch (error) {
    console.error('Update estimate error:', error);
    return NextResponse.json(
      { error: 'Failed to update estimate' },
      { status: 500 }
    );
  }
}
