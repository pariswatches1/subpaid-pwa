import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, generateEstimateNumber, getMockUserId } from '@/lib/db';

// GET /api/estimates - List all estimates
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let estimates = mockDb.estimates.filter(est => est.userId === userId);

    if (status) {
      estimates = estimates.filter(est => est.status === status);
    }

    // Include client data
    const estimatesWithClient = estimates.map(est => ({
      ...est,
      client: mockDb.clients.find(c => c.id === est.clientId),
    }));

    return NextResponse.json(estimatesWithClient);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json({ error: 'Failed to fetch estimates' }, { status: 500 });
  }
}

// POST /api/estimates - Create new estimate
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
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
    const client = mockDb.clients.find(c => c.id === clientId);
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
    const estimateNumber = generateEstimateNumber(mockDb.estimates.length);

    const newEstimate = {
      id: generateId(),
      estimateNumber,
      clientId,
      userId,
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
      total,
      status: body.status || 'draft',
      validUntil: body.validUntil || body.valid_until || undefined,
      createdAt: new Date().toISOString(),
    };

    mockDb.estimates.push(newEstimate);

    return NextResponse.json(
      { ...newEstimate, client },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create estimate error:', error);
    return NextResponse.json(
      { error: 'Failed to create estimate. Please try again.' },
      { status: 500 }
    );
  }
}
