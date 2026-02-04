import { NextRequest, NextResponse } from 'next/server';

// Mock database for invoices
let invoices = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientId: '1',
    clientName: 'Metro Builders Inc',
    amount: 8500,
    status: 'sent',
    dueDate: '2026-02-06',
    lineItems: [],
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.client_id && !body.clientId) {
      return NextResponse.json(
        { message: 'Client is required' },
        { status: 400 }
      );
    }

    if (!body.line_items && !body.lineItems) {
      return NextResponse.json(
        { message: 'At least one line item is required' },
        { status: 400 }
      );
    }

    // Calculate total from line items
    const lineItems = body.line_items || body.lineItems || [];
    const total = lineItems.reduce((sum: number, item: { amount?: number; total?: number }) =>
      sum + (item.amount || item.total || 0), 0
    );

    // Generate invoice number
    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;

    // Create new invoice
    const newInvoice = {
      id: String(Date.now()),
      invoiceNumber,
      clientId: body.client_id || body.clientId,
      clientName: body.clientName || 'Unknown Client',
      amount: total,
      lineItems,
      status: body.status || 'draft',
      dueDate: body.due_date || body.dueDate || null,
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
    };

    invoices.push(newInvoice);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { message: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
