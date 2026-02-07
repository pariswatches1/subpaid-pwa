// Job Source Aggregator - Combines all job sources into unified feed

import { JobSourceAdapter, JobListingInput, JobSearchParams } from './types';
import { joobleAdapter } from './jooble';
import { adzunaAdapter } from './adzuna';
import { samGovAdapter } from './sam-gov';

// All available job source adapters
const allAdapters: JobSourceAdapter[] = [
  joobleAdapter,
  adzunaAdapter,
  samGovAdapter,
];

// Get only configured adapters (have API keys)
export function getConfiguredAdapters(): JobSourceAdapter[] {
  return allAdapters.filter(adapter => adapter.isConfigured());
}

// Get all adapter names
export function getAllSourceNames(): string[] {
  return allAdapters.map(adapter => adapter.name);
}

// Fetch jobs from all configured sources
export async function fetchJobsFromAllSources(
  params: JobSearchParams
): Promise<JobListingInput[]> {
  const configuredAdapters = getConfiguredAdapters();

  if (configuredAdapters.length === 0) {
    console.warn('No job source adapters are configured. Please add API keys.');
    return [];
  }

  console.log(`Fetching jobs from ${configuredAdapters.length} sources:`,
    configuredAdapters.map(a => a.name).join(', '));

  // Fetch from all sources in parallel
  const results = await Promise.allSettled(
    configuredAdapters.map(adapter => adapter.fetchJobs(params))
  );

  // Combine all successful results
  const allJobs: JobListingInput[] = [];

  results.forEach((result, index) => {
    const adapterName = configuredAdapters[index].name;

    if (result.status === 'fulfilled') {
      console.log(`${adapterName}: fetched ${result.value.length} jobs`);
      allJobs.push(...result.value);
    } else {
      console.error(`${adapterName}: failed -`, result.reason);
    }
  });

  // Sort by posted date (newest first)
  allJobs.sort((a, b) => {
    const dateA = a.postedAt?.getTime() || 0;
    const dateB = b.postedAt?.getTime() || 0;
    return dateB - dateA;
  });

  return allJobs;
}

// Fetch jobs from a specific source
export async function fetchJobsFromSource(
  sourceName: string,
  params: JobSearchParams
): Promise<JobListingInput[]> {
  const adapter = allAdapters.find(a => a.name === sourceName);

  if (!adapter) {
    throw new Error(`Unknown job source: ${sourceName}`);
  }

  if (!adapter.isConfigured()) {
    throw new Error(`Job source ${sourceName} is not configured. Please add API key.`);
  }

  return adapter.fetchJobs(params);
}

// Check which sources are configured
export function getSourceStatus(): { name: string; configured: boolean }[] {
  return allAdapters.map(adapter => ({
    name: adapter.name,
    configured: adapter.isConfigured(),
  }));
}
