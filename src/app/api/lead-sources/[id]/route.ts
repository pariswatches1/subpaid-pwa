import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// Calculate ROI metrics for a lead source
async function calculateMetrics(leadSource: any, userId: string) {
  const totalCost = Number(leadSource.monthlyAdSpend || 0) +
                    Number(leadSource.seoRetainerCost || 0) +
                    Number(leadSource.otherCosts || 0);

  const revenue = Number(leadSource.amountPaid || 0);
  const jobsLinked = leadSource.jobsLinked || 0;

  // Calculate ROI
  const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : (revenue > 0 ? Infinity : 0);

  // Calculate cost per job
  const costPerJob = jobsLinked > 0 ? totalCost / jobsLinked : 0;

  // Calculate average days to paid
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

// GET - Get single lead source with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const leadSource = await prisma.leadSource.findFirst({
      where: { id, userId },
    });

    if (!leadSource) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    // Get linked jobs
    const linkedJobs = await prisma.job.findMany({
      where: { leadSourceId: id, userId },
      include: { client: true },
    });

    // Get linked invoices
    const linkedInvoices = await prisma.invoice.findMany({
      where: { leadSourceId: id, userId },
      include: { client: true },
    });

    // Get timeline events
    const timelineEvents = await prisma.leadTimelineEvent.findMany({
      where: { leadSourceId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      leadSource: {
        ...leadSource,
        calculatedMetrics: await calculateMetrics(leadSource, userId),
      },
      linkedJobs,
      linkedInvoices,
      timelineEvents,
    });
  } catch (error) {
    console.error('Error fetching lead source:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead source' },
      { status: 500 }
    );
  }
}

// PATCH - Update lead source
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const body = await request.json();

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
    if (body.name !== undefined) updateData.name = body.name;
    if (body.monthlyAdSpend !== undefined) updateData.monthlyAdSpend = body.monthlyAdSpend;
    if (body.seoRetainerCost !== undefined) updateData.seoRetainerCost = body.seoRetainerCost;
    if (body.otherCosts !== undefined) updateData.otherCosts = body.otherCosts;
    if (body.costNotes !== undefined) updateData.costNotes = body.costNotes;
    if (body.utmSource !== undefined) updateData.utmSource = body.utmSource;
    if (body.utmMedium !== undefined) updateData.utmMedium = body.utmMedium;
    if (body.utmCampaign !== undefined) updateData.utmCampaign = body.utmCampaign;
    if (body.trackingPhoneNumber !== undefined) updateData.trackingPhoneNumber = body.trackingPhoneNumber;
    if (body.pageUrl !== undefined) updateData.pageUrl = body.pageUrl;

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

// DELETE - Delete lead source
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const existingSource = await prisma.leadSource.findFirst({
      where: { id, userId },
    });

    if (!existingSource) {
      return NextResponse.json(
        { error: 'Lead source not found' },
        { status: 404 }
      );
    }

    // Delete associated timeline events first (cascade should handle this but being explicit)
    await prisma.leadTimelineEvent.deleteMany({
      where: { leadSourceId: id },
    });

    // Delete the lead source
    await prisma.leadSource.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead source deleted',
    });
  } catch (error) {
    console.error('Error deleting lead source:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead source' },
      { status: 500 }
    );
  }
}
