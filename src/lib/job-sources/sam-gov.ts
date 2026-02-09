// SAM.gov API Integration
// Free API - Register at https://sam.gov and request API key

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface SamOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  department: string;
  subTier: string;
  office: string;
  type: { value: string; description: string };
  baseType: string;
  postedDate: string;
  responseDeadLine: string;
  naicsCode: string;
  classificationCode: string;
  active: string;
  award: { amount: number } | null;
  description: string;
  organizationType: string;
  uiLink: string;
  placeOfPerformance?: {
    city: { name: string };
    state: { code: string; name: string };
    zip: string;
    country: { code: string };
  };
}

interface SamResponse {
  totalRecords: number;
  opportunitiesData: SamOpportunity[];
}

// Construction-related NAICS codes
const CONSTRUCTION_NAICS = [
  '236', // Construction of Buildings
  '237', // Heavy and Civil Engineering Construction
  '238', // Specialty Trade Contractors
  '2361', // Residential Building Construction
  '2362', // Nonresidential Building Construction
  '2371', // Utility System Construction
  '2372', // Land Subdivision
  '2373', // Highway, Street, and Bridge Construction
  '2379', // Other Heavy Construction
  '2381', // Foundation, Structure, and Building Exterior Contractors
  '2382', // Building Equipment Contractors
  '2383', // Building Finishing Contractors
  '2389', // Other Specialty Trade Contractors
];

export const samGovAdapter: JobSourceAdapter = {
  name: 'sam_gov',

  isConfigured: () => {
    return !!process.env.SAM_GOV_API_KEY;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    const apiKey = process.env.SAM_GOV_API_KEY;
    if (!apiKey) {
      console.warn('SAM.gov API key not configured');
      return [];
    }

    try {
      // Build the API request
      const baseUrl = 'https://api.sam.gov/opportunities/v2/search';

      // Use NAICS codes to filter for construction opportunities
      const naicsFilter = CONSTRUCTION_NAICS.slice(0, 5).join(',');

      const limit = params.limit || 100; // SAM.gov allows up to 1000
      const urlParams = new URLSearchParams({
        api_key: apiKey,
        limit: limit.toString(),
        offset: (((params.page || 1) - 1) * limit).toString(),
        postedFrom: getDateDaysAgo(90), // Last 90 days
        postedTo: getTodayDate(),
      });

      // Only add NAICS filter if not doing bulk import (to get more variety)
      if (params.keywords?.length || params.state) {
        urlParams.append('naics', naicsFilter);
      }

      // Add location filter if provided
      if (params.state) {
        urlParams.append('state', params.state);
      }

      // Add keyword search if provided
      if (params.keywords?.length) {
        urlParams.append('q', params.keywords.join(' '));
      }

      const response = await fetch(`${baseUrl}?${urlParams.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('SAM.gov API error:', response.status, response.statusText);
        return [];
      }

      const data: SamResponse = await response.json();

      if (!data.opportunitiesData) {
        return [];
      }

      // Transform SAM.gov opportunities to our format
      const jobs: JobListingInput[] = data.opportunitiesData.map((opp) => {
        const place = opp.placeOfPerformance;

        return {
          source: 'sam_gov',
          externalId: opp.noticeId,
          externalUrl: opp.uiLink || `https://sam.gov/opp/${opp.noticeId}/view`,
          title: opp.title,
          description: opp.description?.substring(0, 2000), // Truncate long descriptions
          company: `${opp.department} - ${opp.office}`.trim(),
          location: place
            ? `${place.city?.name || ''}, ${place.state?.code || ''} ${place.zip || ''}`.trim()
            : undefined,
          city: place?.city?.name,
          state: place?.state?.code,
          zipCode: place?.zip,
          contractValue: opp.award?.amount,
          salaryType: 'contract',
          category: getCategoryFromNaics(opp.naicsCode),
          jobType: 'bid',
          isRemote: false,
          postedAt: opp.postedDate ? new Date(opp.postedDate) : new Date(),
          deadline: opp.responseDeadLine ? new Date(opp.responseDeadLine) : undefined,
          rawData: opp,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching opportunities from SAM.gov:', error);
      return [];
    }
  },
};

// Helper to get date string in MM/dd/yyyy format (SAM.gov requirement)
function getTodayDate(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Map NAICS codes to our categories
function getCategoryFromNaics(naicsCode: string): string {
  if (!naicsCode) return 'general';

  const code = naicsCode.substring(0, 4);

  const categoryMap: Record<string, string> = {
    '2381': 'general', // Foundation, Structure contractors
    '2382': 'hvac', // Building Equipment (includes HVAC, electrical, plumbing)
    '2383': 'general', // Building Finishing
    '2361': 'general', // Residential Construction
    '2362': 'general', // Nonresidential Construction
    '2371': 'general', // Utility Construction
    '2373': 'general', // Highway/Bridge Construction
  };

  return categoryMap[code] || 'general';
}
