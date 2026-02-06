import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';
import { LeadSource } from '@/lib/keyword-types';
import { calculatePaybackSpeedScore } from '@/lib/payback-speed';

// Calculate ROI metrics for a lead source
function calculateMetrics(leadSource: LeadSource) {
  const totalCost = (leadSource.monthlyAdSpend || 0) +
                    (leadSource.seoRetainerCost || 0) +
                    (leadSource.otherCosts || 0);

  const revenue = leadSource.stats.amountPaid || 0;
  const jobsLinked = leadSource.stats.jobsLinked || 0;

  // Calculate ROI
  const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : (revenue > 0 ? Infinity : 0);

  // Calculate cost per job
  const costPerJob = jobsLinked > 0 ? totalCost / jobsLinked : 0;

  // Calculate average days to paid
  const linkedInvoices = mockDb.invoices.filter(
    inv => inv.leadSourceId === leadSource.id && inv.paidAt
  );

  let avgDaysToPaid = 0;
  if (linkedInvoices.length > 0) {
    const totalDays = linkedInvoices.reduce((sum, inv) => {
      if (inv.paidAt && inv.sentAt) {
        const sent = new Date(inv.sentAt).getTime();
        const paid = new Date(inv.paidAt).getTime();
        return sum + (paid - sent) / (1000 * 60 * 60 * 24);
      }
      return sum;
    }, 0);
    avgDaysToPaid = totalDays / linkedInvoices.length;
  }

  return {
    totalCost,
    revenue,
    roi: isFinite(roi) ? Math.round(roi) : (revenue > 0 ? 999 : 0),
    costPerJob: Math.round(costPerJob * 100) / 100,
    avgDaysToPaid: Math.round(avgDaysToPaid),
  };
}

// GET - Get single lead source with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getMockUserId();

  const leadSource = mockDb.leadSources.find(
    ls => ls.id === id && ls.userId === userId
  );

  if (!leadSource) {
    return NextResponse.json(
      { error: 'Lead source not found' },
      { status: 404 }
    );
  }

  // Get linked jobs
  const linkedJobs = mockDb.jobs.filter(j => j.leadSourceId === id);

  // Get linked invoices
  const linkedInvoices = mockDb.invoices.filter(inv => inv.leadSourceId === id);

  // Get timeline events
  const timelineEvents = mockDb.leadTimelineEvents
    .filter(e => e.leadSourceId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Get call tracking records
  const callRecords = mockDb.callTrackingRecords
    .filter(c => c.leadSourceId === id)
    .sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime());

  // Calculate payback score using shared utility
  const paybackScore = calculatePaybackSpeedScore({
    leadSource,
    linkedInvoices,
  });

  return NextResponse.json({
    leadSource: {
      ...leadSource,
      calculatedMetrics: calculateMetrics(leadSource),
    },
    paybackScore,
    linkedJobs,
    linkedInvoices,
    timelineEvents,
    callRecords,
  });
}

// PATCH - Update lead source
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const body = await request.json();

    const leadSourceIndex = mockDb.leadSources.findIndex(
      ls => ls.id === id && ls.userId === userId
    );

    if (leadSourceIndex === -1) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    const leadSource = mockDb.leadSources[leadSourceIndex];

    // Update allowed fields
    if (body.name !== undefined) leadSource.name = body.name;
    if (body.monthlyAdSpend !== undefined) leadSource.monthlyAdSpend = body.monthlyAdSpend;
    if (body.seoRetainerCost !== undefined) leadSource.seoRetainerCost = body.seoRetainerCost;
    if (body.otherCosts !== undefined) leadSource.otherCosts = body.otherCosts;
    if (body.costNotes !== undefined) leadSource.costNotes = body.costNotes;
    if (body.utmParams !== undefined) leadSource.utmParams = body.utmParams;
    if (body.trackingPhoneNumber !== undefined) leadSource.trackingPhoneNumber = body.trackingPhoneNumber;
    if (body.pageUrl !== undefined) leadSource.pageUrl = body.pageUrl;

    return NextResponse.json({
      success: true,
      leadSource: {
        ...leadSource,
        calculatedMetrics: calculateMetrics(leadSource),
      },
    });
  } catch (error) {
    console.error('Error updating lead source:', error);
    return NextResponse.json(
      { error: 'Failed to update lead source' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead source
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getMockUserId();

  const leadSourceIndex = mockDb.leadSources.findIndex(
    ls => ls.id === id && ls.userId === userId
  );

  if (leadSourceIndex === -1) {
    return NextResponse.json(
      { error: 'Lead source not found' },
      { status: 404 }
    );
  }

  // Remove from array
  mockDb.leadSources.splice(leadSourceIndex, 1);

  // Also remove associated timeline events and call records
  mockDb.leadTimelineEvents = mockDb.leadTimelineEvents.filter(
    e => e.leadSourceId !== id
  );
  mockDb.callTrackingRecords = mockDb.callTrackingRecords.filter(
    c => c.leadSourceId !== id
  );

  return NextResponse.json({
    success: true,
    message: 'Lead source deleted',
  });
}
