import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// Calculate ROI metrics for a lead source
async function calculateMetrics(leadSource: any, userId: string) {
  const totalCost = Number(leadSource.monthlyAdSpend || 0) +
                    Number(leadSource.seoRetainerCost || 0) +
                    Number(leadSource.otherCosts || 0);

  const revenue = Number(leadSource.amountPaid || 0);
  const jobsLinked = leadSource.jobsLinked || 0;

  // Calculate ROI: (revenue - cost) / cost * 100
  const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : (revenue > 0 ? Infinity : 0);

  // Calculate cost per job
  const costPerJob = jobsLinked > 0 ? totalCost / jobsLinked : 0;

  // Calculate average days to paid (from invoices linked to this source)
  const linkedInvoices = await prisma.invoice.findMany({
    where: {
      leadSourceId: leadSource.id,
      userId,
      paidAt: { not: null },
      sentAt: { not: null },
    },
  });

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

// GET - List all lead sources with calculated metrics
export async function GET() {
  try {
    const userId = await getUserId();

    const leadSources = await prisma.leadSource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Add calculated metrics to each lead source
    const enrichedLeadSources = await Promise.all(
      leadSources.map(async (ls) => ({
        ...ls,
        calculatedMetrics: await calculateMetrics(ls, userId),
      }))
    );

    return NextResponse.json({
      leadSources: enrichedLeadSources,
      total: leadSources.length,
    });
  } catch (error) {
    console.error('Error fetching lead sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead sources' },
      { status: 500 }
    );
  }
}

// POST - Create a new lead source
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const {
      name,
      keywords,
      generatedContent,
      pageUrl,
      monthlyAdSpend,
      seoRetainerCost,
      otherCosts,
      costNotes,
      utmSource,
      utmMedium,
      utmCampaign,
      trackingPhoneNumber,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate cost fields are non-negative
    if ((monthlyAdSpend !== undefined && monthlyAdSpend < 0) ||
        (seoRetainerCost !== undefined && seoRetainerCost < 0) ||
        (otherCosts !== undefined && otherCosts < 0)) {
      return NextResponse.json(
        { error: 'Cost values cannot be negative' },
        { status: 400 }
      );
    }

    const newLeadSource = await prisma.leadSource.create({
      data: {
        userId,
        name,
        keywords: keywords || [],
        generatedContent: generatedContent || null,
        pageUrl: pageUrl || null,
        monthlyAdSpend: monthlyAdSpend || null,
        seoRetainerCost: seoRetainerCost || null,
        otherCosts: otherCosts || null,
        costNotes: costNotes || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        trackingPhoneNumber: trackingPhoneNumber || null,
      },
    });

    return NextResponse.json({
      success: true,
      leadSource: {
        ...newLeadSource,
        calculatedMetrics: await calculateMetrics(newLeadSource, userId),
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

// PATCH - Update an existing lead source
export async function PATCH(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const {
      id,
      name,
      monthlyAdSpend,
      seoRetainerCost,
      otherCosts,
      costNotes,
      utmSource,
      utmMedium,
      utmCampaign,
      trackingPhoneNumber,
      pageUrl,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead source ID is required' },
        { status: 400 }
      );
    }

    // Validate cost fields are non-negative
    if ((monthlyAdSpend !== undefined && monthlyAdSpend < 0) ||
        (seoRetainerCost !== undefined && seoRetainerCost < 0) ||
        (otherCosts !== undefined && otherCosts < 0)) {
      return NextResponse.json(
        { error: 'Cost values cannot be negative' },
        { status: 400 }
      );
    }

    // Verify lead source exists and belongs to user
    const existingSource = await prisma.leadSource.findFirst({
      where: { id, userId },
    });

    if (!existingSource) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (monthlyAdSpend !== undefined) updateData.monthlyAdSpend = monthlyAdSpend;
    if (seoRetainerCost !== undefined) updateData.seoRetainerCost = seoRetainerCost;
    if (otherCosts !== undefined) updateData.otherCosts = otherCosts;
    if (costNotes !== undefined) updateData.costNotes = costNotes;
    if (utmSource !== undefined) updateData.utmSource = utmSource;
    if (utmMedium !== undefined) updateData.utmMedium = utmMedium;
    if (utmCampaign !== undefined) updateData.utmCampaign = utmCampaign;
    if (trackingPhoneNumber !== undefined) updateData.trackingPhoneNumber = trackingPhoneNumber;
    if (pageUrl !== undefined) updateData.pageUrl = pageUrl;

    const updatedSource = await prisma.leadSource.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      leadSource: {
        ...updatedSource,
        calculatedMetrics: await calculateMetrics(updatedSource, userId),
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
