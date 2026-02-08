// RemoteOK API Integration
// Free public API - https://remoteok.io/api
// Returns JSON feed of remote jobs

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface RemoteOKJob {
  id: string;
  epoch: number;
  date: string;
  company: string;
  company_logo: string;
  position: string;
  tags: string[];
  logo: string;
  description: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  url: string;
}

export const remoteokAdapter: JobSourceAdapter = {
  name: 'remoteok',

  isConfigured: () => {
    // No API key required - always configured
    return true;
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    try {
      // RemoteOK API returns all jobs, we filter client-side
      const response = await fetch('https://remoteok.io/api', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SubPaid Job Aggregator',
        },
      });

      if (!response.ok) {
        console.error('RemoteOK API error:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();

      // First item is metadata, skip it
      const jobsData: RemoteOKJob[] = Array.isArray(data) ? data.slice(1) : [];

      // Filter jobs by keywords if provided
      let filteredJobs = jobsData;
      if (params.keywords && params.keywords.length > 0) {
        const keywordsLower = params.keywords.map(k => k.toLowerCase());
        filteredJobs = jobsData.filter(job => {
          const searchText = `${job.position || ''} ${job.description || ''} ${job.tags?.join(' ') || ''} ${job.company || ''}`.toLowerCase();
          return keywordsLower.some(keyword => searchText.includes(keyword));
        });
      }

      // Apply limit
      if (params.limit && filteredJobs.length > params.limit) {
        filteredJobs = filteredJobs.slice(0, params.limit);
      }

      // Transform RemoteOK jobs to our format
      const jobs: JobListingInput[] = filteredJobs
        .filter(job => job.id && job.position) // Filter out invalid entries
        .map((job) => {
          // Determine salary type based on amount
          let salaryType: 'hourly' | 'annual' | undefined;
          if (job.salary_min || job.salary_max) {
            // RemoteOK salaries are typically annual
            salaryType = 'annual';
          }

          // Determine job type from tags
          let jobType: 'full-time' | 'part-time' | 'contract' | undefined = 'full-time';
          if (job.tags) {
            const tagsLower = job.tags.map(t => t.toLowerCase());
            if (tagsLower.some(t => t.includes('part'))) jobType = 'part-time';
            else if (tagsLower.some(t => t.includes('contract') || t.includes('freelance'))) jobType = 'contract';
          }

          return {
            source: 'remoteok',
            externalId: String(job.id),
            externalUrl: job.url || `https://remoteok.io/l/${job.id}`,
            title: job.position,
            description: job.description,
            company: job.company,
            location: job.location || 'Remote',
            city: undefined,
            state: undefined,
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
            salaryType,
            category: job.tags?.length ? job.tags[0] : undefined,
            jobType,
            isRemote: true, // All RemoteOK jobs are remote
            postedAt: job.date ? new Date(job.date) : (job.epoch ? new Date(job.epoch * 1000) : new Date()),
            rawData: job,
          };
        });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from RemoteOK:', error);
      return [];
    }
  },
};
