import { NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';
import { LeadSource } from '@/lib/keyword-types';

// GET - List all lead sources
export async function GET() {
  const userId = getMockUserId();
  const leadSources = mockDb.leadSources.filter((ls) => ls.userId === userId);

  return NextResponse.json({
    leadSources,
    total: leadSources.length,
  });
}

// POST - Create a new lead source
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, keywords, generatedContent, filters, pageUrl } = body;

    if (!name || !keywords || !generatedContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userId = getMockUserId();

    const newLeadSource: LeadSource = {
      id: generateId(),
      userId,
      name,
      keywords,
      generatedContent,
      pageUrl: pageUrl || undefined,
      filters,
      createdAt: new Date().toISOString(),
      stats: {
        jobsLinked: 0,
        invoicesLinked: 0,
        amountPaid: 0,
      },
    };

    mockDb.leadSources.push(newLeadSource);

    return NextResponse.json({
      success: true,
      leadSource: newLeadSource,
    });
  } catch (error) {
    console.error('Error creating lead source:', error);
    return NextResponse.json(
      { error: 'Failed to create lead source' },
      { status: 500 }
    );
  }
}
