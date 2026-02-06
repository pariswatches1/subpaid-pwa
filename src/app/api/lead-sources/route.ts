import { NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';
import { LeadSource } from '@/lib/keyword-types';

// Calculate ROI metrics for a lead source
function calculateMetrics(leadSource: LeadSource) {
  const totalCost = (leadSource.monthlyAdSpend || 0) +
                    (leadSource.seoRetainerCost || 0) +
                    (leadSource.otherCosts || 0);

  const revenue = leadSource.stats.amountPaid || 0;
  const jobsLinked = leadSource.stats.jobsLinked || 0;

  // Calculate ROI: (revenue - cost) / cost * 100
  const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : (revenue > 0 ? Infinity : 0);

  // Calculate cost per job
  const costPerJob = jobsLinked > 0 ? totalCost / jobsLinked : 0;

  // Calculate average days to paid (from invoices linked to this source)
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
    roi: isFinite(roi) ? Math.round(roi) : (revenue > 0 ? 999 : 0), // Cap at 999% for display
    costPerJob: Math.round(costPerJob * 100) / 100,
    avgDaysToPaid: Math.round(avgDaysToPaid),
  };
}

// GET - List all lead sources with calculated metrics
export async function GET() {
  const userId = getMockUserId();
  const leadSources = mockDb.leadSources.filter((ls) => ls.userId === userId);

  // Add calculated metrics to each lead source
  const enrichedLeadSources = leadSources.map(ls => ({
    ...ls,
    calculatedMetrics: calculateMetrics(ls),
  }));

  return NextResponse.json({
    leadSources: enrichedLeadSources,
    total: leadSources.length,
  });
}

// POST - Create a new lead source
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      keywords,
      generatedContent,
      filters,
      pageUrl,
      // New cost tracking fields
      monthlyAdSpend,
      seoRetainerCost,
      otherCosts,
      costNotes,
      // UTM parameters
      utmParams,
      // Tracking phone number
      trackingPhoneNumber,
    } = body;

    if (!name || !keywords || !generatedContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userId = getMockUserId();

    const newLeadSource: LeadSource = {
      id: generateId(),
      userId,
      name,
      keywords,
      generatedContent,
      pageUrl: pageUrl || undefined,
      filters,
      createdAt: new Date().toISOString(),
      // Cost tracking
      monthlyAdSpend: monthlyAdSpend || undefined,
      seoRetainerCost: seoRetainerCost || undefined,
      otherCosts: otherCosts || undefined,
      costNotes: costNotes || undefined,
      // UTM tracking
      utmParams: utmParams || undefined,
      // Tracking phone
      trackingPhoneNumber: trackingPhoneNumber || undefined,
      stats: {
        jobsLinked: 0,
        invoicesLinked: 0,
        amountPaid: 0,
        totalCalls: 0,
        callsAnswered: 0,
      },
    };

    mockDb.leadSources.push(newLeadSource);

    return NextResponse.json({
      success: true,
      leadSource: {
        ...newLeadSource,
        calculatedMetrics: calculateMetrics(newLeadSource),
      },
    });
  } catch (error) {
    console.error('Error creating lead source:', error);
    return NextResponse.json(
      { error: 'Failed to create lead source' },
      { status: 500 }
    );
  }
}

// PATCH - Update an existing lead source (for cost tracking updates)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      monthlyAdSpend,
      seoRetainerCost,
      otherCosts,
      costNotes,
      utmParams,
      trackingPhoneNumber,
      pageUrl,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead source ID is required' },
        { status: 400 }
      );
    }

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

    // Update the lead source
    const leadSource = mockDb.leadSources[leadSourceIndex];

    if (name !== undefined) leadSource.name = name;
    if (monthlyAdSpend !== undefined) leadSource.monthlyAdSpend = monthlyAdSpend;
    if (seoRetainerCost !== undefined) leadSource.seoRetainerCost = seoRetainerCost;
    if (otherCosts !== undefined) leadSource.otherCosts = otherCosts;
    if (costNotes !== undefined) leadSource.costNotes = costNotes;
    if (utmParams !== undefined) leadSource.utmParams = utmParams;
    if (trackingPhoneNumber !== undefined) leadSource.trackingPhoneNumber = trackingPhoneNumber;
    if (pageUrl !== undefined) leadSource.pageUrl = pageUrl;

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
