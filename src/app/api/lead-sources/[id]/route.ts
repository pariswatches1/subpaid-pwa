import { NextRequest, NextResponse } from 'next/server';
import { mockDb, getMockUserId } from '@/lib/db';
import { LeadSource } from '@/lib/keyword-types';

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

// Calculate Payback Speed Score
function calculatePaybackScore(leadSource: LeadSource) {
  const metrics = calculateMetrics(leadSource);
  let score = 0;

  // Conversion Rate scoring (25 points max)
  // We'll use jobs per source as a proxy since we don't track leads separately
  if (leadSource.stats.jobsLinked >= 10) score += 25;
  else if (leadSource.stats.jobsLinked >= 5) score += 20;
  else if (leadSource.stats.jobsLinked >= 3) score += 15;
  else if (leadSource.stats.jobsLinked >= 1) score += 10;

  // Avg Invoice Amount scoring (25 points max)
  const avgInvoice = leadSource.stats.invoicesLinked > 0
    ? leadSource.stats.amountPaid / leadSource.stats.invoicesLinked
    : 0;
  if (avgInvoice >= 10000) score += 25;
  else if (avgInvoice >= 5000) score += 20;
  else if (avgInvoice >= 2500) score += 15;
  else if (avgInvoice >= 1000) score += 10;
  else if (avgInvoice > 0) score += 5;

  // Speed to Payment scoring (25 points max)
  if (metrics.avgDaysToPaid > 0) {
    if (metrics.avgDaysToPaid <= 14) score += 25;
    else if (metrics.avgDaysToPaid <= 21) score += 20;
    else if (metrics.avgDaysToPaid <= 30) score += 15;
    else if (metrics.avgDaysToPaid <= 45) score += 10;
    else score += 5;
  }

  // ROI scoring (25 points max)
  if (metrics.roi >= 300) score += 25;
  else if (metrics.roi >= 200) score += 20;
  else if (metrics.roi >= 100) score += 15;
  else if (metrics.roi >= 50) score += 10;
  else if (metrics.roi > 0) score += 5;

  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';
  else if (score >= 20) grade = 'D';
  else grade = 'F';

  return {
    leadSourceId: leadSource.id,
    userId: leadSource.userId,
    conversionRate: leadSource.stats.jobsLinked,  // Simplified for now
    avgInvoiceAmount: avgInvoice,
    avgDaysToPaid: metrics.avgDaysToPaid,
    latePaymentRate: 0,  // Would need payment terms tracking
    score,
    grade,
    trend: 'stable' as const,
    calculatedAt: new Date().toISOString(),
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

  return NextResponse.json({
    leadSource: {
      ...leadSource,
      calculatedMetrics: calculateMetrics(leadSource),
    },
    paybackScore: calculatePaybackScore(leadSource),
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
