// Reed API Integration
// Free API - Register at https://www.reed.co.uk/developers
// UK job board with international listings
// Rate limit: 1000 requests per day

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface ReedJob {
  jobId: number;
  employerId: number;
  employerName: string;
  employerProfileId: number | null;
  employerProfileName: string | null;
  jobTitle: string;
  locationName: string;
  minimumSalary: number | null;
  maximumSalary: number | null;
  currency: string;
  expirationDate: string;
  date: string;
  jobDescription: string;
  applications: number;
  jobUrl: string;
}

interface ReedResponse {
  results: ReedJob[];
  totalResults: number;
}

export const reedAdapter: JobSourceAdapter = {
  name: 'reed',

  isConfigured: () => {
    return !!process.env.REED_API_KEY;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    const apiKey = process.env.REED_API_KEY;

    if (!apiKey) {
      console.warn('Reed API key not configured');
      return [];
    }

    try {
      // Build URL with search parameters
      const url = new URL('https://www.reed.co.uk/api/1.0/search');

      // Add keyword search
      if (params.keywords && params.keywords.length > 0) {
        url.searchParams.append('keywords', params.keywords.join(' '));
      } else {
        // Default to construction-related keywords
        url.searchParams.append('keywords', 'construction contractor builder');
      }

      // Add location filter
      if (params.location) {
        url.searchParams.append('locationName', params.location);
      }

      // Results per page
      url.searchParams.append('resultsToTake', String(params.limit || 50));

      // Skip for pagination
      if (params.page && params.page > 1) {
        url.searchParams.append('resultsToSkip', String((params.page - 1) * (params.limit || 50)));
      }

      // Create Basic auth header (API key as username, empty password)
      const auth = Buffer.from(`${apiKey}:`).toString('base64');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Reed API error:', response.status, response.statusText);
        return [];
      }

      const data: ReedResponse = await response.json();

      if (!data.results) {
        return [];
      }

      // Transform Reed jobs to our format
      const jobs: JobListingInput[] = data.results.map((job) => {
        // Parse salary - Reed provides annual salaries
        let salaryMin: number | undefined;
        let salaryMax: number | undefined;
        let salaryType: 'hourly' | 'annual' | undefined = 'annual';

        if (job.minimumSalary) {
          salaryMin = job.minimumSalary;
        }
        if (job.maximumSalary) {
          salaryMax = job.maximumSalary;
        }

        // Parse location for city
        let city: string | undefined;
        if (job.locationName) {
          const locationParts = job.locationName.split(',').map(s => s.trim());
          if (locationParts.length >= 1) {
            city = locationParts[0];
          }
        }

        return {
          source: 'reed',
          externalId: String(job.jobId),
          externalUrl: job.jobUrl,
          title: job.jobTitle,
          description: job.jobDescription,
          company: job.employerName,
          location: job.locationName,
          city,
          state: undefined, // Reed is UK-based, no US states
          salaryMin,
          salaryMax,
          salaryType,
          category: undefined,
          jobType: 'full-time', // Reed doesn't always specify
          isRemote: job.locationName?.toLowerCase().includes('remote') ||
                    job.locationName?.toLowerCase().includes('work from home') || false,
          postedAt: job.date ? new Date(job.date) : new Date(),
          expiresAt: job.expirationDate ? new Date(job.expirationDate) : undefined,
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from Reed:', error);
      return [];
    }
  },
};
