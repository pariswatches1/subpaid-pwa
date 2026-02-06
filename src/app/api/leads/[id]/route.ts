import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';

// GET /api/leads/[id] - Get single lead with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getMockUserId();

  const lead = mockDb.leads.find(
    l => l.id === id && l.userId === userId
  );

  if (!lead) {
    return NextResponse.json(
      { error: 'Lead not found' },
      { status: 404 }
    );
  }

  // Get linked lead source if exists
  let leadSource = null;
  if (lead.leadSourceId) {
    leadSource = mockDb.leadSources.find(
      ls => ls.id === lead.leadSourceId && ls.userId === userId
    );
  }

  // Get converted job if exists
  let convertedJob = null;
  if (lead.convertedToJobId) {
    convertedJob = mockDb.jobs.find(
      j => j.id === lead.convertedToJobId && j.userId === userId
    );
  }

  // Get converted estimate if exists
  let convertedEstimate = null;
  if (lead.convertedToEstimateId) {
    convertedEstimate = mockDb.estimates.find(
      e => e.id === lead.convertedToEstimateId && e.userId === userId
    );
  }

  // Get converted invoice if exists
  let convertedInvoice = null;
  if (lead.convertedToInvoiceId) {
    convertedInvoice = mockDb.invoices.find(
      i => i.id === lead.convertedToInvoiceId && i.userId === userId
    );
  }

  // Get call tracking record if exists
  let callRecord = null;
  if (lead.callTrackingRecordId) {
    callRecord = mockDb.callTrackingRecords.find(
      c => c.id === lead.callTrackingRecordId
    );
  }

  return NextResponse.json({
    lead,
    leadSource,
    convertedJob,
    convertedEstimate,
    convertedInvoice,
    callRecord,
  });
}

// PATCH /api/leads/[id] - Update lead
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const body = await request.json();

    const leadIndex = mockDb.leads.findIndex(
      l => l.id === id && l.userId === userId
    );

    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const lead = mockDb.leads[leadIndex];

    // Update allowed fields
    if (body.name !== undefined) lead.name = body.name;
    if (body.email !== undefined) lead.email = body.email;
    if (body.phone !== undefined) lead.phone = body.phone;
    if (body.company !== undefined) lead.company = body.company;
    if (body.description !== undefined) lead.description = body.description;
    if (body.location !== undefined) lead.location = body.location;
    if (body.trade !== undefined) lead.trade = body.trade;
    if (body.estimatedValue !== undefined) lead.estimatedValue = body.estimatedValue;

    // Validate and update status
    if (body.status !== undefined) {
      const validStatuses = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      lead.status = body.status;
    }

    // Validate and update priority
    if (body.priority !== undefined) {
      const validPriorities = ['hot', 'warm', 'cold'];
      if (!validPriorities.includes(body.priority)) {
        return NextResponse.json(
          { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
          { status: 400 }
        );
      }
      lead.priority = body.priority;
    }

    if (body.lastContactedAt !== undefined) {
      lead.lastContactedAt = body.lastContactedAt;
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getMockUserId();

  const leadIndex = mockDb.leads.findIndex(
    l => l.id === id && l.userId === userId
  );

  if (leadIndex === -1) {
    return NextResponse.json(
      { error: 'Lead not found' },
      { status: 404 }
    );
  }

  // Remove from array
  mockDb.leads.splice(leadIndex, 1);

  return NextResponse.json({
    success: true,
    message: 'Lead deleted',
  });
}
