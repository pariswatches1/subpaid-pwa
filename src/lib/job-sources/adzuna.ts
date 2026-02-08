// Adzuna API Integration
// Free API - Register at https://developer.adzuna.com

import { JobSourceAdapter, JobListingInput, JobSearchParams, CONSTRUCTION_KEYWORDS } from './types';

interface AdzunaJob {
  id: string | number; // Can be number from API
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_type?: string;
  contract_time?: string;
  redirect_url: string;
  created: string;
  category: { label: string; tag: string };
}

interface AdzunaResponse {
  count: number;
  results: AdzunaJob[];
}

export const adzunaAdapter: JobSourceAdapter = {
  name: 'adzuna',

  isConfigured: () => {
    return !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      console.warn('Adzuna API credentials not configured');
      return [];
    }

    try {
      // Build search query - use construction-specific terms
      const keywords = params.keywords?.length
        ? params.keywords
        : ['construction', 'contractor', 'electrician'];

      const searchQuery = keywords.join(' ');
      const page = params.page || 1;
      const limit = params.limit || 20;

      // Build URL with query params
      const baseUrl = `https://api.adzuna.com/v1/api/jobs/us/search/${page}`;
      const urlParams = new URLSearchParams({
        app_id: appId,
        app_key: appKey,
        what: searchQuery,
        results_per_page: limit.toString(),
      });

      // Add location filter if provided - prefer specific location over state
      if (params.location) {
        urlParams.append('where', params.location);
      } else if (params.state) {
        urlParams.append('where', params.state);
      }

      // Don't filter by category - the keyword search is sufficient
      // and category filter was too restrictive

      const fullUrl = `${baseUrl}?${urlParams.toString()}`;
      console.log('Adzuna API URL:', fullUrl);

      const response = await fetch(fullUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Adzuna API error:', response.status, response.statusText, errorText);
        return [];
      }

      const data: AdzunaResponse = await response.json();

      console.log(`Adzuna API returned ${data.results?.length || 0} jobs (total count: ${data.count})`);

      if (!data.results || data.results.length === 0) {
        return [];
      }

      // Transform Adzuna jobs to our format
      const jobs: JobListingInput[] = data.results.map((job) => {
        // Parse location for city/state
        let city: string | undefined;
        let state: string | undefined;
        if (job.location?.area?.length > 0) {
          // Adzuna provides area as array: ["US", "State", "City"]
          const areas = job.location.area;
          if (areas.length >= 3) {
            state = areas[1];
            city = areas[2];
          } else if (areas.length === 2) {
            state = areas[1];
          }
        }

        // Determine job type
        let jobType: 'full-time' | 'part-time' | 'contract' | undefined;
        const contractTime = (job.contract_time || '').toLowerCase();
        const contractType = (job.contract_type || '').toLowerCase();

        if (contractTime.includes('full')) jobType = 'full-time';
        else if (contractTime.includes('part')) jobType = 'part-time';
        else if (contractType.includes('contract') || contractType.includes('temp')) jobType = 'contract';

        // Determine salary type
        let salaryType: 'hourly' | 'annual' | undefined;
        if (job.salary_min && job.salary_min < 200) {
          salaryType = 'hourly';
        } else if (job.salary_min) {
          salaryType = 'annual';
        }

        return {
          source: 'adzuna',
          externalId: String(job.id),
          externalUrl: job.redirect_url,
          title: job.title,
          description: job.description,
          company: job.company?.display_name,
          location: job.location?.display_name,
          city,
          state,
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
          salaryType,
          category: job.category?.label,
          jobType,
          isRemote: job.location?.display_name?.toLowerCase().includes('remote') || false,
          postedAt: job.created ? new Date(job.created) : new Date(),
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from Adzuna:', error);
      return [];
    }
  },
};
