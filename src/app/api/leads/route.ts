import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId, Lead } from '@/lib/db';

// GET /api/leads - List leads with filters
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);

    // Filter parameters
    const status = searchParams.get('status');
    const sourceType = searchParams.get('sourceType');
    const priority = searchParams.get('priority');
    const leadSourceId = searchParams.get('leadSourceId');

    let leads = mockDb.leads.filter(lead => lead.userId === userId);

    // Apply filters
    if (status && status !== 'all') {
      leads = leads.filter(lead => lead.status === status);
    }
    if (sourceType) {
      leads = leads.filter(lead => lead.sourceType === sourceType);
    }
    if (priority) {
      leads = leads.filter(lead => lead.priority === priority);
    }
    if (leadSourceId) {
      leads = leads.filter(lead => lead.leadSourceId === leadSourceId);
    }

    // Sort by receivedAt (newest first)
    leads.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

    // Calculate stats
    const allLeads = mockDb.leads.filter(lead => lead.userId === userId);
    const stats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'new').length,
      contacted: allLeads.filter(l => l.status === 'contacted').length,
      quoted: allLeads.filter(l => l.status === 'quoted').length,
      won: allLeads.filter(l => l.status === 'won').length,
      lost: allLeads.filter(l => l.status === 'lost').length,
      thisWeek: allLeads.filter(l => {
        const received = new Date(l.receivedAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return received >= weekAgo;
      }).length,
      conversionRate: allLeads.length > 0
        ? Math.round((allLeads.filter(l => l.status === 'won').length / allLeads.length) * 100)
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
    const userId = getMockUserId();
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
      const leadSource = mockDb.leadSources.find(
        ls => ls.id === leadSourceId && ls.userId === userId
      );
      if (!leadSource) {
        return NextResponse.json(
          { error: 'Lead source not found' },
          { status: 404 }
        );
      }
    }

    const now = new Date().toISOString();

    const newLead: Lead = {
      id: generateId(),
      userId,
      leadSourceId: leadSourceId || undefined,
      sourceType,
      sourceName: sourceName || undefined,
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
      description: description || undefined,
      location: location || undefined,
      trade: trade || undefined,
      estimatedValue: estimatedValue || undefined,
      rawContent: rawContent || undefined,
      rawSubject: rawSubject || undefined,
      status: 'new',
      priority,
      receivedAt: now,
      createdAt: now,
    };

    mockDb.leads.push(newLead);

    // Create timeline event if linked to a lead source
    if (leadSourceId) {
      const timelineEvent = {
        id: generateId(),
        leadSourceId,
        userId,
        eventType: 'lead_created' as const,
        entityId: newLead.id,
        description: `New lead from ${sourceName || sourceType}: ${name || email || phone || 'Unknown'}`,
        createdAt: now,
      };
      mockDb.leadTimelineEvents.push(timelineEvent);
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
    const userId = getMockUserId();
    const body = await request.json();

    const { id, status, priority, lastContactedAt, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Find lead and verify ownership
    const leadIndex = mockDb.leads.findIndex(
      lead => lead.id === id && lead.userId === userId
    );

    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const lead = mockDb.leads[leadIndex];

    // Update fields
    if (status) {
      const validStatuses = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      lead.status = status;
    }

    if (priority) {
      const validPriorities = ['hot', 'warm', 'cold'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
          { status: 400 }
        );
      }
      lead.priority = priority;
    }

    if (lastContactedAt) {
      lead.lastContactedAt = lastContactedAt;
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
