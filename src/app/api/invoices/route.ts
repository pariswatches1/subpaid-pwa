import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, generateInvoiceNumber } from '@/lib/auth';

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    const where: any = { userId };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: true,
        job: true,
        leadSource: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
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
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId },
    });
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
    const invoiceNumber = generateInvoiceNumber();

    // Determine leadSourceId: from body, or inherit from linked job
    let leadSourceId = body.leadSourceId;
    if (!leadSourceId && body.jobId) {
      const job = await prisma.job.findFirst({
        where: { id: body.jobId, userId },
      });
      if (job?.leadSourceId) {
        leadSourceId = job.leadSourceId;
      }
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        userId,
        clientId,
        jobId: body.jobId || null,
        leadSourceId: leadSourceId || null,
        invoiceNumber,
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
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: body.notes || null,
        status: body.status || 'draft',
        autopilotEnabled: body.autopilotEnabled || false,
      },
      include: {
        client: true,
      },
    });

    // If leadSourceId exists, create a timeline event and update stats
    if (leadSourceId) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId,
          userId,
          eventType: 'invoice_sent',
          entityId: newInvoice.id,
          description: `Invoice created: ${invoiceNumber}`,
          amount: total,
        },
      });

      await prisma.leadSource.update({
        where: { id: leadSourceId },
        data: {
          invoicesLinked: { increment: 1 },
        },
      });
    }

    return NextResponse.json(newInvoice, { status: 201 });
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
    const userId = await getUserId();
    const body = await request.json();
    const { id, status, paidAt } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Find invoice and verify ownership
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const previousStatus = invoice.status;
    const updateData: any = {};

    // Update status if provided
    if (status) {
      updateData.status = status;

      // If status changed to 'paid', update lead source amountPaid
      if (status === 'paid' && previousStatus !== 'paid') {
        updateData.paidAt = paidAt ? new Date(paidAt) : new Date();

        // Update lead source stats if linked
        if (invoice.leadSourceId) {
          await prisma.leadSource.update({
            where: { id: invoice.leadSourceId },
            data: {
              amountPaid: { increment: Number(invoice.total) },
            },
          });

          // Create timeline event for payment
          await prisma.leadTimelineEvent.create({
            data: {
              leadSourceId: invoice.leadSourceId,
              userId,
              eventType: 'payment_received',
              entityId: invoice.id,
              description: `Payment received: ${invoice.invoiceNumber}`,
              amount: invoice.total,
            },
          });
        }
      }

      // If status changed FROM 'paid' to something else, subtract amount
      if (previousStatus === 'paid' && status !== 'paid') {
        if (invoice.leadSourceId) {
          await prisma.leadSource.update({
            where: { id: invoice.leadSourceId },
            data: {
              amountPaid: { decrement: Number(invoice.total) },
            },
          });
        }
        updateData.paidAt = null;
      }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}
