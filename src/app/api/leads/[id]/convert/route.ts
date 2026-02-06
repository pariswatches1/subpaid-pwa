import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId, Lead } from '@/lib/db';

/**
 * Lead Conversion API
 *
 * POST /api/leads/[id]/convert
 *
 * Converts a lead to a Job, Estimate, or Invoice.
 * Maintains leadSourceId attribution for ROI tracking.
 *
 * Body:
 * {
 *   type: 'job' | 'estimate' | 'invoice',
 *   enableAutopilot?: boolean,  // Enable SAM for payment chase
 *   customData?: {              // Optional override data
 *     description?: string,
 *     value?: number,
 *     ...
 *   }
 * }
 */

interface ConvertRequest {
  type: 'job' | 'estimate' | 'invoice';
  enableAutopilot?: boolean;
  customData?: {
    description?: string;
    value?: number;
    clientName?: string;
    clientEmail?: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const body: ConvertRequest = await request.json();

    // Validate conversion type
    const validTypes = ['job', 'estimate', 'invoice'];
    if (!body.type || !validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `type is required. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Find the lead
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
    const now = new Date().toISOString();

    // Prepare common data
    const clientName = body.customData?.clientName || lead.name || lead.company || 'Unknown Client';
    const clientEmail = body.customData?.clientEmail || lead.email || '';
    const description = body.customData?.description || lead.description || 'Converted from lead';
    const value = body.customData?.value || lead.estimatedValue || 0;

    let result: { type: string; id: string; entity: object } | null = null;

    // Convert based on type
    switch (body.type) {
      case 'job': {
        // Create or find client
        let clientId = '';
        const existingClient = mockDb.clients.find(
          c => c.userId === userId && (c.email === clientEmail || c.name === clientName)
        );
        if (existingClient) {
          clientId = existingClient.id;
        } else {
          // Create new client
          const newClient = {
            id: generateId(),
            userId,
            name: clientName,
            email: clientEmail,
            phone: lead.phone,
            createdAt: now,
          };
          mockDb.clients.push(newClient);
          clientId = newClient.id;
        }

        const newJob = {
          id: generateId(),
          userId,
          title: lead.trade ? `${lead.trade} - ${clientName}` : `Job for ${clientName}`,
          description,
          clientId,
          status: 'active',
          leadSourceId: lead.leadSourceId,
          budget: value,
          address: lead.location,
          createdAt: now,
        };

        mockDb.jobs.push(newJob as any);
        lead.convertedToJobId = newJob.id;
        lead.status = 'won';

        // Update lead source stats
        if (lead.leadSourceId) {
          const leadSource = mockDb.leadSources.find(
            ls => ls.id === lead.leadSourceId && ls.userId === userId
          );
          if (leadSource) {
            leadSource.stats.jobsLinked = (leadSource.stats.jobsLinked || 0) + 1;

            // Create timeline event
            mockDb.leadTimelineEvents.push({
              id: generateId(),
              leadSourceId: lead.leadSourceId,
              userId,
              eventType: 'job_created',
              entityId: newJob.id,
              description: `Job created from lead: ${clientName}`,
              createdAt: now,
            });
          }
        }

        result = { type: 'job', id: newJob.id, entity: newJob };
        break;
      }

      case 'estimate': {
        // Create or find client
        let estClientId = '';
        const existingEstClient = mockDb.clients.find(
          c => c.userId === userId && (c.email === clientEmail || c.name === clientName)
        );
        if (existingEstClient) {
          estClientId = existingEstClient.id;
        } else {
          const newClient = {
            id: generateId(),
            userId,
            name: clientName,
            email: clientEmail,
            phone: lead.phone,
            createdAt: now,
          };
          mockDb.clients.push(newClient);
          estClientId = newClient.id;
        }

        const newEstimate = {
          id: generateId(),
          estimateNumber: `EST-${Date.now().toString().slice(-6)}`,
          userId,
          clientId: estClientId,
          title: lead.trade ? `${lead.trade} Estimate` : 'Project Estimate',
          leadSourceId: lead.leadSourceId,
          status: 'draft',
          lineItems: [
            {
              id: generateId(),
              description: description,
              quantity: 1,
              rate: value,
              amount: value,
            },
          ],
          subtotal: value,
          markup: 0,
          total: value,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          createdAt: now,
        };

        mockDb.estimates.push(newEstimate as any);
        lead.convertedToEstimateId = newEstimate.id;
        lead.status = 'quoted';

        // Create timeline event
        if (lead.leadSourceId) {
          mockDb.leadTimelineEvents.push({
            id: generateId(),
            leadSourceId: lead.leadSourceId,
            userId,
            eventType: 'estimate_sent',
            entityId: newEstimate.id,
            description: `Estimate created for ${clientName}: $${value.toLocaleString()}`,
            amount: value,
            createdAt: now,
          });
        }

        result = { type: 'estimate', id: newEstimate.id, entity: newEstimate };
        break;
      }

      case 'invoice': {
        // Create or find client
        let invClientId = '';
        const existingInvClient = mockDb.clients.find(
          c => c.userId === userId && (c.email === clientEmail || c.name === clientName)
        );
        if (existingInvClient) {
          invClientId = existingInvClient.id;
        } else {
          const newClient = {
            id: generateId(),
            userId,
            name: clientName,
            email: clientEmail,
            phone: lead.phone,
            createdAt: now,
          };
          mockDb.clients.push(newClient);
          invClientId = newClient.id;
        }

        const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const newInvoice = {
          id: generateId(),
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          userId,
          clientId: invClientId,
          leadSourceId: lead.leadSourceId,
          status: 'draft',
          lineItems: [
            {
              id: generateId(),
              description: description,
              quantity: 1,
              rate: value,
              amount: value,
            },
          ],
          subtotal: value,
          tax: 0,
          total: value,
          dueDate,
          autopilotEnabled: body.enableAutopilot || false,
          createdAt: now,
        };

        mockDb.invoices.push(newInvoice as any);
        lead.convertedToInvoiceId = newInvoice.id;
        lead.status = 'won';

        // Update lead source stats
        if (lead.leadSourceId) {
          const leadSource = mockDb.leadSources.find(
            ls => ls.id === lead.leadSourceId && ls.userId === userId
          );
          if (leadSource) {
            leadSource.stats.invoicesLinked = (leadSource.stats.invoicesLinked || 0) + 1;

            // Create timeline event
            mockDb.leadTimelineEvents.push({
              id: generateId(),
              leadSourceId: lead.leadSourceId,
              userId,
              eventType: 'invoice_sent',
              entityId: newInvoice.id,
              description: `Invoice created for ${clientName}: $${value.toLocaleString()}${body.enableAutopilot ? ' (Autopilot enabled)' : ''}`,
              amount: value,
              createdAt: now,
            });
          }
        }

        result = { type: 'invoice', id: newInvoice.id, entity: newInvoice };
        break;
      }
    }

    // Create lead conversion timeline event
    if (lead.leadSourceId) {
      mockDb.leadTimelineEvents.push({
        id: generateId(),
        leadSourceId: lead.leadSourceId,
        userId,
        eventType: 'lead_converted',
        entityId: lead.id,
        description: `Lead converted to ${body.type}: ${clientName}`,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      conversion: result,
      lead,
      message: `Lead successfully converted to ${body.type}`,
    });

  } catch (error) {
    console.error('Error converting lead:', error);
    return NextResponse.json(
      { error: 'Failed to convert lead' },
      { status: 500 }
    );
  }
}
