import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

// Helper to get user ID (for now, return a demo user - later integrate auth)
async function getUserId() {
  let user = await prisma.user.findFirst({
    where: { email: 'demo@subpaid.com' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@subpaid.com',
        name: 'Demo User',
        company: 'Demo Company',
      }
    });
  }

  return user.id;
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
async function findLeadSource(
  userId: string,
  parsedEmail: ReturnType<typeof parseEmail>,
  explicitId?: string
) {
  // If explicitly provided, use that
  if (explicitId) {
    return await prisma.leadSource.findFirst({
      where: { id: explicitId, userId }
    });
  }

  // Try to match by source name
  if (parsedEmail.sourceName) {
    const sourceLower = parsedEmail.sourceName.toLowerCase();
    return await prisma.leadSource.findFirst({
      where: {
        userId,
        name: {
          contains: sourceLower,
          mode: 'insensitive'
        }
      }
    });
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

    const userId = await getUserId();

    // Find matching lead source
    const leadSource = await findLeadSource(userId, parsed, payload.leadSourceId);

    // Create the lead
    const newLead = await prisma.lead.create({
      data: {
        userId,
        leadSourceId: leadSource?.id || null,
        sourceType: 'email',
        sourceName: parsed.sourceName || null,
        name: parsed.name || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        company: parsed.company || null,
        description: parsed.description || null,
        location: parsed.location || null,
        trade: parsed.trade || null,
        estimatedValue: parsed.estimatedValue || null,
        rawContent: parsed.rawContent || null,
        rawSubject: parsed.rawSubject || null,
        status: 'new',
        priority: parsed.priority,
      }
    });

    // Create timeline event if linked to lead source
    if (leadSource) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId: leadSource.id,
          userId,
          eventType: 'lead_created',
          entityId: newLead.id,
          description: `New email lead: ${parsed.name || parsed.email || 'Unknown'} - ${parsed.trade || 'General'}`,
        }
      });
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
