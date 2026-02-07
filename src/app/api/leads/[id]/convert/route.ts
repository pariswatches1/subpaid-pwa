import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, generateEstimateNumber, generateInvoiceNumber } from '@/lib/auth';

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
    const userId = await getUserId();
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
    const lead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Prepare common data
    const clientName = body.customData?.clientName || lead.name || lead.company || 'Unknown Client';
    const clientEmail = body.customData?.clientEmail || lead.email || '';
    const description = body.customData?.description || lead.description || 'Converted from lead';
    const value = body.customData?.value || Number(lead.estimatedValue) || 0;

    let result: { type: string; id: string; entity: object } | null = null;

    // Convert based on type
    switch (body.type) {
      case 'job': {
        // Create or find client
        let client = await prisma.client.findFirst({
          where: {
            userId,
            OR: [
              { email: clientEmail },
              { name: clientName },
            ],
          },
        });

        if (!client) {
          client = await prisma.client.create({
            data: {
              userId,
              name: clientName,
              email: clientEmail,
              phone: lead.phone,
            },
          });
        }

        const newJob = await prisma.job.create({
          data: {
            userId,
            clientId: client.id,
            leadSourceId: lead.leadSourceId,
            title: lead.trade ? `${lead.trade} - ${clientName}` : `Job for ${clientName}`,
            description,
            status: 'active',
            budget: value,
            address: lead.location,
          },
        });

        // Update lead
        await prisma.lead.update({
          where: { id },
          data: {
            convertedToJobId: newJob.id,
            status: 'won',
          },
        });

        // Update lead source stats
        if (lead.leadSourceId) {
          await prisma.leadSource.update({
            where: { id: lead.leadSourceId },
            data: {
              jobsLinked: { increment: 1 },
            },
          });

          // Create timeline event
          await prisma.leadTimelineEvent.create({
            data: {
              leadSourceId: lead.leadSourceId,
              userId,
              eventType: 'job_created',
              entityId: newJob.id,
              description: `Job created from lead: ${clientName}`,
            },
          });
        }

        result = { type: 'job', id: newJob.id, entity: newJob };
        break;
      }

      case 'estimate': {
        // Create or find client
        let client = await prisma.client.findFirst({
          where: {
            userId,
            OR: [
              { email: clientEmail },
              { name: clientName },
            ],
          },
        });

        if (!client) {
          client = await prisma.client.create({
            data: {
              userId,
              name: clientName,
              email: clientEmail,
              phone: lead.phone,
            },
          });
        }

        const newEstimate = await prisma.estimate.create({
          data: {
            userId,
            clientId: client.id,
            leadSourceId: lead.leadSourceId,
            estimateNumber: generateEstimateNumber(),
            title: lead.trade ? `${lead.trade} Estimate` : 'Project Estimate',
            status: 'draft',
            lineItems: [
              {
                id: '1',
                description: description,
                quantity: 1,
                rate: value,
                total: value,
              },
            ],
            subtotal: value,
            markup: 0,
            tax: 0,
            total: value,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        // Update lead
        await prisma.lead.update({
          where: { id },
          data: {
            convertedToEstimateId: newEstimate.id,
            status: 'quoted',
          },
        });

        // Create timeline event
        if (lead.leadSourceId) {
          await prisma.leadTimelineEvent.create({
            data: {
              leadSourceId: lead.leadSourceId,
              userId,
              eventType: 'estimate_sent',
              entityId: newEstimate.id,
              description: `Estimate created for ${clientName}: $${value.toLocaleString()}`,
              amount: value,
            },
          });
        }

        result = { type: 'estimate', id: newEstimate.id, entity: newEstimate };
        break;
      }

      case 'invoice': {
        // Create or find client
        let client = await prisma.client.findFirst({
          where: {
            userId,
            OR: [
              { email: clientEmail },
              { name: clientName },
            ],
          },
        });

        if (!client) {
          client = await prisma.client.create({
            data: {
              userId,
              name: clientName,
              email: clientEmail,
              phone: lead.phone,
            },
          });
        }

        const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        const newInvoice = await prisma.invoice.create({
          data: {
            userId,
            clientId: client.id,
            leadSourceId: lead.leadSourceId,
            invoiceNumber: generateInvoiceNumber(),
            status: 'draft',
            lineItems: [
              {
                id: '1',
                description: description,
                quantity: 1,
                rate: value,
                total: value,
              },
            ],
            subtotal: value,
            tax: 0,
            total: value,
            dueDate,
            autopilotEnabled: body.enableAutopilot || false,
          },
        });

        // Update lead
        await prisma.lead.update({
          where: { id },
          data: {
            convertedToInvoiceId: newInvoice.id,
            status: 'won',
          },
        });

        // Update lead source stats
        if (lead.leadSourceId) {
          await prisma.leadSource.update({
            where: { id: lead.leadSourceId },
            data: {
              invoicesLinked: { increment: 1 },
            },
          });

          // Create timeline event
          await prisma.leadTimelineEvent.create({
            data: {
              leadSourceId: lead.leadSourceId,
              userId,
              eventType: 'invoice_sent',
              entityId: newInvoice.id,
              description: `Invoice created for ${clientName}: $${value.toLocaleString()}${body.enableAutopilot ? ' (Autopilot enabled)' : ''}`,
              amount: value,
            },
          });
        }

        result = { type: 'invoice', id: newInvoice.id, entity: newInvoice };
        break;
      }
    }

    // Get updated lead
    const updatedLead = await prisma.lead.findFirst({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      conversion: result,
      lead: updatedLead,
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
