import { NextRequest, NextResponse } from 'next/server';
import { getMockUserId } from '@/lib/db';

// POST /api/snap-to-invoice/process - Process image and extract invoice data
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
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

    // For demo, return mock extracted data
    // Simulating AI processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock AI-extracted data (in production, use actual AI extraction)
    const extractedData = {
      clientName: 'ABC General Contractors',
      project: 'Downtown Office Tower - Electrical',
      description: 'Completed electrical rough-in for floors 3-5, including panel installation and conduit runs',
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
        {
          id: '4',
          description: 'Wire - 12 AWG THHN (1000ft)',
          quantity: 2,
          rate: 285,
          total: 570,
        },
        {
          id: '5',
          description: 'Junction Boxes & Connectors',
          quantity: 1,
          rate: 435,
          total: 435,
        },
      ],
      subtotal: 9700,
      tax: 0,
      total: 9700,
      confidence: 94,
      paymentTerms: 'Net 30',
      suggestedDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      data: extractedData,
      message: 'Image processed successfully',
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image. Please try again.' },
      { status: 500 }
    );
  }
}
