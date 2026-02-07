import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/leads/[id] - Get single lead with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const lead = await prisma.lead.findFirst({
      where: { id, userId },
      include: {
        leadSource: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Get converted entities if they exist
    let convertedJob = null;
    let convertedEstimate = null;
    let convertedInvoice = null;

    if (lead.convertedToJobId) {
      convertedJob = await prisma.job.findFirst({
        where: { id: lead.convertedToJobId, userId },
        include: { client: true },
      });
    }

    if (lead.convertedToEstimateId) {
      convertedEstimate = await prisma.estimate.findFirst({
        where: { id: lead.convertedToEstimateId, userId },
        include: { client: true },
      });
    }

    if (lead.convertedToInvoiceId) {
      convertedInvoice = await prisma.invoice.findFirst({
        where: { id: lead.convertedToInvoiceId, userId },
        include: { client: true },
      });
    }

    return NextResponse.json({
      lead,
      leadSource: lead.leadSource,
      convertedJob,
      convertedEstimate,
      convertedInvoice,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id] - Update lead
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const body = await request.json();

    const existingLead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Update allowed fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.trade !== undefined) updateData.trade = body.trade;
    if (body.estimatedValue !== undefined) updateData.estimatedValue = body.estimatedValue ? parseFloat(body.estimatedValue) : null;

    // Validate and update status
    if (body.status !== undefined) {
      const validStatuses = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = body.status;
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
      updateData.priority = body.priority;
    }

    if (body.lastContactedAt !== undefined) {
      updateData.lastContactedAt = body.lastContactedAt ? new Date(body.lastContactedAt) : null;
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
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
  try {
    const { id } = await params;
    const userId = await getUserId();

    const existingLead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
