// Jooble API Integration
// Free API - Register at https://jooble.org/api/about

import { JobSourceAdapter, JobListingInput, JobSearchParams, CONSTRUCTION_KEYWORDS } from './types';

interface JoobleJob {
  title: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  company: string;
  updated: string;
  id: string | number; // Jooble returns this as a number
}

interface JoobleResponse {
  totalCount: number;
  jobs: JoobleJob[];
}

export const joobleAdapter: JobSourceAdapter = {
  name: 'jooble',

  isConfigured: () => {
    return !!process.env.JOOBLE_API_KEY;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    const apiKey = process.env.JOOBLE_API_KEY;
    if (!apiKey) {
      console.warn('Jooble API key not configured');
      return [];
    }

    try {
      // Build search keywords - use construction-specific terms
      // Avoid using "OR" as a keyword since it matches "Operating Room"
      const keywords = params.keywords?.length
        ? params.keywords
        : ['construction', 'contractor', 'electrician', 'plumber', 'HVAC'];

      // Use the first keyword as the primary search term
      const searchQuery = keywords[0] + ' ' + keywords.slice(1).join(' ');

      // Build location string
      let locationQuery = '';
      if (params.state) {
        locationQuery = params.state;
      } else if (params.location) {
        locationQuery = params.location;
      }

      const requestBody = {
        keywords: searchQuery,
        location: locationQuery,
        page: params.page || 1,
      };

      const response = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error('Jooble API error:', response.status, response.statusText);
        return [];
      }

      const data: JoobleResponse = await response.json();

      // Transform Jooble jobs to our format
      const jobs: JobListingInput[] = data.jobs.map((job) => {
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
        if (job.location) {
          const locationParts = job.location.split(',').map(s => s.trim());
          if (locationParts.length >= 2) {
            city = locationParts[0];
            // Try to extract state code
            const stateMatch = locationParts[1].match(/([A-Z]{2})/);
            if (stateMatch) {
              state = stateMatch[1];
            }
          }
        }

        // Determine job type
        let jobType: 'full-time' | 'part-time' | 'contract' | undefined;
        const typeStr = (job.type || '').toLowerCase();
        if (typeStr.includes('full')) jobType = 'full-time';
        else if (typeStr.includes('part')) jobType = 'part-time';
        else if (typeStr.includes('contract')) jobType = 'contract';

        return {
          source: 'jooble',
          externalId: String(job.id) || `jooble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          externalUrl: job.link,
          title: job.title,
          description: job.snippet,
          company: job.company,
          location: job.location,
          city,
          state,
          salaryMin,
          salaryMax,
          salaryType,
          jobType,
          isRemote: job.location?.toLowerCase().includes('remote') || false,
          postedAt: job.updated ? new Date(job.updated) : new Date(),
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from Jooble:', error);
      return [];
    }
  },
};
