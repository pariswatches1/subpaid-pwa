import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';
import { parseEmail } from '@/lib/email-parser';

/**
 * Email Ingestion Webhook
 *
 * POST /api/leads/email
 *
 * Accepts email data from various sources:
 * - Zapier/Make webhooks
 * - Postmark inbound parse
 * - SendGrid inbound parse
 * - Custom email forwarding
 *
 * Expected payload formats:
 *
 * Standard format:
 * {
 *   from: "sender@example.com",
 *   subject: "Email subject",
 *   body: "Plain text body",
 *   html: "Optional HTML body"
 * }
 *
 * Postmark format:
 * {
 *   FromFull: { Email: "sender@example.com", Name: "Sender" },
 *   Subject: "Email subject",
 *   TextBody: "Plain text",
 *   HtmlBody: "HTML body"
 * }
 *
 * SendGrid format:
 * {
 *   from: "sender@example.com",
 *   subject: "Subject",
 *   text: "Plain text",
 *   html: "HTML"
 * }
 */

interface EmailPayload {
  // Standard format
  from?: string;
  subject?: string;
  body?: string;
  html?: string;
  text?: string;

  // Postmark format
  FromFull?: { Email: string; Name?: string };
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;

  // Optional: lead source association
  leadSourceId?: string;

  // Optional: API key for authentication
  apiKey?: string;
}

// Normalize various email formats to standard format
function normalizeEmailPayload(payload: EmailPayload): {
  from: string;
  subject: string;
  body: string;
  html?: string;
} {
  // Postmark format
  if (payload.FromFull) {
    return {
      from: payload.FromFull.Email,
      subject: payload.Subject || '',
      body: payload.TextBody || '',
      html: payload.HtmlBody,
    };
  }

  // SendGrid / standard format
  return {
    from: payload.from || '',
    subject: payload.subject || payload.Subject || '',
    body: payload.body || payload.text || payload.TextBody || '',
    html: payload.html || payload.HtmlBody,
  };
}

// Attempt to match email to a lead source by UTM or tracking info
function findLeadSource(parsedEmail: ReturnType<typeof parseEmail>, explicitId?: string) {
  const userId = getMockUserId();

  // If explicitly provided, use that
  if (explicitId) {
    return mockDb.leadSources.find(
      ls => ls.id === explicitId && ls.userId === userId
    );
  }

  // Try to match by source name
  if (parsedEmail.sourceName) {
    const sourceLower = parsedEmail.sourceName.toLowerCase();
    return mockDb.leadSources.find(
      ls => ls.userId === userId &&
            ls.name.toLowerCase().includes(sourceLower)
    );
  }

  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const payload: EmailPayload = await request.json();

    // Normalize to standard format
    const email = normalizeEmailPayload(payload);

    // Validate required fields
    if (!email.from && !email.subject && !email.body) {
      return NextResponse.json(
        { error: 'Email must have from, subject, or body' },
        { status: 400 }
      );
    }

    // Parse the email
    const parsed = parseEmail(email);

    // Find matching lead source
    const leadSource = findLeadSource(parsed, payload.leadSourceId);

    const userId = getMockUserId();
    const now = new Date().toISOString();

    // Create the lead
    const newLead = {
      id: generateId(),
      userId,
      leadSourceId: leadSource?.id,
      sourceType: 'email' as const,
      sourceName: parsed.sourceName,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      company: parsed.company,
      description: parsed.description,
      location: parsed.location,
      trade: parsed.trade,
      estimatedValue: parsed.estimatedValue,
      rawContent: parsed.rawContent,
      rawSubject: parsed.rawSubject,
      status: 'new' as const,
      priority: parsed.priority,
      receivedAt: now,
      createdAt: now,
    };

    mockDb.leads.push(newLead);

    // Create timeline event if linked to lead source
    if (leadSource) {
      const timelineEvent = {
        id: generateId(),
        leadSourceId: leadSource.id,
        userId,
        eventType: 'lead_created' as const,
        entityId: newLead.id,
        description: `New email lead: ${parsed.name || parsed.email || 'Unknown'} - ${parsed.trade || 'General'}`,
        createdAt: now,
      };
      mockDb.leadTimelineEvents.push(timelineEvent);
    }

    return NextResponse.json({
      success: true,
      lead: newLead,
      parsing: {
        source: parsed.detectedSource,
        confidence: parsed.confidence,
        errors: parsed.parseErrors,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing email webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}

// GET - Show webhook documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/leads/email',
    description: 'Email ingestion webhook for creating leads from incoming emails',
    methods: ['POST'],
    formats: [
      {
        name: 'Standard',
        example: {
          from: 'customer@example.com',
          subject: 'Quote request for electrical work',
          body: 'Hi, I need an electrician...',
          html: '<p>Hi, I need an electrician...</p>',
        },
      },
      {
        name: 'Postmark',
        example: {
          FromFull: { Email: 'customer@example.com', Name: 'John Doe' },
          Subject: 'Quote request',
          TextBody: 'Email body...',
          HtmlBody: '<p>Email body...</p>',
        },
      },
    ],
    supportedSources: [
      'Thumbtack',
      'Angi',
      'HomeAdvisor',
      'Houzz',
      'Craigslist',
      'Google Ads',
      'GC Bid Requests',
      'Any email',
    ],
    parsing: {
      autoExtracted: [
        'Contact name',
        'Email address',
        'Phone number',
        'Location',
        'Trade/service type',
        'Estimated value',
        'Priority (hot/warm/cold)',
      ],
    },
  });
}
