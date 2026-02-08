// Remotive API Integration
// Free public API - https://remotive.com/api/remote-jobs
// Rate limit: Max 4 times per day, no more than 2 requests per minute

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

interface RemotiveResponse {
  'job-count': number;
  jobs: RemotiveJob[];
}

export const remotiveAdapter: JobSourceAdapter = {
  name: 'remotive',

  isConfigured: () => {
    // No API key required - always configured
    return true;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    try {
      // Build URL with search parameters
      const url = new URL('https://remotive.com/api/remote-jobs');

      // Remotive supports category filter
      // Categories: software-dev, customer-support, design, marketing, sales, product, etc.
      if (params.category) {
        url.searchParams.append('category', params.category);
      }

      // Limit results
      if (params.limit) {
        url.searchParams.append('limit', String(params.limit));
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Remotive API error:', response.status, response.statusText);
        return [];
      }

      const data: RemotiveResponse = await response.json();

      // Filter jobs by keywords if provided
      let filteredJobs = data.jobs;
      if (params.keywords && params.keywords.length > 0) {
        const keywordsLower = params.keywords.map(k => k.toLowerCase());
        filteredJobs = data.jobs.filter(job => {
          const searchText = `${job.title} ${job.description} ${job.tags?.join(' ') || ''}`.toLowerCase();
          return keywordsLower.some(keyword => searchText.includes(keyword));
        });
      }

      // Transform Remotive jobs to our format
      const jobs: JobListingInput[] = filteredJobs.map((job) => {
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
            // Remotive salaries are typically annual
            salaryType = 'annual';
          }
        }

        // Parse location
        const location = job.candidate_required_location || 'Remote';

        // Determine job type
        let jobType: 'full-time' | 'part-time' | 'contract' | undefined;
        const typeStr = (job.job_type || '').toLowerCase();
        if (typeStr.includes('full')) jobType = 'full-time';
        else if (typeStr.includes('part')) jobType = 'part-time';
        else if (typeStr.includes('contract') || typeStr.includes('freelance')) jobType = 'contract';

        return {
          source: 'remotive',
          externalId: String(job.id),
          externalUrl: job.url,
          title: job.title,
          description: job.description,
          company: job.company_name,
          location: location,
          city: undefined,
          state: undefined,
          salaryMin,
          salaryMax,
          salaryType,
          category: job.category,
          jobType,
          isRemote: true, // All Remotive jobs are remote
          postedAt: job.publication_date ? new Date(job.publication_date) : new Date(),
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from Remotive:', error);
      return [];
    }
  },
};
