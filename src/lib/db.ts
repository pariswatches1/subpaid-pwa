// Mock database for development
// In production, replace with Prisma client

import { StateCode, DataSourceCode } from './states-config';
import { Contractor } from './types';
import { KeywordCacheEntry, SavedKeywordList, KeywordRequest, KeywordResponse, LeadSource } from './keyword-types';

// Re-export Contractor for backwards compatibility
export type { Contractor } from './types';

// Contractor data is loaded lazily below after mockDb is created

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
}

export interface Client {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  payScore?: number;
  createdAt?: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  clientId: string;
  client?: Client;
  status: string;
  startDate?: string;
  endDate?: string;
  userId: string;
  createdAt: string;
  // Additional fields
  budget?: number;
  address?: string;
  // Lead Source Attribution
  leadSourceId?: string;
}

// Call Tracking for Lead Sources
export interface CallTrackingRecord {
  id: string;
  leadSourceId: string;
  userId: string;
  trackingNumber: string;
  callerNumber: string;
  callDate: string;
  duration: number;
  answered: boolean;
  outcome?: 'lead' | 'spam' | 'voicemail' | 'wrong_number';
  convertedToJobId?: string;
  createdAt: string;
}

// Lead Timeline Events
export interface LeadTimelineEvent {
  id: string;
  leadSourceId: string;
  userId: string;
  eventType: 'call' | 'form_submit' | 'job_created' | 'estimate_sent' |
             'estimate_accepted' | 'invoice_sent' | 'reminder_sent' |
             'sam_call' | 'payment_received' | 'lead_created' | 'lead_converted';
  entityId?: string;
  description: string;
  amount?: number;
  createdAt: string;
}

// Lead - Automatic Leads Inbox
export interface Lead {
  id: string;
  userId: string;

  // Source tracking
  leadSourceId?: string;           // Links to LeadSource for attribution
  sourceType: 'email' | 'call' | 'form' | 'bid' | 'manual';
  sourceName?: string;             // "Thumbtack", "Angi", "Google Ads", etc.

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

  // Raw data (for parsing failures)
  rawContent?: string;             // Original email body, form data, etc.
  rawSubject?: string;             // Email subject if applicable

  // Status tracking
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'archived';
  priority: 'hot' | 'warm' | 'cold';

  // Conversion tracking
  convertedToJobId?: string;
  convertedToEstimateId?: string;
  convertedToInvoiceId?: string;

  // Call tracking link
  callTrackingRecordId?: string;

  // Timestamps
  receivedAt: string;              // When lead came in
  lastContactedAt?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  jobId?: string;
  userId: string;
  status: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  lineItems: LineItem[];
  sentAt?: string;
  paidAt?: string;
  autopilotEnabled: boolean;
  createdAt: string;
  // Lead Source Attribution (inherited from job or set directly)
  leadSourceId?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  clientId: string;
  userId: string;
  title: string;
  status: string;
  lineItems: LineItem[];
  subtotal: number;
  markup: number;
  total: number;
  validUntil?: string;
  createdAt: string;
  // Lead Source Attribution
  leadSourceId?: string;
  convertedToInvoiceId?: string;
}

export interface TimeEntry {
  id: string;
  jobId: string;
  userId: string;
  date: string;
  hours: number;
  description?: string;
  billable: boolean;
  crewMemberId?: string;
  createdAt: string;
}

export interface CrewMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  hourlyRate?: number;
  status: string;
  userId: string;
  createdAt: string;
}

export interface LienGuardProject {
  id: string;
  name: string;
  address: string;
  gcName: string;
  contractAmount: number;
  startDate: string;
  preliminaryNoticeSent: boolean;
  preliminaryNoticeDate?: string;
  lienDeadline?: string;
  status: string;
  userId: string;
  createdAt: string;
}

export interface AIAApplication {
  id: string;
  applicationNumber: number;
  projectId: string;
  projectName?: string;
  periodTo: string;
  scheduledValue: number;
  previousCompleted: number;
  workCompleted: number;
  materialsStored: number;
  totalCompleted: number;
  retainagePercentage: number;
  retainageAmount: number;
  currentPaymentDue: number;
  status: string;
  userId: string;
  createdAt: string;
}

export interface GCRating {
  id: string;
  gcName: string;
  gcEmail?: string;
  paymentTimeliness: number;
  communication: number;
  overallRating: number;
  review?: string;
  avgPaymentDays?: number;
  userId: string;
  createdAt: string;
}

// Contractor interface is now in ./types.ts (re-exported above)

export interface ContractorClaim {
  id: string;
  contractorId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  verificationMethod: 'email' | 'phone' | 'document';
  submittedAt: string;
  reviewedAt?: string;
}

