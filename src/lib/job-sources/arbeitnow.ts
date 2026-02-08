// Arbeitnow API Integration
// Free public API - https://www.arbeitnow.com/api/job-board-api
// European job board with international positions

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number; // Unix timestamp
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    terms: string;
    info: string;
  };
}

export const arbeitnowAdapter: JobSourceAdapter = {
  name: 'arbeitnow',

  isConfigured: () => {
    // No API key required - always configured
    return true;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    try {
      // Build URL with pagination
      const page = params.page || 1;
      const url = `https://www.arbeitnow.com/api/job-board-api?page=${page}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Arbeitnow API error:', response.status, response.statusText);
        return [];
      }

      const data: ArbeitnowResponse = await response.json();

      // Filter jobs by keywords if provided
      let filteredJobs = data.data;
      if (params.keywords && params.keywords.length > 0) {
        const keywordsLower = params.keywords.map(k => k.toLowerCase());
        filteredJobs = data.data.filter(job => {
          const searchText = `${job.title} ${job.description} ${job.tags?.join(' ') || ''} ${job.company_name}`.toLowerCase();
          return keywordsLower.some(keyword => searchText.includes(keyword));
        });
      }

      // Apply limit
      if (params.limit && filteredJobs.length > params.limit) {
        filteredJobs = filteredJobs.slice(0, params.limit);
      }

      // Transform Arbeitnow jobs to our format
      const jobs: JobListingInput[] = filteredJobs.map((job) => {
        // Determine job type
        let jobType: 'full-time' | 'part-time' | 'contract' | undefined;
        if (job.job_types && job.job_types.length > 0) {
          const typeStr = job.job_types[0].toLowerCase();
          if (typeStr.includes('full')) jobType = 'full-time';
          else if (typeStr.includes('part')) jobType = 'part-time';
          else if (typeStr.includes('contract') || typeStr.includes('freelance')) jobType = 'contract';
        }

        // Parse location for city/country
        let city: string | undefined;
        let state: string | undefined;
        if (job.location) {
          const locationParts = job.location.split(',').map(s => s.trim());
          if (locationParts.length >= 1) {
            city = locationParts[0];
          }
          if (locationParts.length >= 2) {
            state = locationParts[1];
          }
        }

        return {
          source: 'arbeitnow',
          externalId: job.slug,
          externalUrl: job.url,
          title: job.title,
          description: job.description,
          company: job.company_name,
          location: job.location || (job.remote ? 'Remote' : undefined),
          city,
          state,
          salaryMin: undefined,
          salaryMax: undefined,
          salaryType: undefined,
          category: job.tags?.length ? job.tags[0] : undefined,
          jobType,
          isRemote: job.remote,
          postedAt: job.created_at ? new Date(job.created_at * 1000) : new Date(),
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from Arbeitnow:', error);
      return [];
    }
  },
};
