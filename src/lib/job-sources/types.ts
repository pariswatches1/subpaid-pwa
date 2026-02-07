// Common types for job source adapters

export interface JobListingInput {
  source: string;
  externalId: string;
  externalUrl?: string;
  title: string;
  description?: string;
  company?: string;
  location?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  contractValue?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: 'hourly' | 'annual' | 'contract';
  category?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'bid';
  isRemote?: boolean;
  postedAt?: Date;
  deadline?: Date;
  expiresAt?: Date;
  rawData?: object;
}

export interface JobSearchParams {
  keywords?: string[];
  location?: string;
  state?: string;
  category?: string;
  limit?: number;
  page?: number;
}

export interface JobSourceAdapter {
  name: string;
  isConfigured: () => boolean;
  fetchJobs: (params: JobSearchParams) => Promise<JobListingInput[]>;
}

// Construction-related keywords for job searches
export const CONSTRUCTION_KEYWORDS = [
  'contractor',
  'construction',
  'electrician',
  'plumber',
  'plumbing',
  'HVAC',
  'roofing',
  'carpentry',
  'carpenter',
  'masonry',
  'concrete',
  'framing',
  'drywall',
  'painting contractor',
  'general contractor',
  'subcontractor',
  'building trades',
];

// Map job categories to search terms
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  electrical: ['electrician', 'electrical contractor', 'electrical work'],
  plumbing: ['plumber', 'plumbing contractor', 'plumbing work'],
  hvac: ['HVAC', 'heating', 'air conditioning', 'HVAC technician'],
  roofing: ['roofing', 'roofer', 'roofing contractor'],
  general: ['general contractor', 'construction', 'building contractor'],
  carpentry: ['carpenter', 'carpentry', 'woodwork'],
  masonry: ['masonry', 'mason', 'bricklayer', 'concrete'],
  painting: ['painting contractor', 'painter', 'commercial painting'],
};

// US State codes for filtering
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];
