// Keyword Intelligence Types

export type IntentCluster = 'hire-local' | 'work-acquisition' | 'bids-planroom' | 'admin-compliance';

export type Audience = 'GET_HIRED' | 'FIND_WORK';

export type ProjectType = 'RES' | 'COM' | 'IND' | 'ALL';

export interface KeywordResult {
  id: string;
  keyword: string;
  cluster: IntentCluster;
  source: 'heuristic' | 'api';
  score: number;
  volume?: number;
  cpc?: number;
  competition?: number;
  trend?: 'up' | 'down' | 'stable';
  estimatedVolume?: number;        // Monthly searches estimate
  potentialJobs?: number;          // Estimated jobs per month
}

export interface LocationInput {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

export interface KeywordRequest {
  trades: string[];
  location: LocationInput;
  radiusMiles: number;
  audience: Audience;
  vertical: ProjectType;
}

export interface KeywordResponse {
  generatedAt: string;
  source: 'heuristic' | 'api';
  cacheKey: string;
  keywords: KeywordResult[];
  stats: {
    total: number;
    byCluster: Record<IntentCluster, number>;
  };
}

export interface KeywordCacheEntry {
  id: string;
  cacheKey: string;
  request: KeywordRequest;
  response: KeywordResponse;
  createdAt: string;
  expiresAt: string;
}

export interface SavedKeywordList {
  id: string;
  userId: string;
  name: string;
  keywords: string[];
  filters: KeywordRequest;
  createdAt: string;
}

// Lead Source - tracks keywords → jobs → revenue
export interface LeadSource {
  id: string;
  userId: string;
  name: string;                    // e.g., "Electrical Services - Miami"
  keywords: string[];              // Keywords used to generate
  generatedContent: string;        // The service page content
  pageUrl?: string;                // Optional: URL where they published it
  filters: KeywordRequest;         // Original filter settings
  createdAt: string;

  // Tracking
  stats: {
    jobsLinked: number;            // Jobs that came from this source
    invoicesLinked: number;        // Invoices from those jobs
    amountPaid: number;            // Total paid from this source
  };
}

// Intent cluster display names and colors (user-friendly for subcontractors)
export const INTENT_CLUSTER_CONFIG: Record<
  IntentCluster,
  { name: string; description: string; color: string; bgColor: string }
> = {
  'hire-local': {
    name: 'Customers Looking for You',
    description: 'What property owners and GCs search when hiring contractors',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  'work-acquisition': {
    name: 'Find Subcontractor Jobs',
    description: 'Keywords for finding 1099 jobs and sub opportunities',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  'bids-planroom': {
    name: 'Bid Opportunities',
    description: 'Keywords for finding bids and plan room access',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  'admin-compliance': {
    name: 'Contracts & Paperwork',
    description: 'Keywords for contracts, insurance, and compliance docs',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
};

// Audience display config
export const AUDIENCE_CONFIG: Record<Audience, { label: string; description: string }> = {
  GET_HIRED: {
    label: 'Get Hired',
    description: 'Keywords property owners use to find contractors like you',
  },
  FIND_WORK: {
    label: 'Find Work',
    description: 'Keywords for finding subcontractor jobs and bid opportunities',
  },
};

// Project type display config
export const PROJECT_TYPE_CONFIG: Record<ProjectType, { label: string; abbrev: string }> = {
  RES: { label: 'Residential', abbrev: 'Res' },
  COM: { label: 'Commercial', abbrev: 'Com' },
  IND: { label: 'Industrial', abbrev: 'Ind' },
  ALL: { label: 'All Project Types', abbrev: 'All' },
};
