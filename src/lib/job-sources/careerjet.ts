// CareerJet API Integration
// Affiliate API - Register at https://www.careerjet.com/partners/
// Global job aggregator

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface CareerjetJob {
  url: string;
  title: string;
  company: string;
  locations: string;
  date: string;
  description: string;
  salary: string;
  site: string;
}

interface CareerjetResponse {
  type: string;
  hits: number;
  message: string;
  pages: number;
  response_time: number;
  jobs: CareerjetJob[];
}

export const careerjetAdapter: JobSourceAdapter = {
  name: 'careerjet',

  isConfigured: () => {
    return !!process.env.CAREERJET_AFFID;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    const affid = process.env.CAREERJET_AFFID;

    if (!affid) {
      console.warn('CareerJet affiliate ID not configured');
      return [];
    }

    try {
      // Build URL with search parameters
      const url = new URL('https://public.api.careerjet.net/search');

      // Required parameters
      url.searchParams.append('locale_code', 'en_US');
      url.searchParams.append('affid', affid);

      // Add keyword search
      if (params.keywords && params.keywords.length > 0) {
        url.searchParams.append('keywords', params.keywords.join(' '));
      } else {
        // Default to construction-related keywords
        url.searchParams.append('keywords', 'construction contractor electrician plumber');
      }

      // Add location filter
      if (params.location) {
        url.searchParams.append('location', params.location);
      } else if (params.state) {
        url.searchParams.append('location', params.state);
      }

      // Results per page
      url.searchParams.append('pagesize', String(params.limit || 50));

      // Page number (1-indexed)
      url.searchParams.append('page', String(params.page || 1));

      // Sort by date
      url.searchParams.append('sort', 'date');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('CareerJet API error:', response.status, response.statusText);
        return [];
      }

      const data: CareerjetResponse = await response.json();

      if (data.type !== 'JOBS' || !data.jobs) {
        return [];
      }

      // Transform CareerJet jobs to our format
      const jobs: JobListingInput[] = data.jobs.map((job, index) => {
        // Parse salary if available
        let salaryMin: number | undefined;
        let salaryMax: number | undefined;
        let salaryType: 'hourly' | 'annual' | undefined;

        if (job.salary) {
          const salaryMatch = job.salary.match(/\$?([\d,]+)/g);
          if (salaryMatch && salaryMatch.length > 0) {
            salaryMin = parseInt(salaryMatch[0].replace(/[$,]/g, ''));
            if (salaryMatch.length > 1) {
              salaryMax = parseInt(salaryMatch[1].replace(/[$,]/g, ''));
            }
            salaryType = job.salary.toLowerCase().includes('hour') ? 'hourly' : 'annual';
          }
        }

        // Parse location for city/state
        let city: string | undefined;
        let state: string | undefined;
        if (job.locations) {
          const locationParts = job.locations.split(',').map(s => s.trim());
          if (locationParts.length >= 1) {
            city = locationParts[0];
          }
          if (locationParts.length >= 2) {
            // Try to extract state code
            const stateMatch = locationParts[1].match(/([A-Z]{2})/);
            if (stateMatch) {
              state = stateMatch[1];
            }
          }
        }

        // Generate unique ID from URL or position
        const externalId = job.url
          ? Buffer.from(job.url).toString('base64').slice(0, 50)
          : `careerjet-${Date.now()}-${index}`;

        return {
          source: 'careerjet',
          externalId,
          externalUrl: job.url,
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.locations,
          city,
          state,
          salaryMin,
          salaryMax,
          salaryType,
          category: undefined,
          jobType: 'full-time', // CareerJet doesn't always specify
          isRemote: job.locations?.toLowerCase().includes('remote') || false,
          postedAt: job.date ? new Date(job.date) : new Date(),
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from CareerJet:', error);
      return [];
    }
  },
};
