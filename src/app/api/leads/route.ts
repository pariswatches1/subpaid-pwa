import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Lead } from '@/generated/prisma/client';

// Helper to get user ID (for now, return a demo user - later integrate auth)
async function getUserId() {
  // Check if demo user exists, create if not
  let user = await prisma.user.findFirst({
    where: { email: 'demo@subpaid.com' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@subpaid.com',
        name: 'Demo User',
        company: 'Demo Company',
      }
    });
  }

  return user.id;
}

// GET /api/leads - List leads with filters
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);

    // Filter parameters
    const status = searchParams.get('status');
    const sourceType = searchParams.get('sourceType');
    const priority = searchParams.get('priority');
    const leadSourceId = searchParams.get('leadSourceId');

    // Build where clause
    const where: any = { userId };

    if (status && status !== 'all') {
      where.status = status;
    }
    if (sourceType) {
      where.sourceType = sourceType;
    }
    if (priority) {
      where.priority = priority;
    }
    if (leadSourceId) {
      where.leadSourceId = leadSourceId;
    }

    // Fetch leads
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { receivedAt: 'desc' },
      include: {
        leadSource: {
          select: { name: true }
        }
      }
    });

    // Calculate stats
    const allLeads = await prisma.lead.findMany({
      where: { userId }
    });

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      total: allLeads.length,
      new: allLeads.filter((l: Lead) => l.status === 'new').length,
      contacted: allLeads.filter((l: Lead) => l.status === 'contacted').length,
      quoted: allLeads.filter((l: Lead) => l.status === 'quoted').length,
      won: allLeads.filter((l: Lead) => l.status === 'won').length,
      lost: allLeads.filter((l: Lead) => l.status === 'lost').length,
      thisWeek: allLeads.filter((l: Lead) => l.receivedAt >= weekAgo).length,
      conversionRate: allLeads.length > 0
        ? Math.round((allLeads.filter((l: Lead) => l.status === 'won').length / allLeads.length) * 100)
        : 0,
    };

    return NextResponse.json({
      leads,
      stats,
      total: leads.length,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const {
      leadSourceId,
      sourceType,
      sourceName,
      name,
      email,
      phone,
      company,
      description,
      location,
      trade,
      estimatedValue,
      rawContent,
      rawSubject,
      priority = 'warm',
    } = body;

    // Validate required fields
    if (!sourceType) {
      return NextResponse.json(
        { error: 'sourceType is required' },
        { status: 400 }
      );
    }

    // Validate sourceType
    const validSourceTypes = ['email', 'call', 'form', 'bid', 'manual'];
    if (!validSourceTypes.includes(sourceType)) {
      return NextResponse.json(
        { error: `Invalid sourceType. Must be one of: ${validSourceTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['hot', 'warm', 'cold'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
        { status: 400 }
      );
    }

    // If leadSourceId provided, verify ownership
    if (leadSourceId) {
      const leadSource = await prisma.leadSource.findFirst({
        where: { id: leadSourceId, userId }
      });
      if (!leadSource) {
        return NextResponse.json(
          { error: 'Lead source not found' },
          { status: 404 }
        );
      }
    }

    // Create the lead
    const newLead = await prisma.lead.create({
      data: {
        userId,
        leadSourceId: leadSourceId || null,
        sourceType,
        sourceName: sourceName || null,
        name: name || null,
        email: email || null,
        phone: phone || null,
        company: company || null,
        description: description || null,
        location: location || null,
        trade: trade || null,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        rawContent: rawContent || null,
        rawSubject: rawSubject || null,
        status: 'new',
        priority,
      }
    });

    // Create timeline event if linked to a lead source
    if (leadSourceId) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId,
          userId,
          eventType: 'lead_created',
          entityId: newLead.id,
          description: `New lead from ${sourceName || sourceType}: ${name || email || phone || 'Unknown'}`,
        }
      });
    }

    return NextResponse.json({
      success: true,
      lead: newLead,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/leads - Update lead status/details
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const { id, status, priority, lastContactedAt } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Find lead and verify ownership
    const existingLead = await prisma.lead.findFirst({
      where: { id, userId }
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (status) {
      const validStatuses = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (priority) {
      const validPriorities = ['hot', 'warm', 'cold'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.priority = priority;
    }

    if (lastContactedAt) {
      updateData.lastContactedAt = new Date(lastContactedAt);
    }

    // Update the lead
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
