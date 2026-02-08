// USAJobs API Integration
// Free API - Apply at https://developer.usajobs.gov/APIRequest/Index
// US Government job listings

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';

interface USAJobsPosition {
  PositionID: string;
  PositionTitle: string;
  PositionURI: string;
  ApplyURI: string[];
  PositionLocationDisplay: string;
  PositionLocation: Array<{
    LocationName: string;
    CountryCode: string;
    CountrySubDivisionCode: string;
    CityName: string;
  }>;
  OrganizationName: string;
  DepartmentName: string;
  JobCategory: Array<{
    Name: string;
    Code: string;
  }>;
  JobGrade: Array<{
    Code: string;
  }>;
  PositionSchedule: Array<{
    Name: string;
    Code: string;
  }>;
  PositionOfferingType: Array<{
    Name: string;
    Code: string;
  }>;
  QualificationSummary: string;
  PositionRemuneration: Array<{
    MinimumRange: string;
    MaximumRange: string;
    RateIntervalCode: string;
    Description: string;
  }>;
  PositionStartDate: string;
  PositionEndDate: string;
  PublicationStartDate: string;
  ApplicationCloseDate: string;
}

interface USAJobsResponse {
  SearchResult: {
    SearchResultCount: number;
    SearchResultCountAll: number;
    SearchResultItems: Array<{
      MatchedObjectId: string;
      MatchedObjectDescriptor: USAJobsPosition;
    }>;
  };
}

export const usajobsAdapter: JobSourceAdapter = {
  name: 'usajobs',

  isConfigured: () => {
    return !!(process.env.USAJOBS_API_KEY && process.env.USAJOBS_EMAIL);
  },

  fetchJobs: async (params: JobSearchParams): Promise<JobListingInput[]> => {
    const apiKey = process.env.USAJOBS_API_KEY;
    const email = process.env.USAJOBS_EMAIL;

    if (!apiKey || !email) {
      console.warn('USAJobs API credentials not configured');
      return [];
    }

    try {
      // Build URL with search parameters
      const url = new URL('https://data.usajobs.gov/api/search');

      // Add keyword search
      if (params.keywords && params.keywords.length > 0) {
        url.searchParams.append('Keyword', params.keywords.join(' '));
      } else {
        // Default to construction-related keywords
        url.searchParams.append('Keyword', 'construction contractor electrician plumber');
      }

      // Add location filter
      if (params.location) {
        url.searchParams.append('LocationName', params.location);
      } else if (params.state) {
        url.searchParams.append('LocationName', params.state);
      }

      // Results per page
      url.searchParams.append('ResultsPerPage', String(params.limit || 50));

      // Page number
      if (params.page && params.page > 1) {
        url.searchParams.append('Page', String(params.page));
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization-Key': apiKey,
          'User-Agent': email,
          'Host': 'data.usajobs.gov',
        },
      });

      if (!response.ok) {
        console.error('USAJobs API error:', response.status, response.statusText);
        return [];
      }

      const data: USAJobsResponse = await response.json();

      if (!data.SearchResult?.SearchResultItems) {
        return [];
      }

      // Transform USAJobs to our format
      const jobs: JobListingInput[] = data.SearchResult.SearchResultItems.map((item) => {
        const job = item.MatchedObjectDescriptor;

        // Parse salary
        let salaryMin: number | undefined;
        let salaryMax: number | undefined;
        let salaryType: 'hourly' | 'annual' | undefined;

        if (job.PositionRemuneration && job.PositionRemuneration.length > 0) {
          const remun = job.PositionRemuneration[0];
          salaryMin = parseFloat(remun.MinimumRange) || undefined;
          salaryMax = parseFloat(remun.MaximumRange) || undefined;

          // Check rate interval
          if (remun.RateIntervalCode === 'PH') {
            salaryType = 'hourly';
          } else {
            salaryType = 'annual';
          }
        }

        // Parse location
        let city: string | undefined;
        let state: string | undefined;
        if (job.PositionLocation && job.PositionLocation.length > 0) {
          const loc = job.PositionLocation[0];
          city = loc.CityName;
          state = loc.CountrySubDivisionCode;
        }

        // Determine job type from schedule
        let jobType: 'full-time' | 'part-time' | 'contract' | undefined = 'full-time';
        if (job.PositionSchedule && job.PositionSchedule.length > 0) {
          const schedule = job.PositionSchedule[0].Name?.toLowerCase() || '';
          if (schedule.includes('part')) jobType = 'part-time';
          else if (schedule.includes('intermittent') || schedule.includes('temporary')) jobType = 'contract';
        }

        // Get category
        const category = job.JobCategory && job.JobCategory.length > 0
          ? job.JobCategory[0].Name
          : undefined;

        return {
          source: 'usajobs',
          externalId: job.PositionID,
          externalUrl: job.PositionURI,
          title: job.PositionTitle,
          description: job.QualificationSummary,
          company: job.OrganizationName || job.DepartmentName,
          location: job.PositionLocationDisplay,
          city,
          state,
          salaryMin,
          salaryMax,
          salaryType,
          category,
          jobType,
          isRemote: job.PositionLocationDisplay?.toLowerCase().includes('remote') || false,
          postedAt: job.PublicationStartDate ? new Date(job.PublicationStartDate) : new Date(),
          deadline: job.ApplicationCloseDate ? new Date(job.ApplicationCloseDate) : undefined,
          rawData: job,
        };
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from USAJobs:', error);
      return [];
    }
  },
};