export interface SAMAgentCall {
  id: string;
  invoiceId: string;
  callStatus: string;
  callDate: string;
  duration?: number;
  transcript?: string;
  outcome?: string;
  promiseDate?: string;
  createdAt: string;
}

export interface PrequalDocument {
  id: string;
  name: string;
  documentType: string;
  expirationDate?: string | null;
  fileUrl?: string | null;
  fileSize?: number | null;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfitGuardBid {
  id: string;
  projectName: string;
  totalBidAmount: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  directCosts: number;
  overheadPercentage: number;
  overheadAmount: number;
  totalCosts: number;
  grossProfit: number;
  actualProfitMargin: number;
  desiredProfitMargin: number;
  breakEvenAmount: number;
  suggestedBid: number;
  recommendation: string;
  riskLevel: string;
  warnings: string[];
  suggestions: string[];
  status: string;
  userId: string;
  createdAt: string;
}

// Mock data stores
export const mockDb = {
  users: [] as User[],
  clients: [
    { id: '1', name: 'ABC General Contractors', email: 'billing@abcgc.com', phone: '(555) 123-4567', payScore: 58 },
    { id: '2', name: 'Metro Builders Inc', email: 'accounts@metrobuilders.com', phone: '(555) 234-5678', payScore: 92 },
    { id: '3', name: 'Smith Builders', email: 'john@smithbuilders.com', phone: '(555) 345-6789', payScore: 87 },
    { id: '4', name: 'Downtown Development LLC', email: 'projects@downtowndev.com', phone: '(555) 456-7890', payScore: 81 },
  ] as Client[],
  jobs: [
    { id: '1', title: 'Downtown Office Tower - Electrical', clientId: '1', status: 'active', userId: 'user1', createdAt: new Date().toISOString() },
    { id: '2', title: 'Riverside Apartments - Phase 2', clientId: '4', status: 'active', userId: 'user1', createdAt: new Date().toISOString() },
  ] as Job[],
  invoices: [
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      clientId: '1',
      jobId: '1',
      userId: 'user1',
      status: 'overdue',
      dueDate: '2026-01-15',
      subtotal: 12500,
      tax: 0,
      total: 12500,
      lineItems: [
        { id: '1', description: 'Electrical Rough-in - Phase 1', quantity: 1, rate: 12500, total: 12500 }
      ],
      sentAt: '2026-01-01T00:00:00.000Z',
      autopilotEnabled: false,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      clientId: '2',
      userId: 'user1',
      status: 'sent',
      dueDate: '2026-02-15',
      subtotal: 8750,
      tax: 0,
      total: 8750,
      lineItems: [
        { id: '1', description: 'HVAC Installation', quantity: 1, rate: 8750, total: 8750 }
      ],
      sentAt: '2026-01-20T00:00:00.000Z',
      autopilotEnabled: false,
      createdAt: '2026-01-20T00:00:00.000Z'
    },
  ] as Invoice[],
  estimates: [] as Estimate[],
  timeEntries: [] as TimeEntry[],
  crewMembers: [
    { id: '1', name: 'Mike Johnson', email: 'mike@example.com', phone: '(555) 111-2222', role: 'Foreman', hourlyRate: 45, status: 'active', userId: 'user1', createdAt: new Date().toISOString() },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', phone: '(555) 222-3333', role: 'Electrician', hourlyRate: 38, status: 'active', userId: 'user1', createdAt: new Date().toISOString() },
  ] as CrewMember[],
  lienGuardProjects: [
    {
      id: '1',
      name: 'Highland Shopping Center',
      address: '123 Highland Ave, Austin, TX 78701',
      gcName: 'ABC General Contractors',
      contractAmount: 125000,
      startDate: '2026-01-01',
      preliminaryNoticeSent: true,
      preliminaryNoticeDate: '2026-01-05',
      lienDeadline: '2026-04-01',
      status: 'active',
      userId: 'user1',
      createdAt: new Date().toISOString()
    }
  ] as LienGuardProject[],
  aiaApplications: [
    {
      id: '1',
      applicationNumber: 1,
      projectId: '1',
      projectName: 'Highland Shopping Center',
      periodTo: '2026-01-31',
      scheduledValue: 125000,
      previousCompleted: 0,
      workCompleted: 45000,
      materialsStored: 5000,
      totalCompleted: 50000,
      retainagePercentage: 10,
      retainageAmount: 5000,
      currentPaymentDue: 45000,
      status: 'submitted',
      userId: 'user1',
      createdAt: new Date().toISOString()
    }
  ] as AIAApplication[],
  gcRatings: [
    {
      id: '1',
      gcName: 'ABC General Contractors',
      gcEmail: 'billing@abcgc.com',
      paymentTimeliness: 2,
      communication: 3,
      overallRating: 3,
      review: 'Often pays late, communication could be better',
      avgPaymentDays: 45,
      userId: 'user1',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      gcName: 'Metro Builders Inc',
      gcEmail: 'accounts@metrobuilders.com',
      paymentTimeliness: 5,
      communication: 5,
      overallRating: 5,
      review: 'Excellent to work with, always pays on time',
      avgPaymentDays: 15,
      userId: 'user1',
      createdAt: new Date().toISOString()
    }
  ] as GCRating[],
  contractors: [] as Contractor[],
  contractorClaims: [] as ContractorClaim[],
  samAgentCalls: [] as SAMAgentCall[],
  prequalDocuments: [
    {
      id: '1',
      name: 'General Liability Insurance',
      documentType: 'insurance',
      expirationDate: '2026-06-30',
      fileUrl: '/uploads/prequal/gl-insurance.pdf',
      fileSize: 245000,
      status: 'valid',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Electrical License',
      documentType: 'license',
      expirationDate: '2026-03-15',
      fileUrl: '/uploads/prequal/electrical-license.pdf',
      fileSize: 125000,
      status: 'expiring_soon',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as PrequalDocument[],
  profitGuardBids: [] as ProfitGuardBid[],
  keywordCache: [] as KeywordCacheEntry[],
  savedKeywordLists: [] as SavedKeywordList[],
  leadSources: [
    // Sample lead source to show the feature
    {
      id: 'ls-1',
      userId: 'user1',
      name: 'Electrical Services - Miami',
      keywords: ['electrician near me', 'electrical contractor miami', 'licensed electrician miami'],
      generatedContent: '## Service Page: Electrical Services in Miami\n\nProfessional electrical services...',
      pageUrl: 'https://example.com/electrical-miami',
      filters: {
        trades: ['Electrical'],
        location: { city: 'Miami', state: 'Florida' },
        radiusMiles: 25,
        audience: 'GET_HIRED' as const,
        vertical: 'ALL' as const,
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      stats: {
        jobsLinked: 3,
        invoicesLinked: 2,
        amountPaid: 4500,
      },
    },
  ] as LeadSource[],
  callTrackingRecords: [] as CallTrackingRecord[],
  leadTimelineEvents: [] as LeadTimelineEvent[],
  leads: [
    // Sample leads to demonstrate the Leads Inbox
    {
      id: 'lead-1',
      userId: 'user1',
      leadSourceId: 'ls-1',
      sourceType: 'email' as const,
      sourceName: 'Thumbtack',
      name: 'John Martinez',
      email: 'john.martinez@email.com',
      phone: '(305) 555-0123',
      description: 'Need electrical work for kitchen remodel. Looking to install new outlets and update panel.',
      location: 'Miami, FL',
      trade: 'Electrical',
      estimatedValue: 2500,
      status: 'new' as const,
      priority: 'hot' as const,
      receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'lead-2',
      userId: 'user1',
      sourceType: 'call' as const,
      sourceName: 'Google Ads',
      name: 'Sarah Chen',
      phone: '(305) 555-0456',
      description: 'Incoming call - interested in commercial electrical installation',
      location: 'Coral Gables, FL',
      trade: 'Electrical',
      status: 'contacted' as const,
      priority: 'warm' as const,
      receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      lastContactedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'lead-3',
      userId: 'user1',
      sourceType: 'form' as const,
      sourceName: 'Website',
      name: 'Mike Johnson',
      email: 'mike.j@company.com',
      phone: '(786) 555-0789',
      company: 'Johnson Properties LLC',
      description: 'Need quote for rewiring a 3-unit apartment building',
      location: 'North Miami, FL',
      trade: 'Electrical',
      estimatedValue: 8000,
      status: 'quoted' as const,
      priority: 'hot' as const,
      convertedToEstimateId: 'est-1',
      receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'lead-4',
      userId: 'user1',
      sourceType: 'bid' as const,
      sourceName: 'City of Miami',
      company: 'City of Miami - Parks Dept',
      description: 'Electrical upgrades for community center. Public bid opportunity.',
      location: 'Miami, FL',
      trade: 'Electrical',
      estimatedValue: 25000,
      status: 'new' as const,
      priority: 'warm' as const,
      rawSubject: 'Bid Opportunity: Community Center Electrical Upgrade',
      receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ] as Lead[],
};

// Load contractor data from pre-populated dataset
try {
  const { contractorsData } = require('./contractors-data');
  if (Array.isArray(contractorsData)) {
    mockDb.contractors = contractorsData;
  }
} catch {
  // contractors-data.ts not yet generated — will be empty until scrapers run
  console.log('Note: contractors-data.ts not found. Run npm run build:contractors to populate.');
}

// Helper to get mock user (in production, use JWT verification)
export function getMockUserId(): string {
  return 'user1';
}

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate sequential numbers
export function generateInvoiceNumber(count: number): string {
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
}

export function generateEstimateNumber(count: number): string {
  return `EST-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
}
