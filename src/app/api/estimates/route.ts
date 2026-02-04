import { NextRequest, NextResponse } from 'next/server';

// Mock database for estimates
let estimates = [
  {
    id: '1',
    title: 'Electrical Rough-in - Building A',
    clientId: '1',
    clientName: 'Metro Builders Inc',
    amount: 45000,
    status: 'draft',
    lineItems: [],
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(estimates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.clientId) {
      return NextResponse.json(
        { message: 'Client is required' },
        { status: 400 }
      );
    }

    // Create new estimate
    const newEstimate = {
      id: String(Date.now()),
      title: body.title || 'Untitled Estimate',
      clientId: body.clientId,
      clientName: body.clientName || 'Unknown Client',
      amount: body.total || 0,
      lineItems: body.line_items || body.lineItems || [],
      status: body.status || 'draft',
      notes: body.notes || '',
      validUntil: body.validUntil || null,
      markupPercentage: body.markup_percentage || 0,
      createdAt: new Date().toISOString(),
    };

    estimates.push(newEstimate);

    return NextResponse.json(newEstimate, { status: 201 });
  } catch (error) {
    console.error('Error creating estimate:', error);
    return NextResponse.json(
      { message: 'Failed to create estimate' },
      { status: 500 }
    );
  }
}
