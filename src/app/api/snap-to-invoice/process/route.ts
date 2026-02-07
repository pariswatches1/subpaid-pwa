import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// POST /api/snap-to-invoice/process - Process image and extract invoice data
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid image format. Please use JPEG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Upload image to cloud storage
    // 2. Call AI vision API (OpenAI GPT-4V, Claude, etc.) to extract data
    // 3. Return extracted invoice details

    // Simulating AI processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock AI-extracted data (in production, use actual AI extraction)
    const extractedData = {
      vendorName: 'ABC General Contractors',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      lineItems: [
        {
          id: '1',
          description: 'Labor - Electrical Rough-in (3 days, 3 crew)',
          quantity: 72,
          rate: 85,
          total: 6120,
        },
        {
          id: '2',
          description: '200A Main Panel',
          quantity: 1,
          rate: 1850,
          total: 1850,
        },
        {
          id: '3',
          description: '3/4" EMT Conduit (500ft)',
          quantity: 5,
          rate: 145,
          total: 725,
        },
      ],
      subtotal: 8695,
      tax: 0,
      total: 8695,
    };

    // Save to database
    const snapInvoice = await prisma.snapInvoice.create({
      data: {
        userId,
        originalImage: image.name,
        extractedData: extractedData,
        vendorName: extractedData.vendorName,
        invoiceNumber: extractedData.invoiceNumber,
        invoiceDate: new Date(extractedData.invoiceDate),
        totalAmount: extractedData.total,
        lineItems: extractedData.lineItems,
        status: 'processed',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: snapInvoice.id,
        ...extractedData,
        confidence: 94,
        paymentTerms: 'Net 30',
        suggestedDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      message: 'Image processed successfully',
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image. Please try again.' }, { status: 500 });
  }
}

// GET /api/snap-to-invoice/process - Get all processed invoices
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();

    const snapInvoices = await prisma.snapInvoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const formattedInvoices = snapInvoices.map(inv => ({
      id: inv.id,
      vendorName: inv.vendorName,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate?.toISOString().split('T')[0],
      totalAmount: inv.totalAmount ? Number(inv.totalAmount) : null,
      lineItems: inv.lineItems,
      status: inv.status,
      convertedToInvoiceId: inv.convertedToInvoiceId,
      createdAt: inv.createdAt.toISOString(),
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error('Error fetching snap invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
