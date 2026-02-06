import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, generateInvoiceNumber, getMockUserId } from '@/lib/db';

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    let invoices = mockDb.invoices.filter(inv => inv.userId === userId);

    if (status) {
      invoices = invoices.filter(inv => inv.status === status);
    }
    if (clientId) {
      invoices = invoices.filter(inv => inv.clientId === clientId);
    }

    // Include client data
    const invoicesWithClient = invoices.map(inv => ({
      ...inv,
      client: mockDb.clients.find(c => c.id === inv.clientId),
    }));

    return NextResponse.json(invoicesWithClient);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const clientId = body.client_id || body.clientId;
    const lineItems = body.line_items || body.lineItems || [];
    const dueDate = body.due_date || body.dueDate;

    // Validation
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client is required' },
        { status: 400 }
      );
    }

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one line item is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = mockDb.clients.find(c => c.id === clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    const subtotal = lineItems.reduce(
      (sum: number, item: { quantity?: number; rate?: number; amount?: number; total?: number }) =>
        sum + (item.quantity && item.rate ? item.quantity * item.rate : item.amount || item.total || 0),
      0
    );
    const tax = body.tax || 0;
    const total = subtotal + tax;

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(mockDb.invoices.length);

    // Determine leadSourceId: from body, or inherit from linked job
    let leadSourceId = body.leadSourceId;
    if (!leadSourceId && body.jobId) {
      const job = mockDb.jobs.find(j => j.id === body.jobId);
      if (job && job.leadSourceId) {
        leadSourceId = job.leadSourceId;
      }
    }

    const newInvoice = {
      id: generateId(),
      invoiceNumber,
      clientId,
      jobId: body.jobId || undefined,
      userId,
      lineItems: lineItems.map((item: { description?: string; quantity?: number; rate?: number; amount?: number }, index: number) => ({
        id: String(index + 1),
        description: item.description || '',
        quantity: item.quantity || 1,
        rate: item.rate || item.amount || 0,
        total: item.quantity && item.rate ? item.quantity * item.rate : item.amount || 0,
      })),
      subtotal,
      tax,
      total,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: body.notes || '',
      status: body.status || 'draft',
      autopilotEnabled: body.autopilotEnabled || false,
      createdAt: new Date().toISOString(),
      leadSourceId: leadSourceId || undefined,
    };

    mockDb.invoices.push(newInvoice);

    // If leadSourceId exists, create a timeline event and update stats
    if (leadSourceId) {
      const timelineEvent = {
        id: generateId(),
        leadSourceId,
        userId,
        eventType: 'invoice_sent' as const,
        entityId: newInvoice.id,
        description: `Invoice sent: ${invoiceNumber}`,
        amount: total,
        createdAt: new Date().toISOString(),
      };
      mockDb.leadTimelineEvents.push(timelineEvent);

      // Update lead source stats (only if user owns the lead source)
      const leadSource = mockDb.leadSources.find(ls => ls.id === leadSourceId && ls.userId === userId);
      if (leadSource) {
        leadSource.stats.invoicesLinked = (leadSource.stats.invoicesLinked || 0) + 1;
      }
    }

    return NextResponse.json(
      { ...newInvoice, client },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH /api/invoices - Update invoice status
export async function PATCH(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();
    const { id, status, paidAt } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Find invoice and verify ownership
    const invoiceIndex = mockDb.invoices.findIndex(
      inv => inv.id === id && inv.userId === userId
    );

    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoice = mockDb.invoices[invoiceIndex];
    const previousStatus = invoice.status;

    // Update status if provided
    if (status) {
      invoice.status = status;

      // If status changed to 'paid', update lead source amountPaid
      if (status === 'paid' && previousStatus !== 'paid') {
        invoice.paidAt = paidAt || new Date().toISOString();

        // Update lead source stats if linked
        if (invoice.leadSourceId) {
          const leadSource = mockDb.leadSources.find(
            ls => ls.id === invoice.leadSourceId && ls.userId === userId
          );
          if (leadSource) {
            leadSource.stats.amountPaid = (leadSource.stats.amountPaid || 0) + invoice.total;

            // Create timeline event for payment
            const timelineEvent = {
              id: generateId(),
              leadSourceId: invoice.leadSourceId,
              userId,
              eventType: 'payment_received' as const,
              entityId: invoice.id,
              description: `Payment received: ${invoice.invoiceNumber}`,
              amount: invoice.total,
              createdAt: new Date().toISOString(),
            };
            mockDb.leadTimelineEvents.push(timelineEvent);
          }
        }
      }

      // If status changed FROM 'paid' to something else, subtract amount (edge case)
      if (previousStatus === 'paid' && status !== 'paid') {
        if (invoice.leadSourceId) {
          const leadSource = mockDb.leadSources.find(
            ls => ls.id === invoice.leadSourceId && ls.userId === userId
          );
          if (leadSource) {
            leadSource.stats.amountPaid = Math.max(0, (leadSource.stats.amountPaid || 0) - invoice.total);
          }
        }
        invoice.paidAt = undefined;
      }
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}
