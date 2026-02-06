/**
 * Email Parser Utility
 * Parses incoming emails from various lead sources and extracts contact/job information.
 */

export interface ParsedEmail {
  // Source detection
  detectedSource: 'thumbtack' | 'angi' | 'homeadvisor' | 'houzz' | 'craigslist' | 'google' | 'gc_bid' | 'unknown';
  sourceName: string;

  // Contact info
  name?: string;
  email?: string;
  phone?: string;
  company?: string;

  // Job details
  description?: string;
  location?: string;
  trade?: string;
  estimatedValue?: number;

  // Priority guess
  priority: 'hot' | 'warm' | 'cold';

  // Raw data
  rawSubject: string;
  rawContent: string;

  // Parse confidence
  confidence: 'high' | 'medium' | 'low';
  parseErrors: string[];
}

interface EmailInput {
  from: string;
  subject: string;
  body: string;
  html?: string;
}

// Common phone patterns
const PHONE_PATTERNS = [
  /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
  /\b(\d{3})[-.](\d{3})[-.](\d{4})\b/g,
];

// Common email pattern
const EMAIL_PATTERN = /[\w.-]+@[\w.-]+\.\w{2,}/gi;

// Name extraction patterns (common in lead notifications)
const NAME_PATTERNS = [
  /(?:from|customer|client|name|contact):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
  /(?:Hi,?\s*I'm|My name is|I am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
];

// Location patterns
const LOCATION_PATTERNS = [
  /(?:location|address|area|city|in):\s*([^,\n]+(?:,\s*[A-Z]{2})?)/i,
  /(?:located in|based in|near)\s+([^,.\n]+)/i,
  /(\d+\s+[^,]+,\s*[A-Z][a-z]+,?\s*[A-Z]{2}\s*\d{5})/,
];

// Trade/Service patterns
const TRADE_KEYWORDS: { [key: string]: string[] } = {
  'Electrical': ['electrical', 'electrician', 'wiring', 'outlet', 'panel', 'circuit'],
  'Plumbing': ['plumbing', 'plumber', 'pipe', 'drain', 'water heater', 'faucet', 'toilet'],
  'HVAC': ['hvac', 'heating', 'cooling', 'air conditioning', 'ac unit', 'furnace'],
  'Roofing': ['roof', 'roofing', 'shingle', 'gutter', 'leak'],
  'Painting': ['paint', 'painting', 'interior paint', 'exterior paint', 'walls'],
  'Flooring': ['floor', 'flooring', 'tile', 'hardwood', 'carpet', 'laminate'],
  'Drywall': ['drywall', 'sheetrock', 'drywall repair', 'texture'],
  'Carpentry': ['carpentry', 'carpenter', 'cabinet', 'framing', 'trim', 'deck'],
  'Landscaping': ['landscaping', 'lawn', 'yard', 'garden', 'tree', 'irrigation'],
  'General Contracting': ['renovation', 'remodel', 'general contractor', 'addition', 'construction'],
};

// Source detection patterns
const SOURCE_PATTERNS = {
  thumbtack: {
    fromPatterns: [/thumbtack/i, /tack@/i],
    subjectPatterns: [/thumbtack/i, /new lead/i],
    bodyPatterns: [/thumbtack/i, /tack\.com/i],
  },
  angi: {
    fromPatterns: [/angi/i, /angieslist/i, /angie'?s?\s*list/i],
    subjectPatterns: [/angi/i, /new service request/i],
    bodyPatterns: [/angi\.com/i, /angieslist/i],
  },
  homeadvisor: {
    fromPatterns: [/homeadvisor/i],
    subjectPatterns: [/homeadvisor/i, /new lead from homeadvisor/i],
    bodyPatterns: [/homeadvisor\.com/i],
  },
  houzz: {
    fromPatterns: [/houzz/i],
    subjectPatterns: [/houzz/i, /new message from/i],
    bodyPatterns: [/houzz\.com/i],
  },
  craigslist: {
    fromPatterns: [/craigslist/i],
    subjectPatterns: [/craigslist/i, /re:/i],
    bodyPatterns: [/craigslist\.org/i],
  },
  google: {
    fromPatterns: [/google/i, /ads-noreply/i],
    subjectPatterns: [/google ads/i, /new lead/i],
    bodyPatterns: [/google\.com\/ads/i, /forms\.gle/i],
  },
};

/**
 * Detects the source of an email based on patterns
 */
function detectSource(email: EmailInput): { source: ParsedEmail['detectedSource']; name: string } {
  const { from, subject, body } = email;
  const combined = `${from} ${subject} ${body}`.toLowerCase();

  for (const [source, patterns] of Object.entries(SOURCE_PATTERNS)) {
    const fromMatch = patterns.fromPatterns.some(p => p.test(from));
    const subjectMatch = patterns.subjectPatterns.some(p => p.test(subject));
    const bodyMatch = patterns.bodyPatterns.some(p => p.test(body));

    if (fromMatch || (subjectMatch && bodyMatch)) {
      const sourceNames: { [key: string]: string } = {
        thumbtack: 'Thumbtack',
        angi: 'Angi',
        homeadvisor: 'HomeAdvisor',
        houzz: 'Houzz',
        craigslist: 'Craigslist',
        google: 'Google Ads',
      };
      return {
        source: source as ParsedEmail['detectedSource'],
        name: sourceNames[source] || source,
      };
    }
  }

  // Check for GC/bid patterns
  if (/bid\s*(?:request|invite|opportunity)/i.test(combined) ||
      /request\s*for\s*(?:proposal|quote|bid)/i.test(combined)) {
    return { source: 'gc_bid', name: 'GC Bid Request' };
  }

  return { source: 'unknown', name: 'Email' };
}

/**
 * Extracts phone numbers from text
 */
function extractPhone(text: string): string | undefined {
  for (const pattern of PHONE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Clean and format
      const cleaned = match[0].replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
    }
  }
  return undefined;
}

/**
 * Extracts email addresses from text
 */
function extractEmail(text: string, excludeFrom: string): string | undefined {
  const matches = text.match(EMAIL_PATTERN);
  if (matches) {
    // Return first email that isn't the sender or a notification email
    return matches.find(email =>
      !email.includes('@thumbtack.') &&
      !email.includes('@angi.') &&
      !email.includes('@homeadvisor.') &&
      !email.includes('noreply') &&
      !email.includes('notification') &&
      email.toLowerCase() !== excludeFrom.toLowerCase()
    );
  }
  return undefined;
}

/**
 * Extracts name from text
 */
function extractName(text: string): string | undefined {
  for (const pattern of NAME_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

/**
 * Extracts location from text
 */
function extractLocation(text: string): string | undefined {
  for (const pattern of LOCATION_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

/**
 * Detects trade/service type from text
 */
function detectTrade(text: string): string | undefined {
  const lowerText = text.toLowerCase();

  for (const [trade, keywords] of Object.entries(TRADE_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      return trade;
    }
  }
  return undefined;
}

/**
 * Estimates job value from text
 */
function estimateValue(text: string): number | undefined {
  // Look for dollar amounts
  const patterns = [
    /\$\s*([\d,]+(?:\.\d{2})?)\s*(?:budget|estimate|looking to spend)?/i,
    /budget[:\s]+\$?\s*([\d,]+)/i,
    /(?:up to|around|about)\s*\$?\s*([\d,]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(value) && value > 0 && value < 10000000) {
        return value;
      }
    }
  }
  return undefined;
}

/**
 * Determines priority based on email content
 */
function determinePriority(email: EmailInput, parsed: Partial<ParsedEmail>): 'hot' | 'warm' | 'cold' {
  const combined = `${email.subject} ${email.body}`.toLowerCase();

  // Hot indicators
  const hotPatterns = [
    /urgent/i, /asap/i, /emergency/i, /today/i, /right away/i,
    /immediately/i, /need.{0,20}now/i, /this week/i,
  ];

  // Cold indicators
  const coldPatterns = [
    /just looking/i, /researching/i, /not sure/i, /maybe/i,
    /thinking about/i, /in the future/i, /next year/i,
  ];

  // Check for hot signals
  if (hotPatterns.some(p => p.test(combined))) {
    return 'hot';
  }

  // Check for cold signals
  if (coldPatterns.some(p => p.test(combined))) {
    return 'cold';
  }

  // High value = warm at minimum
  if (parsed.estimatedValue && parsed.estimatedValue > 5000) {
    return 'warm';
  }

  // Has phone = more likely to want a call
  if (parsed.phone) {
    return 'warm';
  }

  return 'warm'; // Default to warm
}

/**
 * Main email parsing function
 */
export function parseEmail(email: EmailInput): ParsedEmail {
  const parseErrors: string[] = [];
  const body = email.html || email.body;

  // Detect source
  const { source: detectedSource, name: sourceName } = detectSource(email);

  // Extract contact info
  const phone = extractPhone(body);
  const extractedEmail = extractEmail(body, email.from);
  const name = extractName(body);

  // Extract job details
  const location = extractLocation(body);
  const trade = detectTrade(body);
  const estimatedValue = estimateValue(body);

  // Build description from subject + first part of body
  let description = email.subject;
  if (body) {
    // Get first 300 chars of meaningful content
    const cleanBody = body
      .replace(/<[^>]+>/g, ' ')  // Remove HTML tags
      .replace(/\s+/g, ' ')       // Normalize whitespace
      .trim()
      .slice(0, 300);
    if (cleanBody.length > 20) {
      description = cleanBody;
    }
  }

  // Build partial result for priority determination
  const partial: Partial<ParsedEmail> = {
    phone,
    email: extractedEmail,
    estimatedValue,
  };

  // Determine priority
  const priority = determinePriority(email, partial);

  // Determine confidence
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (detectedSource !== 'unknown' && (phone || extractedEmail) && name) {
    confidence = 'high';
  } else if (detectedSource === 'unknown' && !phone && !extractedEmail) {
    confidence = 'low';
    parseErrors.push('Could not extract contact information');
  }

  if (!name) {
    parseErrors.push('Could not extract name');
  }

  return {
    detectedSource,
    sourceName,
    name,
    email: extractedEmail,
    phone,
    company: undefined, // Would need more sophisticated extraction
    description,
    location,
    trade,
    estimatedValue,
    priority,
    rawSubject: email.subject,
    rawContent: body,
    confidence,
    parseErrors,
  };
}

/**
 * Parse email specifically from Thumbtack format
 */
export function parseThumbtackEmail(email: EmailInput): ParsedEmail {
  const parsed = parseEmail(email);

  // Thumbtack-specific enhancements
  const body = email.html || email.body;

  // Thumbtack format: "Customer: John Smith"
  const customerMatch = body.match(/customer:\s*([^\n<]+)/i);
  if (customerMatch) {
    parsed.name = customerMatch[1].trim();
  }

  // Thumbtack format: "Project: Electrical work needed"
  const projectMatch = body.match(/project:\s*([^\n<]+)/i);
  if (projectMatch) {
    parsed.description = projectMatch[1].trim();
  }

  parsed.sourceName = 'Thumbtack';
  parsed.detectedSource = 'thumbtack';

  return parsed;
}

/**
 * Parse email specifically from Angi format
 */
export function parseAngiEmail(email: EmailInput): ParsedEmail {
  const parsed = parseEmail(email);

  // Angi-specific parsing
  const body = email.html || email.body;

  // Angi often has structured data
  const serviceMatch = body.match(/service\s*(?:needed|requested|type)?:\s*([^\n<]+)/i);
  if (serviceMatch) {
    parsed.trade = serviceMatch[1].trim();
  }

  parsed.sourceName = 'Angi';
  parsed.detectedSource = 'angi';

  return parsed;
}
